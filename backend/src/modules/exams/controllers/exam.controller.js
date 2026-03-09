import {
    Exam, SubjectExam, ExamHallAssignment, ExamResult,
    Course, Classroom, User
} from '../../../models/index.js';
import catchAsync from '../../../utils/catchAsync.js';
import AppError from '../../../utils/appError.js';
import logger from '../../../utils/logger.js';
import { logAudit } from '../../admin/utils/audit.util.js';
import { Op } from 'sequelize';

/**
 * Get all exams
 */
export const getExams = catchAsync(async (req, res, next) => {
    logger.debug('Fetching all exams');
    const exams = await Exam.findAll({
        order: [['startDate', 'DESC']]
    });
    res.status(200).json({ status: 'success', data: exams });
});

/**
 * Create new Exam Event
 */
export const createExam = catchAsync(async (req, res, next) => {
    const exam = await Exam.create(req.body);
    res.status(201).json({ status: 'success', data: exam });
    await logAudit({ action: 'EXAM_CREATE', resource: 'Exam', resourceId: exam.id }, req);
});

/**
 * Schedule Papers (Bulk)
 */
export const schedulePapers = catchAsync(async (req, res, next) => {
    const { examId, papers } = req.body; // papers is an array of subjectExam objects

    // Add examId to each paper
    const papersWithId = papers.map(p => ({ ...p, examId }));

    const scheduledPapers = await SubjectExam.bulkCreate(papersWithId);
    res.status(201).json({ status: 'success', data: scheduledPapers });
});

/**
 * Assign Hall & Invigilator
 */
export const assignHall = catchAsync(async (req, res, next) => {
    const assignment = await ExamHallAssignment.create(req.body);
    res.status(201).json({ status: 'success', data: assignment });
});

/**
 * Bulk Upload Results
 */
export const uploadResults = catchAsync(async (req, res, next) => {
    const { subjectExamId, results } = req.body; // results is array of { studentId, marksObtained }

    const paper = await SubjectExam.findByPk(subjectExamId);
    if (!paper) return next(new AppError('Subject exam not found', 404));

    const processedResults = results.map(r => {
        // Simple Grading Logic (Example)
        const percentage = (r.marksObtained / paper.totalMarks) * 100;
        let grade = 'F';
        if (percentage >= 90) grade = 'O';
        else if (percentage >= 80) grade = 'A+';
        else if (percentage >= 70) grade = 'A';
        else if (percentage >= 60) grade = 'B';
        else if (percentage >= 50) grade = 'C';
        else if (percentage >= paper.passingMarks) grade = 'P';

        return {
            ...r,
            subjectExamId,
            grade
        };
    });

    const resultsData = await ExamResult.bulkCreate(processedResults, {
        updateOnDuplicate: ['marksObtained', 'grade', 'remarks', 'isAbsent']
    });

    res.status(200).json({ status: 'success', data: resultsData });
});

/**
 * Get Exam Schedule
 */
export const getExamSchedule = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const schedule = await Exam.findByPk(id, {
        include: [{
            model: SubjectExam,
            as: 'papers',
            include: [
                { model: Course, as: 'subject', attributes: ['name', 'code'] },
                {
                    model: ExamHallAssignment,
                    as: 'hallAssignments',
                    include: [
                        { model: Classroom, as: 'hall', attributes: ['name'] },
                        { model: User, as: 'invigilator', attributes: ['firstName', 'lastName'] }
                    ]
                }
            ]
        }]
    });

    if (!schedule) return next(new AppError('Exam not found', 404));

    res.status(200).json({ status: 'success', data: schedule });
});

/**
 * STUDENT: Get Upcoming and Ongoing Exams
 */
export const getStudentExams = catchAsync(async (req, res, next) => {
    const studentProfileId = req.user.studentProfile?.id;
    if (!studentProfileId) return next(new AppError('Student profile not found', 404));

    // Get active exams
    const exams = await Exam.findAll({
        where: { status: { [Op.in]: ['PUBLISHED', 'COMPLETED', 'RESULTS_PUBLISHED'] } },
        include: [{
            model: SubjectExam,
            as: 'papers',
            include: [
                { model: Course, as: 'subject', attributes: ['name', 'code'] },
                {
                    model: ExamHallAssignment,
                    as: 'hallAssignments',
                    include: [{ model: Classroom, as: 'hall', attributes: ['name'] }]
                }
            ]
        }],
        order: [['startDate', 'DESC']]
    });

    res.status(200).json({ status: 'success', results: exams.length, data: exams });
});

/**
 * STUDENT: Get Exam Results
 */
export const getStudentResults = catchAsync(async (req, res, next) => {
    const studentId = req.user.id;

    const results = await ExamResult.findAll({
        where: { studentId },
        include: [{
            model: SubjectExam,
            as: 'paper',
            include: [
                { model: Course, as: 'subject', attributes: ['name', 'code', 'credits'] },
                { model: Exam, as: 'exam', attributes: ['name', 'type', 'academicYear', 'status'] }
            ]
        }],
        order: [[{ model: SubjectExam, as: 'paper' }, { model: Exam, as: 'exam' }, 'academicYear', 'DESC']]
    });

    res.status(200).json({ status: 'success', results: results.length, data: results });
});

/**
 * FACULTY: Get Exams (Overview for grading)
 */
export const getFacultyExams = catchAsync(async (req, res, next) => {
    // Return all exams for now; in a real scenario, filter exams where faculty is invigilating or teaching the subject
    const exams = await Exam.findAll({
        where: { status: { [Op.in]: ['PUBLISHED', 'COMPLETED', 'RESULTS_PUBLISHED'] } },
        order: [['startDate', 'DESC']]
    });

    res.status(200).json({ status: 'success', results: exams.length, data: exams });
});

/**
 * FACULTY: Get Results for a specific paper to view or update
 */
export const getFacultyExamResults = catchAsync(async (req, res, next) => {
    const { subjectExamId } = req.params;

    const results = await ExamResult.findAll({
        where: { subjectExamId },
        include: [{
            model: User,
            as: 'student',
            attributes: ['firstName', 'lastName', 'email']
        }]
    });

    res.status(200).json({ status: 'success', results: results.length, data: results });
});

