import { StudentProfile, Enrollment } from '../models/index.js';
import User from '../../users/models/user.model.js';
import catchAsync from '../../../utils/catchAsync.js';
import AppError from '../../../utils/appError.js';
import { logAudit } from '../../admin/utils/audit.util.js';
import { sequelize } from '../../../config/database.js';

/**
 * Register a new student (Admission)
 */
export const admitStudent = catchAsync(async (req, res, next) => {
    const { userId, rollNumber, programId, batchYear } = req.body;

    const profile = await StudentProfile.create({
        userId,
        rollNumber,
        programId,
        batchYear
    });

    res.status(201).json({
        status: 'success',
        data: profile
    });

    await logAudit({ action: 'STUDENT_ADMIT', resource: 'StudentProfile', resourceId: profile.id }, req);
});

/**
 * Promote students to next semester (Transaction)
 */
export const promoteStudents = catchAsync(async (req, res, next) => {
    const { studentIds } = req.body;

    const result = await sequelize.transaction(async (t) => {
        const students = await StudentProfile.findAll({
            where: { id: studentIds },
            transaction: t
        });

        for (const student of students) {
            student.currentSemester += 1;
            await student.save({ transaction: t });
        }

        return students;
    });

    res.status(200).json({
        status: 'success',
        message: `${result.length} students promoted to semester ${result[0]?.currentSemester || ''}`
    });

    await logAudit({
        action: 'STUDENT_PROMOTION',
        resource: 'StudentProfile',
        metadata: { count: result.length, newSemester: result[0]?.currentSemester }
    }, req);
});

/**
 * Enroll student in course
 */
export const enrollInCourse = catchAsync(async (req, res, next) => {
    const { studentProfileId, courseId, academicYear, semester } = req.body;

    const enrollment = await Enrollment.create({
        studentProfileId,
        courseId,
        academicYear,
        semester
    });

    res.status(201).json({
        status: 'success',
        data: enrollment
    });

    await logAudit({ action: 'COURSE_ENROLL', resource: 'Enrollment', resourceId: enrollment.id }, req);
});
