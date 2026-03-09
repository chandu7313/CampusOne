import { Assignment, AssignmentSubmission, Course } from '../../../models/index.js';
import catchAsync from '../../../utils/catchAsync.js';
import AppError from '../../../utils/appError.js';
import { Enrollment } from '../../students/models/index.js';

/**
 * Get assignments for the logged in student
 */
export const getStudentAssignments = catchAsync(async (req, res, next) => {
    const studentProfileId = req.user.studentProfile?.id;
    if (!studentProfileId) {
        return next(new AppError('Student profile not found', 404));
    }

    // Find courses student is enrolled in
    const enrollments = await Enrollment.findAll({
        where: { studentProfileId },
        attributes: ['courseId']
    });

    const courseIds = enrollments.map(e => e.courseId);

    const assignments = await Assignment.findAll({
        where: { subjectId: courseIds },
        include: [
            { model: Course, as: 'subject', attributes: ['name', 'code'] },
            {
                model: AssignmentSubmission,
                as: 'submissions',
                where: { studentId: req.user.id },
                required: false
            }
        ],
        order: [['dueDate', 'ASC']]
    });

    res.status(200).json({
        status: 'success',
        results: assignments.length,
        data: assignments
    });
});

/**
 * Submit an assignment
 */
export const submitAssignment = catchAsync(async (req, res, next) => {
    const { assignmentId, submissionUrl } = req.body;

    let submission = await AssignmentSubmission.findOne({
        where: { assignmentId, studentId: req.user.id }
    });

    if (submission) {
        submission.submissionUrl = submissionUrl;
        submission.status = 'SUBMITTED';
        submission.submittedAt = new Date();
        await submission.save();
    } else {
        submission = await AssignmentSubmission.create({
            assignmentId,
            studentId: req.user.id,
            submissionUrl,
            status: 'SUBMITTED'
        });
    }

    res.status(201).json({
        status: 'success',
        data: submission
    });
});

/**
 * FACULTY: Get assignments created by faculty for their subjects
 */
export const getFacultyAssignments = catchAsync(async (req, res, next) => {
    // Ideally filter by subjects assigned to this faculty
    // For now, getting all or filtering by a specific subject if provided
    const { subjectId } = req.query;

    const whereClause = {};
    if (subjectId) whereClause.subjectId = subjectId;

    const assignments = await Assignment.findAll({
        where: whereClause,
        include: [
            { model: Course, as: 'subject', attributes: ['name', 'code'] }
        ],
        order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
        status: 'success',
        results: assignments.length,
        data: assignments
    });
});

/**
 * FACULTY: Create new assignment
 */
export const createAssignment = catchAsync(async (req, res, next) => {
    const { subjectId, title, description, dueDate, totalMarks, type } = req.body;

    const assignment = await Assignment.create({
        subjectId,
        title,
        description,
        dueDate,
        totalMarks,
        type
    });

    res.status(201).json({
        status: 'success',
        data: assignment
    });
});

/**
 * FACULTY: Get submissions for a specific assignment
 */
export const getAssignmentSubmissions = catchAsync(async (req, res, next) => {
    const { id: assignmentId } = req.params;

    const submissions = await AssignmentSubmission.findAll({
        where: { assignmentId },
        include: [
            {
                model: req.app.get('models')?.User || (await import('../../../models/index.js')).User,
                as: 'student',
                attributes: ['firstName', 'lastName', 'email']
            }
        ],
        order: [['submittedAt', 'DESC']]
    });

    res.status(200).json({
        status: 'success',
        results: submissions.length,
        data: submissions
    });
});

/**
 * FACULTY: Grade a submission
 */
export const gradeSubmission = catchAsync(async (req, res, next) => {
    const { id: submissionId } = req.params;
    const { marksObtained, feedback } = req.body;

    const submission = await AssignmentSubmission.findByPk(submissionId);

    if (!submission) {
        return next(new AppError('Submission not found', 404));
    }

    submission.marksObtained = marksObtained;
    submission.feedback = feedback;
    submission.status = 'GRADED';

    await submission.save();

    res.status(200).json({
        status: 'success',
        data: submission
    });
});

