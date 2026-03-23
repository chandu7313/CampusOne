import { Op } from 'sequelize';
import { FeeStructure, StudentFee, FeePayment, FeeInstallment } from '../models/index.js';
import { StudentProfile } from '../../students/models/index.js';
import User from '../../users/models/user.model.js';
import catchAsync from '../../../utils/catchAsync.js';
import AppError from '../../../utils/appError.js';

/** ── Helpers ── */
const generateTransactionId = () =>
    `TXN-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

const generateReceiptNumber = () =>
    `RCP-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;

/**
 * STUDENT: Get own fee records with installments + payment history
 */
export const getMyFees = catchAsync(async (req, res, next) => {
    const studentProfileId = req.user.studentProfile?.id;
    if (!studentProfileId) return next(new AppError('Student profile not found', 404));

    const fees = await StudentFee.findAll({
        where: { studentProfileId },
        include: [
            {
                model: FeeStructure,
                as: 'feeStructure',
                attributes: ['academicYear', 'semester', 'tuitionFee', 'libraryFee', 'labFee', 'otherFees'],
            },
            { model: FeeInstallment, as: 'installments', order: [['installmentNumber', 'ASC']] },
            {
                model: FeePayment,
                as: 'payments',
                order: [['paymentDate', 'DESC']],
                limit: 5,
            },
        ],
        order: [['dueDate', 'DESC']],
    });

    // Summary stats
    const totalDue = fees.reduce((sum, f) => sum + Number(f.finalAmount || f.totalAmount), 0);
    const totalPaid = fees.reduce((sum, f) => sum + Number(f.paidAmount), 0);

    res.status(200).json({
        status: 'success',
        data: {
            fees,
            summary: {
                totalDue,
                totalPaid,
                totalPending: Math.max(0, totalDue - totalPaid),
            }
        }
    });
});

/**
 * STUDENT: Process a fee payment (full, partial, or installment-linked)
 */
export const processPayment = catchAsync(async (req, res, next) => {
    const { studentFeeId, amount, paymentMethod = 'Online', installmentId, notes } = req.body;
    const studentProfileId = req.user.studentProfile?.id;
    if (!studentProfileId) return next(new AppError('Student profile not found', 404));

    const fee = await StudentFee.findOne({
        where: { id: studentFeeId, studentProfileId },
    });
    if (!fee) return next(new AppError('Fee record not found for this student', 404));

    const paymentAmount = Number(amount);
    if (isNaN(paymentAmount) || paymentAmount <= 0) {
        return next(new AppError('Invalid payment amount', 400));
    }

    const finalAmount = Number(fee.finalAmount || fee.totalAmount);
    const remaining = finalAmount - Number(fee.paidAmount);

    if (paymentAmount > remaining) {
        return next(new AppError(`Amount exceeds outstanding balance of ₹${remaining.toFixed(2)}`, 400));
    }

    // Update fee record
    fee.paidAmount = Number(fee.paidAmount) + paymentAmount;
    if (fee.paidAmount >= finalAmount) {
        fee.status = 'Paid';
        fee.paidAmount = finalAmount; // cap
    } else {
        fee.status = 'Partial';
    }
    await fee.save();

    // Update installment if linked
    if (installmentId) {
        const installment = await FeeInstallment.findByPk(installmentId);
        if (installment && installment.studentFeeId === studentFeeId) {
            installment.status = 'Paid';
            installment.paidDate = new Date();
            await installment.save();
        }
    }

    // Create payment record
    const payment = await FeePayment.create({
        studentFeeId,
        studentProfileId,
        amountPaid: paymentAmount,
        paymentMethod,
        transactionId: generateTransactionId(),
        receiptNumber: generateReceiptNumber(),
        installmentId: installmentId || null,
        notes,
        status: 'Success',
    });

    res.status(200).json({
        status: 'success',
        message: `Payment of ₹${paymentAmount} processed successfully`,
        data: { payment, fee },
    });
});

/**
 * STUDENT: Get own payment history
 */
export const getMyPaymentHistory = catchAsync(async (req, res, next) => {
    const studentProfileId = req.user.studentProfile?.id;
    if (!studentProfileId) return next(new AppError('Student profile not found', 404));

    const { from, to, method, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;
    const where = { studentProfileId };

    if (from || to) {
        where.paymentDate = {};
        if (from) where.paymentDate[Op.gte] = new Date(from);
        if (to) where.paymentDate[Op.lte] = new Date(to);
    }
    if (method) where.paymentMethod = method;

    const payments = await FeePayment.findAndCountAll({
        where,
        include: [
            {
                model: StudentFee,
                as: 'studentFee',
                include: [{ model: FeeStructure, as: 'feeStructure', attributes: ['academicYear', 'semester'] }]
            }
        ],
        limit: Number(limit),
        offset,
        order: [['paymentDate', 'DESC']],
    });

    res.status(200).json({
        status: 'success',
        results: payments.count,
        totalPages: Math.ceil(payments.count / limit),
        currentPage: Number(page),
        data: payments.rows,
    });
});

/**
 * STUDENT/ADMIN: Get receipt data for a specific payment
 */
export const getReceipt = catchAsync(async (req, res, next) => {
    const { paymentId } = req.params;
    const studentProfileId = req.user.studentProfile?.id;

    const where = { id: paymentId };
    // Students can only see their own receipts; admins can see any
    if (studentProfileId) where.studentProfileId = studentProfileId;

    const payment = await FeePayment.findOne({
        where,
        include: [
            {
                model: StudentProfile,
                as: 'student',
                include: [{ model: User, as: 'user', attributes: ['name', 'email'] }],
            },
            {
                model: StudentFee,
                as: 'studentFee',
                include: [{ model: FeeStructure, as: 'feeStructure' }]
            }
        ],
    });

    if (!payment) return next(new AppError('Receipt not found', 404));

    res.status(200).json({ status: 'success', data: payment });
});
