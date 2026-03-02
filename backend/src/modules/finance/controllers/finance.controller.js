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
