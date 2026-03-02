import { Department, Program, Course } from '../models/index.js';
import catchAsync from '../../../utils/catchAsync.js';
import AppError from '../../../utils/appError.js';
import { logAudit } from '../../admin/utils/audit.util.js';

/**
 * Get the full academic hierarchy (Explorer View)
 */
export const getAcademicHierarchy = catchAsync(async (req, res, next) => {
    const hierarchy = await Department.findAll({
        include: [{
            model: Program,
            as: 'programs',
            include: [{
                model: Course,
                as: 'courses'
            }]
        }]
    });

    res.status(200).json({
        status: 'success',
        data: hierarchy
    });
});

/**
 * Department CRUD
 */
export const createDepartment = catchAsync(async (req, res, next) => {
    const dept = await Department.create(req.body);
    res.status(201).json({ status: 'success', data: dept });
    await logAudit({ action: 'DEPT_CREATE', resource: 'Department', resourceId: dept.id }, req);
});

/**
 * Program CRUD
 */
export const createProgram = catchAsync(async (req, res, next) => {
    const program = await Program.create(req.body);
    res.status(201).json({ status: 'success', data: program });
    await logAudit({ action: 'PROGRAM_CREATE', resource: 'Program', resourceId: program.id }, req);
});

/**
 * Course CRUD
 */
export const createCourse = catchAsync(async (req, res, next) => {
    const course = await Course.create(req.body);
    res.status(201).json({ status: 'success', data: course });
    await logAudit({ action: 'COURSE_CREATE', resource: 'Course', resourceId: course.id }, req);
});
