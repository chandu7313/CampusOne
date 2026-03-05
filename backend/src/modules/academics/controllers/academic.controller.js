import {
    Department, Program, Course,
    Semester, Section, StudentSection, SemesterSubject
} from '../../../models/index.js';
import catchAsync from '../../../utils/catchAsync.js';
import AppError from '../../../utils/appError.js';
import logger from '../../../utils/logger.js';
import { logAudit } from '../../admin/utils/audit.util.js';

/**
 * Get the full academic hierarchy (Explorer View)
 */
export const getAcademicHierarchy = catchAsync(async (req, res, next) => {
    logger.debug('Fetching academic hierarchy');
    const hierarchy = await Department.findAll({
        include: [{
            model: Program,
            as: 'programs',
            include: [
                { model: Semester, as: 'semesters' },
                { model: Course, as: 'courses' }
            ]
        }]
    });

    res.status(200).json({ status: 'success', data: hierarchy });
});

/**
 * Get all courses/subjects
 */
export const getCourses = catchAsync(async (req, res, next) => {
    logger.debug('Fetching all courses');
    const courses = await Course.findAll({
        include: [{ model: Program, as: 'program', attributes: ['name'] }]
    });

    res.status(200).json({
        status: 'success',
        data: courses
    });
});

/**
 * Program & Semester Logic
 */
export const createProgram = catchAsync(async (req, res, next) => {
    const program = await Program.create(req.body);

    // Auto-initialize semesters based on duration
    const numSemesters = program.totalSemesters || (program.durationYears * 2);
    const semesters = [];
    const currentYear = new Date().getFullYear();
    const academicYear = `${currentYear}-${(currentYear + 1).toString().slice(-2)}`;

    for (let i = 1; i <= numSemesters; i++) {
        semesters.push({
            programId: program.id,
            semesterNumber: i,
            academicYear: academicYear,
            status: i === 1 ? 'ACTIVE' : 'UPCOMING'
        });
    }
    await Semester.bulkCreate(semesters);

    res.status(201).json({ status: 'success', data: program });
    await logAudit({ action: 'PROGRAM_CREATE', resource: 'Program', resourceId: program.id }, req);
});


/**
 * Subject Mapping
 */
export const assignSubjectsToSemester = catchAsync(async (req, res, next) => {
    const { semesterId, subjectIds } = req.body; // subjectIds is an array

    const mappings = subjectIds.map(id => ({
        semesterId,
        subjectId: id
    }));

    await SemesterSubject.bulkCreate(mappings, { ignoreDuplicates: true });

    res.status(200).json({ status: 'success', message: 'Subjects assigned successfully' });
});

/**
 * Section & Allocation
 */
export const createSection = catchAsync(async (req, res, next) => {
    const section = await Section.create(req.body);
    res.status(201).json({ status: 'success', data: section });
});

export const allocateStudentsToSection = catchAsync(async (req, res, next) => {
    const { sectionId, studentProfileIds } = req.body;

    const section = await Section.findByPk(sectionId);
    if (!section) return next(new AppError('Section not found', 404));

    const allocations = studentProfileIds.map(id => ({
        sectionId,
        studentProfileId: id
    }));

    await StudentSection.bulkCreate(allocations, { ignoreDuplicates: true });

    res.status(200).json({ status: 'success', message: 'Students allocated successfully' });
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
 * Course/Subject CRUD
 */
export const createCourse = catchAsync(async (req, res, next) => {
    const course = await Course.create(req.body);
    res.status(201).json({ status: 'success', data: course });
    await logAudit({ action: 'COURSE_CREATE', resource: 'Course', resourceId: course.id }, req);
});
/**
 * Get courses for the logged-in student
 */
export const getStudentCourses = catchAsync(async (req, res, next) => {
    // Get student profile from user
    const studentProfile = await StudentProfile.findOne({ where: { userId: req.user.id } });
    if (!studentProfile) return next(new AppError('Student profile not found', 404));

    const enrollments = await Enrollment.findAll({
        where: { studentProfileId: studentProfile.id },
        include: [{
            model: Course,
            as: 'course',
            include: [{ model: Program, as: 'program', attributes: ['name'] }]
        }]
    });

    const courses = enrollments.map(e => e.course);

    res.status(200).json({
        status: 'success',
        data: courses
    });
});
