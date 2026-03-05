import {
    StudentProfile, User, Program, Section, StudentSection, AdmissionLog
} from '../../../models/index.js';
import catchAsync from '../../../utils/catchAsync.js';
import AppError from '../../../utils/appError.js';
import logger from '../../../utils/logger.js';
import { logAudit } from '../../admin/utils/audit.util.js';
import { sequelize } from '../../../config/database.js';
import { Op } from 'sequelize';
import fs from 'fs';
import csv from 'csv-parser';

/**
 * Generate formal registration number
 * Format: CAMP-[Year]-[ProgramCode]-[Sequence]
 */
const generateRegistrationNumber = async (batchYear, programId) => {
    const program = await Program.findByPk(programId);
    if (!program) throw new Error('Program not found');

    const count = await StudentProfile.count({
        where: { batchYear, programId }
    });

    const sequence = (count + 1).toString().padStart(4, '0');
    return `CAMP-${batchYear}-${program.code}-${sequence}`;
};

/**
 * Single Student Admission
 */
export const admitStudent = catchAsync(async (req, res, next) => {
    const transaction = await sequelize.transaction();

    try {
        const { firstName, lastName, email, password, programId, batchYear } = req.body;

        // 1. Create User
        const user = await User.create({
            firstName, lastName, email, password, role: 'Student'
        }, { transaction });

        // 2. Generate Reg No
        const registrationNumber = await generateRegistrationNumber(batchYear, programId);

        // 3. Create Profile
        const profile = await StudentProfile.create({
            userId: user.id,
            registrationNumber,
            programId,
            batchYear
        }, { transaction });

        // 4. Log Admission
        await AdmissionLog.create({
            studentProfileId: profile.userId,
            academicYear: `${batchYear}-${batchYear + 1}`,
            admissionType: req.body.admissionType || 'Regular'
        }, { transaction });

        await transaction.commit();

        res.status(201).json({
            status: 'success',
            data: { user, profile }
        });

        await logAudit({ action: 'STUDENT_ADMIT', resource: 'StudentProfile', resourceId: user.id }, req);

    } catch (error) {
        await transaction.rollback();
        return next(new AppError(error.message, 400));
    }
});

/**
 * Bulk Import Students via CSV
 */
export const bulkImportStudents = catchAsync(async (req, res, next) => {
    if (!req.file) return next(new AppError('Please upload a CSV file', 400));

    const results = [];
    const errors = [];
    let rowCount = 0;

    fs.createReadStream(req.file.path)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', async () => {
            const transaction = await sequelize.transaction();
            try {
                for (const row of results) {
                    rowCount++;
                    try {
                        // Basic validation
                        if (!row.email || !row.firstName || !row.programId) {
                            errors.push({ row: rowCount, error: 'Missing required fields' });
                            continue;
                        }

                        // Create User
                        const user = await User.create({
                            firstName: row.firstName,
                            lastName: row.lastName,
                            email: row.email,
                            password: row.password || 'Student@123',
                            role: 'Student'
                        }, { transaction });

                        const regNo = await generateRegistrationNumber(row.batchYear, row.programId);

                        await StudentProfile.create({
                            userId: user.id,
                            registrationNumber: regNo,
                            rollNumber: row.rollNumber,
                            programId: row.programId,
                            batchYear: row.batchYear
                        }, { transaction });

                    } catch (err) {
                        errors.push({ row: rowCount, error: err.message });
                    }
                }

                if (errors.length > 0) {
                    await transaction.rollback();
                    return res.status(400).json({
                        status: 'fail',
                        message: 'Bulk import failed with errors',
                        errors
                    });
                }

                await transaction.commit();
                fs.unlinkSync(req.file.path);

                res.status(200).json({
                    status: 'success',
                    message: `Successfully imported ${rowCount} students`
                });

            } catch (error) {
                await transaction.rollback();
                fs.unlinkSync(req.file.path);
                return next(new AppError('Internal Server Error during bulk import', 500));
            }
        });
});

/**
 * Get Students with Filters
 */
export const getStudents = catchAsync(async (req, res, next) => {
    logger.debug('Fetching students with query: %o', req.query);
    const { programId, semester, status } = req.query;
    const where = {};
    if (programId && programId !== '') where.programId = programId;
    if (semester && semester !== '') where.currentSemester = semester;
    if (status && status !== '') where.status = status;

    const students = await StudentProfile.findAll({
        where,
        include: [{ model: User, as: 'user', attributes: ['firstName', 'lastName', 'email'] }]
    });

    res.status(200).json({ status: 'success', data: students });
});
