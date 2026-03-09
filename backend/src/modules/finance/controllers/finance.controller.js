import { FeeStructure, StudentFee, Scholarship } from '../models/index.js';
import catchAsync from '../../../utils/catchAsync.js';
import AppError from '../../../utils/appError.js';
import { logAudit } from '../../admin/utils/audit.util.js';
import { sequelize } from '../../../config/database.js';

/**
 * Define a new fee structure for a program/semester
 */
export const createFeeStructure = catchAsync(async (req, res, next) => {
    const feeStructure = await FeeStructure.create(req.body);
    res.status(201).json({ status: 'success', data: feeStructure });
    await logAudit({ action: 'FEE_STRUCT_CREATE', resource: 'FeeStructure', resourceId: feeStructure.id }, req);
});

/**
 * Approve scholarship and adjust student fee
 */
export const approveScholarship = catchAsync(async (req, res, next) => {
    const { scholarshipId } = req.params;

    const result = await sequelize.transaction(async (t) => {
        const scholarship = await Scholarship.findByPk(scholarshipId, { transaction: t });
        if (!scholarship) throw new AppError('Scholarship not found', 404);

        scholarship.status = 'Approved';
        await scholarship.save({ transaction: t });

        // Find the pending fee for this student and apply scholarship
        const studentFee = await StudentFee.findOne({
            where: { studentProfileId: scholarship.studentProfileId, status: 'Pending' },
            transaction: t
        });

        if (studentFee) {
            studentFee.totalAmount -= scholarship.amount;
            await studentFee.save({ transaction: t });
        }

        return scholarship;
    });

    res.status(200).json({ status: 'success', data: result });
    await logAudit({ action: 'SCHOLARSHIP_APPROVE', resource: 'Scholarship', resourceId: scholarshipId }, req);
});

/**
 * Get financial overview for dashboard
 */
export const getFinanceOverview = catchAsync(async (req, res, next) => {
    const totalRevenue = await StudentFee.sum('paidAmount');
    const pendingRevenue = await StudentFee.sum('totalAmount', { where: { status: ['Pending', 'Partial'] } });

    res.status(200).json({
        status: 'success',
        data: {
            totalRevenue: totalRevenue || 0,
            pendingRevenue: pendingRevenue || 0,
        }
    });
});

/**
 * STUDENT: Get all fee records and currently active semester fee
 */
export const getStudentFees = catchAsync(async (req, res, next) => {
    const studentProfileId = req.user.studentProfile?.id;
    if (!studentProfileId) return next(new AppError('Student profile not found', 404));

    const fees = await StudentFee.findAll({
        where: { studentProfileId },
        include: [{
            model: FeeStructure,
            as: 'feeStructure',
            attributes: ['academicYear', 'semester', 'tuitionFee', 'libraryFee', 'labFee', 'otherFees']
        }],
        order: [['dueDate', 'DESC']]
    });

    res.status(200).json({ status: 'success', results: fees.length, data: fees });
});

/**
 * STUDENT: Process simulated fee payment
 */
export const processFeePayment = catchAsync(async (req, res, next) => {
    const { studentFeeId, amount } = req.body;
    const studentProfileId = req.user.studentProfile?.id;

    const studentFee = await StudentFee.findOne({
        where: { id: studentFeeId, studentProfileId }
    });

    if (!studentFee) return next(new AppError('Fee record not found for this user', 404));

    // Simulate Payment Success
    const paymentAmount = Number(amount);
    if (isNaN(paymentAmount) || paymentAmount <= 0) return next(new AppError('Invalid payment amount', 400));

    studentFee.paidAmount = Number(studentFee.paidAmount) + paymentAmount;

    if (studentFee.paidAmount >= studentFee.totalAmount) {
        studentFee.status = 'Paid';
        studentFee.paidAmount = studentFee.totalAmount; // Cap at total amount
    } else {
        studentFee.status = 'Partial';
    }

    await studentFee.save();

    res.status(200).json({ status: 'success', data: studentFee });
});
