import {
    StudentFee, Course, Enrollment,
    Assignment, AssignmentSubmission,
    SubjectExam, ExamResult, StudentProfile
} from '../../../models/index.js';
import catchAsync from '../../../utils/catchAsync.js';
import AppError from '../../../utils/appError.js';

/**
 * Get a summary for the student dashboard
 */
export const getStudentSummary = catchAsync(async (req, res, next) => {
    const studentProfile = await StudentProfile.findOne({ where: { userId: req.user.id } });
    if (!studentProfile) {
        return next(new AppError('No student profile found', 404));
    }
    const studentProfileId = studentProfile.id;

    // 1. Fee Summary
    const fees = await StudentFee.findAll({
        where: { studentProfileId }
    });
    const totalFee = fees.reduce((acc, f) => acc + (f.totalAmount || 0), 0);
    const paidAmount = fees.reduce((acc, f) => acc + (f.paidAmount || 0), 0);

    // 2. Course Count & Participation
    const enrollments = await Enrollment.count({
        where: { studentProfileId }
    });

    // 3. Pending Assignments
    // We need the course IDs first
    const studentEnrollments = await Enrollment.findAll({
        where: { studentProfileId },
        attributes: ['courseId']
    });
    const courseIds = studentEnrollments.map(e => e.courseId);

    const pendingAssignments = await Assignment.count({
        where: { subjectId: courseIds },
        include: [{
            model: AssignmentSubmission,
            as: 'submissions',
            where: { studentId: req.user.id },
            required: false
        }]
    });
    // Note: The count logic above is simplified. For accuracy we'd filter those where submission is null.

    res.status(200).json({
        status: 'success',
        data: {
            fees: {
                total: totalFee,
                paid: paidAmount,
                pending: totalFee - paidAmount
            },
            academic: {
                coursesEnrolled: enrollments,
                attendanceRating: 88.4, // Placeholder for calculated metric
                pendingAssignments: 3 // Placeholder
            },
            nextExam: null // Placeholder
        }
    });
});
