import {
    FacultyProfile, Department, Course, Section,
    FacultySubject, FacultyAssignment, User
} from '../../../models/index.js';
import catchAsync from '../../../utils/catchAsync.js';
import AppError from '../../../utils/appError.js';
import { logAudit } from '../../admin/utils/audit.util.js';
import { sequelize } from '../../../config/database.js';
import { Op } from 'sequelize';
import { invalidateCache } from '../../../utils/invalidateCache.js';

/**
 * Get all faculty profiles with filters
 */
export const getFaculty = catchAsync(async (req, res, next) => {
    const { departmentId, search } = req.query;

    const where = {};
    if (departmentId && departmentId !== '') where.departmentId = departmentId;

    const userWhere = {};
    if (search) {
        userWhere[Op.or] = [
            { firstName: { [Op.iLike]: `%${search}%` } },
            { lastName: { [Op.iLike]: `%${search}%` } },
            { email: { [Op.iLike]: `%${search}%` } }
        ];
    }

    const faculty = await FacultyProfile.findAll({
        where,
        include: [
            { model: User, as: 'user', where: Object.keys(userWhere).length ? userWhere : null, attributes: ['firstName', 'lastName', 'email', 'avatar'] },
            { model: Department, as: 'department', attributes: ['name'] }
        ]
    });

    res.status(200).json({ status: 'success', data: faculty });
});

/**
 * Assign subject competency to faculty
 */
export const assignCompetency = catchAsync(async (req, res, next) => {
    const { facultyProfileId, subjectId, competencyLevel } = req.body;

    const competency = await FacultySubject.upsert({
        facultyProfileId,
        subjectId,
        competencyLevel
    });

    res.status(200).json({ status: 'success', data: competency });
});

/**
 * Allocate Section and Subject to Faculty (Teaching Assignment)
 */
export const allocateSectionSubject = catchAsync(async (req, res, next) => {
    const { facultyProfileId, sectionId, subjectId, academicYear, semesterId } = req.body;

    // 1. Validate Workload
    const faculty = await FacultyProfile.findByPk(facultyProfileId, {
        include: [{
            model: FacultyAssignment,
            as: 'assignments',
            where: { academicYear },
            required: false,
            include: [{ model: Course, as: 'subject' }]
        }]
    });

    if (!faculty) return next(new AppError('Faculty profile not found', 404));

    const currentSubject = await Course.findByPk(subjectId);
    if (!currentSubject) return next(new AppError('Subject not found', 404));

    const currentWorkload = faculty.assignments.reduce((sum, assign) => sum + (assign.subject?.credits || 0), 0);

    if (currentWorkload + currentSubject.credits > faculty.maxWeeklyHours) {
        return next(new AppError(`Workload exceeded. Current: ${currentWorkload}h, Capacity: ${faculty.maxWeeklyHours}h`, 400));
    }

    // 2. Create Assignment
    const assignment = await FacultyAssignment.create(req.body);

    res.status(201).json({ status: 'success', data: assignment });

    await invalidateCache('/api/v1/academic/faculty*');

    await logAudit({
        action: 'FACULTY_ASSIGNMENT_CREATE',
        resource: 'FacultyAssignment',
        resourceId: assignment.id
    }, req);
});

/**
 * Get Faculty Workload & Schedule
 */
export const getFacultyWorkload = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const faculty = await FacultyProfile.findByPk(id, {
        include: [
            {
                model: FacultyAssignment,
                as: 'assignments',
                include: [
                    { model: Section, as: 'section' },
                    { model: Course, as: 'subject' }
                ]
            }
        ]
    });

    if (!faculty) return next(new AppError('Faculty not found', 404));

    const totalCredits = faculty.assignments.reduce((sum, a) => sum + (a.subject?.credits || 0), 0);

    res.status(200).json({
        status: 'success',
        data: {
            profile: faculty,
            totalWeeklyCredits: totalCredits,
            isOverloaded: totalCredits > faculty.maxWeeklyHours
        }
    });
});
