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
