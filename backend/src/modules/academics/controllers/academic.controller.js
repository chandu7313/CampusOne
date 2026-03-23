import {
    Department, Program, Course,
    Semester, Section, StudentSection, SemesterSubject,
    StudentProfile, Enrollment, User, Year
} from '../../../models/index.js';
import catchAsync from '../../../utils/catchAsync.js';
import AppError from '../../../utils/appError.js';
import logger from '../../../utils/logger.js';
import { logAudit } from '../../admin/utils/audit.util.js';
import { invalidateCache } from '../../../utils/invalidateCache.js';

/**
 * Get the full academic hierarchy (Explorer View)
 * Dept → Program → Year → Semester → Section
 */
export const getAcademicHierarchy = catchAsync(async (req, res, next) => {
    logger.debug('Fetching academic hierarchy');
    const hierarchy = await Department.findAll({
        include: [{
            model: Program,
            as: 'programs',
            include: [{
                model: Year,
                as: 'years',
                include: [{
                    model: Semester,
                    as: 'semesters',
                    include: [{ model: Section, as: 'sections' }]
                }]
            }, {
                model: Course,
                as: 'courses'
            }]
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

    // Auto-initialize Years and Semesters
    const duration = program.durationYears || 4;
    const currentYear = new Date().getFullYear();
    const academicYearStr = `${currentYear}-${(currentYear + 1).toString().slice(-2)}`;

    for (let y = 1; y <= duration; y++) {
        const year = await Year.create({
            programId: program.id,
            yearNumber: y,
            name: `Year ${y}`
        });

        // 2 Semesters per year
        await Semester.bulkCreate([
            {
                yearId: year.id,
                programId: program.id,
                semesterNumber: (y * 2) - 1,
                academicYear: academicYearStr,
                status: y === 1 ? 'ACTIVE' : 'UPCOMING'
            },
            {
                yearId: year.id,
                programId: program.id,
                semesterNumber: y * 2,
                academicYear: academicYearStr,
                status: 'UPCOMING'
            }
        ]);
    }

    res.status(201).json({ status: 'success', data: program });
    await invalidateCache('/api/v1/academic*');
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
    const { semesterId, studentProfileIds } = req.body;

    if (!semesterId || !studentProfileIds || !Array.isArray(studentProfileIds)) {
        return next(new AppError('Please provide semesterId and an array of studentProfileIds', 400));
    }

    // Get existing sections for this semester
    const sections = await Section.findAll({
        where: { semesterId },
        order: [['name', 'ASC']]
    });

    if (sections.length === 0) {
        return next(new AppError('No sections found for this semester. Please create sections first.', 404));
    }

    const totalStudents = studentProfileIds.length;

    // Check if we can satisfy the 15 student minimum per section
    // If not, we might need fewer sections or just warn the user.
    // We will attempt to balance them as evenly as possible.

    let allocations = [];

    // Distribute evenly
    // E.g., 60 students, 2 sections => 30 each
    const baseCount = Math.floor(totalStudents / sections.length);
    const remainder = totalStudents % sections.length;

    let studentIndex = 0;

    for (let i = 0; i < sections.length; i++) {
        const section = sections[i];
        // Add 1 extra student to the first 'remainder' sections
        const studentsForThisSection = baseCount + (i < remainder ? 1 : 0);

        // Check max capacity
        const capacity = section.capacity || 60;
        if (studentsForThisSection > capacity) {
            return next(new AppError(`Section ${section.name} capacity exceeded. Max capacity is ${capacity}. Please create more sections.`, 400));
        }

        // Note: We enforce the 15 minimum rule as a warning or hard limit? 
        // We can throw an error if average is < 15
        if (studentsForThisSection < 15 && totalStudents >= 15) {
            // It's possible we just don't have enough total students to fill multiple sections above 15
            // E.g. 20 students, 2 sections => 10 each. They should just use 1 section.
            return next(new AppError('Sections must have a minimum of 15 students. Please reduce the number of sections for this semester.', 400));
        }

        const sectionStudents = studentProfileIds.slice(studentIndex, studentIndex + studentsForThisSection);

        sectionStudents.forEach(id => {
            allocations.push({
                sectionId: section.id,
                studentProfileId: id
            });
        });

        studentIndex += studentsForThisSection;
    }

    // Delete existing allocations for these students in this semester if any?
    // We'll trust bulkCreate ignoreDuplicates or do it safely
    await StudentSection.bulkCreate(allocations, { ignoreDuplicates: true });

    res.status(200).json({
        status: 'success',
        message: 'Students automatically distributed to sections successfully',
        data: {
            totalAllocated: allocations.length,
            sectionsProcessed: sections.length
        }
    });
});

/**
 * Get all sections
 */
export const getSections = catchAsync(async (req, res, next) => {
    const { semesterId } = req.query;

    const whereClause = {};
    if (semesterId) whereClause.semesterId = semesterId;

    const sections = await Section.findAll({
        where: whereClause,
        include: [
            { model: Semester, as: 'semester', attributes: ['semesterNumber', 'academicYear'] }
        ],
        order: [['name', 'ASC']]
    });

    res.status(200).json({
        status: 'success',
        results: sections.length,
        data: sections
    });
});

/**
 * Get students in a specific section
 */
export const getSectionStudents = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const section = await Section.findByPk(id, {
        include: [
            {
                model: StudentProfile,
                as: 'students',
                include: [
                    { model: User, as: 'user', attributes: ['id', 'firstName', 'lastName', 'email', 'avatar'] }
                ]
            }
        ]
    });

    if (!section) return next(new AppError('Section not found', 404));

    res.status(200).json({
        status: 'success',
        data: section.students
    });
});

/**
 * Department CRUD
 */
export const createDepartment = catchAsync(async (req, res, next) => {
    const dept = await Department.create(req.body);
    res.status(201).json({ status: 'success', data: dept });
    await invalidateCache('/api/v1/academic*');
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

/**
 * POST /academic/programs/:id/initialize
 * Create sections for all existing Years/Semesters in a program.
 * Idempotent-guard: fails if sections already exist.
 */
export const initializeProgram = catchAsync(async (req, res, next) => {
    const { id: programId } = req.params;
    const { sectionsPerSemester = 2, defaultSectionNames, maxStrength = 60 } = req.body;

    const program = await Program.findByPk(programId, {
        include: [{
            model: Year,
            as: 'years',
            include: [{ model: Semester, as: 'semesters' }]
        }]
    });

    if (!program) return next(new AppError('Program not found', 404));

    // Guard — check if any semester already has sections
    const allSemesterIds = program.years.flatMap(y => y.semesters.map(s => s.id));
    if (allSemesterIds.length === 0) {
        return next(new AppError('Program has no semesters. It may not have been created correctly.', 400));
    }

    const existingCount = await Section.count({ where: { semesterId: allSemesterIds } });
    if (existingCount > 0) {
        return next(new AppError('Program is already initialized. Use the "Add Section" option to modify individual semesters.', 400));
    }

    // Build section names: use provided names or auto-generate A, B, C...
    const sectionNames = [];
    for (let i = 0; i < sectionsPerSemester; i++) {
        sectionNames.push(
            (defaultSectionNames && defaultSectionNames[i]) ||
            String.fromCharCode(65 + i) // A, B, C...
        );
    }

    const sectionsToCreate = [];
    for (const year of program.years) {
        for (const semester of year.semesters) {
            for (const name of sectionNames) {
                sectionsToCreate.push({
                    semesterId: semester.id,
                    name,
                    capacity: maxStrength
                });
            }
        }
    }

    await Section.bulkCreate(sectionsToCreate);

    res.status(201).json({
        status: 'success',
        message: `Initialized ${program.years.length} years, ${allSemesterIds.length} semesters, ${sectionsToCreate.length} sections`,
        data: {
            yearsCount: program.years.length,
            semestersCount: allSemesterIds.length,
            sectionsCreated: sectionsToCreate.length
        }
    });

    await invalidateCache('/api/v1/academic*');
    await logAudit({
        action: 'PROGRAM_INITIALIZE',
        resource: 'Program',
        resourceId: programId,
        metadata: { sectionsCreated: sectionsToCreate.length }
    }, req);
});

/**
 * PUT /academic/departments/:id
 */
export const updateDepartment = catchAsync(async (req, res, next) => {
    const dept = await Department.findByPk(req.params.id);
    if (!dept) return next(new AppError('Department not found', 404));
    await dept.update(req.body);
    res.status(200).json({ status: 'success', data: dept });
    await invalidateCache('/api/v1/academic*');
});

/**
 * DELETE /academic/departments/:id
 */
export const deleteDepartment = catchAsync(async (req, res, next) => {
    const dept = await Department.findByPk(req.params.id, {
        include: [{ model: Program, as: 'programs' }]
    });
    if (!dept) return next(new AppError('Department not found', 404));
    if (dept.programs?.length > 0) {
        return next(new AppError('Cannot delete department with active programs. Remove all programs first.', 400));
    }
    await dept.destroy();
    await invalidateCache('/api/v1/academic*');
    res.status(204).json({ status: 'success', data: null });
});

/**
 * DELETE /academic/programs/:id
 * Without ?force=true → safe delete, returns canForceDelete flag if children exist.
 * With    ?force=true → cascade: Sections → Semesters → Years → Program.
 */
export const deleteProgram = catchAsync(async (req, res, next) => {
    const { force } = req.query;
    const programId = req.params.id;

    const program = await Program.findByPk(programId, {
        include: [{
            model: Year,
            as: 'years',
            include: [{ model: Semester, as: 'semesters' }]
        }]
    });
    if (!program) return next(new AppError('Program not found', 404));

    const hasYears = program.years && program.years.length > 0;

    // Safe delete — no children
    if (!hasYears) {
        await program.destroy();
        return res.status(200).json({ status: 'success', message: 'Program deleted.' });
    }

    // Block unless force=true, but signal to the frontend that force is possible
    if (force !== 'true') {
        const semesterIds = program.years.flatMap(y => y.semesters.map(s => s.id));
        const sectionCount = await Section.count({ where: { semesterId: semesterIds } });
        return res.status(400).json({
            status: 'fail',
            message: 'Program has initialized semesters.',
            canForceDelete: true,
            meta: {
                programName: program.name,
                yearsCount: program.years.length,
                semestersCount: semesterIds.length,
                sectionsCount: sectionCount
            }
        });
    }

    // Force CASCADE: children-first order
    const yearIds     = program.years.map(y => y.id);
    const semesterIds = program.years.flatMap(y => y.semesters.map(s => s.id));

    const { Op } = await import('sequelize');
    await Section.destroy({ where: { semesterId: { [Op.in]: semesterIds } } });
    await Semester.destroy({ where: { id: { [Op.in]: semesterIds } } });
    await Year.destroy({ where: { id: { [Op.in]: yearIds } } });
    await program.destroy();

    await logAudit({ action: 'PROGRAM_FORCE_DELETE', resource: 'Program', resourceId: programId }, req);
    await invalidateCache('/api/v1/academic*');
    return res.status(200).json({
        status: 'success',
        message: 'Program and all associated data permanently deleted.',
        deleted: { years: yearIds.length, semesters: semesterIds.length }
    });
});

// (safe delete path — no children — handled by the early return above)

/**
 * DELETE /academic/years/:id  — cascades: Sections → Semesters → Year
 */
export const deleteYear = catchAsync(async (req, res, next) => {
    const year = await Year.findByPk(req.params.id, {
        include: [{ model: Semester, as: 'semesters' }]
    });
    if (!year) return next(new AppError('Year not found', 404));

    const semesterIds = year.semesters.map(s => s.id);
    const { Op } = await import('sequelize');
    await Section.destroy({ where: { semesterId: { [Op.in]: semesterIds } } });
    await Semester.destroy({ where: { id: { [Op.in]: semesterIds } } });
    await year.destroy();

    return res.status(200).json({
        status: 'success',
        message: `Year and ${semesterIds.length} semester(s) deleted.`
    });
});

/**
 * DELETE /academic/semesters/:id  — cascades: Sections → Semester
 */
export const deleteSemester = catchAsync(async (req, res, next) => {
    const semester = await Semester.findByPk(req.params.id);
    if (!semester) return next(new AppError('Semester not found', 404));

    const sectionCount = await Section.count({ where: { semesterId: semester.id } });
    await Section.destroy({ where: { semesterId: semester.id } });
    await semester.destroy();

    return res.status(200).json({
        status: 'success',
        message: `Semester and ${sectionCount} section(s) deleted.`
    });
});

/**
 * PUT /academic/sections/:id
 */
export const updateSection = catchAsync(async (req, res, next) => {
    const section = await Section.findByPk(req.params.id);
    if (!section) return next(new AppError('Section not found', 404));
    await section.update(req.body);
    res.status(200).json({ status: 'success', data: section });
});

/**
 * DELETE /academic/sections/:id
 */
export const deleteSection = catchAsync(async (req, res, next) => {
    const section = await Section.findByPk(req.params.id);
    if (!section) return next(new AppError('Section not found', 404));
    await section.destroy();
    res.status(200).json({ status: 'success', message: 'Section deleted.' });
    await logAudit({ action: 'SECTION_DELETE', resource: 'Section', resourceId: req.params.id }, req);
});
