import { Op } from 'sequelize';
import { sequelize } from '../../../config/database.js';
import { FeeStructure, StudentFee, Scholarship, FeePayment, FeeInstallment } from '../models/index.js';
import { StudentProfile } from '../../students/models/index.js';
import User from '../../users/models/user.model.js';
import catchAsync from '../../../utils/catchAsync.js';
import AppError from '../../../utils/appError.js';
import { logAudit } from '../../admin/utils/audit.util.js';

/** ── Helpers ── */
const generateTransactionId = () =>
    `TXN-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

const generateReceiptNumber = () =>
    `RCP-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;

/** ── Fee Structure ── */
export const createFeeStructure = catchAsync(async (req, res, next) => {
    const feeStructure = await FeeStructure.create(req.body);
    res.status(201).json({ status: 'success', data: feeStructure });
    logAudit({ action: 'FEE_STRUCT_CREATE', resource: 'FeeStructure', resourceId: feeStructure.id }, req);
});

export const getFeeStructures = catchAsync(async (req, res, next) => {
    const { programId } = req.query;
    const where = programId ? { programId } : {};
    const structures = await FeeStructure.findAll({ where, order: [['academicYear', 'DESC'], ['semester', 'ASC']] });
    res.status(200).json({ status: 'success', results: structures.length, data: structures });
});

export const updateFeeStructure = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const [count, [updated]] = await FeeStructure.update(req.body, { where: { id }, returning: true });
    if (count === 0) return next(new AppError('Fee structure not found', 404));
    res.status(200).json({ status: 'success', data: updated });
});

export const deleteFeeStructure = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const count = await FeeStructure.destroy({ where: { id } });
    if (count === 0) return next(new AppError('Fee structure not found', 404));
    res.status(204).send();
});

export const duplicateFeeStructure = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const structure = await FeeStructure.findByPk(id);
    if (!structure) return next(new AppError('Fee structure not found', 404));

    const newStructureData = structure.toJSON();
    delete newStructureData.id;
    newStructureData.academicYear = req.body.academicYear || newStructureData.academicYear;
    newStructureData.semester = req.body.semester || newStructureData.semester;

    const newStructure = await FeeStructure.create(newStructureData);
    res.status(201).json({ status: 'success', data: newStructure });
});

/** ── Student Fee Assignment ── */
export const getStudentFeesList = catchAsync(async (req, res, next) => {
    const { status, programId, search, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    const studentWhere = {};

    const fees = await StudentFee.findAndCountAll({
        where: { ...(status && { status }) },
        include: [
            {
                model: StudentProfile,
                as: 'student',
                required: true,
                ...(programId && { where: { programId } }),
                include: [{
                    model: User,
                    as: 'user',
                    attributes: ['name', 'email'],
                    ...(search && { where: { name: { [Op.iLike]: `%${search}%` } } })
                }]
            },
            { model: FeeStructure, as: 'feeStructure', attributes: ['academicYear', 'semester', 'tuitionFee'] },
            { model: FeeInstallment, as: 'installments' },
        ],
        limit: Number(limit),
        offset,
        order: [['createdAt', 'DESC']],
    });

    res.status(200).json({
        status: 'success',
        results: fees.count,
        totalPages: Math.ceil(fees.count / limit),
        currentPage: Number(page),
        data: fees.rows,
    });
});

export const assignStudentFee = catchAsync(async (req, res, next) => {
    const { studentProfileId, feeStructureId, totalAmount, dueDate, discountAmount, notes } = req.body;

    const studentFee = await StudentFee.create({
        studentProfileId,
        feeStructureId,
        totalAmount,
        dueDate,
        discountAmount: discountAmount || 0,
        notes,
    });

    res.status(201).json({ status: 'success', data: studentFee });
    logAudit({ action: 'FEE_ASSIGN', resource: 'StudentFee', resourceId: studentFee.id }, req);
});

export const updateStudentFee = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const fee = await StudentFee.findByPk(id);
    if (!fee) return next(new AppError('Fee record not found', 404));

    await fee.update(req.body);
    res.status(200).json({ status: 'success', data: fee });
    logAudit({ action: 'FEE_UPDATE', resource: 'StudentFee', resourceId: id }, req);
});

export const assignStudentFeeBulk = catchAsync(async (req, res, next) => {
    const { studentProfileIds, feeStructureId, overrides } = req.body;
    if (!studentProfileIds || !studentProfileIds.length) return next(new AppError('No students provided', 400));
    
    const structure = await FeeStructure.findByPk(feeStructureId);
    if (!structure) return next(new AppError('Fee structure not found', 404));

    const feesData = studentProfileIds.map(studentId => ({
        studentProfileId: studentId,
        feeStructureId,
        totalAmount: overrides?.totalAmount || structure.tuitionFee + structure.libraryFee + structure.labFee + structure.otherFees,
        dueDate: overrides?.dueDate || new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // Default +15 days
        ...overrides
    }));

    const studentFees = await StudentFee.bulkCreate(feesData);
    res.status(201).json({ status: 'success', data: studentFees });
});

export const deleteStudentFee = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const count = await StudentFee.destroy({ where: { id } });
    if (count === 0) return next(new AppError('Fee record not found', 404));
    res.status(204).send();
});

/** ── Installments ── */
export const createInstallmentPlan = catchAsync(async (req, res, next) => {
    const { id: studentFeeId } = req.params;
    const { installments } = req.body; // Array of { dueDate, amount }

    const fee = await StudentFee.findByPk(studentFeeId);
    if (!fee) return next(new AppError('Fee record not found', 404));

    // Destroy existing installments if re-creating
    await FeeInstallment.destroy({ where: { studentFeeId } });

    const created = await FeeInstallment.bulkCreate(
        installments.map((inst, i) => ({
            studentFeeId,
            installmentNumber: i + 1,
            dueDate: inst.dueDate,
            amount: inst.amount,
        }))
    );

    res.status(201).json({ status: 'success', data: created });
});

/** ── Scholarships ── */
export const applyScholarship = catchAsync(async (req, res, next) => {
    const { feeId } = req.params;
    const { name, amount, type } = req.body;

    const result = await sequelize.transaction(async (t) => {
        const fee = await StudentFee.findByPk(feeId, { transaction: t });
        if (!fee) throw new AppError('Fee record not found', 404);

        const scholarship = await Scholarship.create({
            studentProfileId: fee.studentProfileId,
            name,
            amount,
            type: type || 'Merit',
            status: 'Approved',
        }, { transaction: t });

        fee.scholarshipAmount = Number(fee.scholarshipAmount || 0) + Number(amount);
        await fee.save({ transaction: t });

        return { scholarship, fee };
    });

    res.status(201).json({ status: 'success', data: result });
    logAudit({ action: 'SCHOLARSHIP_APPLY', resource: 'StudentFee', resourceId: feeId }, req);
});

export const approveScholarship = catchAsync(async (req, res, next) => {
    const { scholarshipId } = req.params;

    const result = await sequelize.transaction(async (t) => {
        const scholarship = await Scholarship.findByPk(scholarshipId, { transaction: t });
        if (!scholarship) throw new AppError('Scholarship not found', 404);

        scholarship.status = 'Approved';
        await scholarship.save({ transaction: t });

        const studentFee = await StudentFee.findOne({
            where: { studentProfileId: scholarship.studentProfileId, status: ['Pending', 'Partial'] },
            transaction: t,
        });

        if (studentFee) {
            studentFee.scholarshipAmount = Number(studentFee.scholarshipAmount || 0) + Number(scholarship.amount);
            await studentFee.save({ transaction: t });
        }

        return scholarship;
    });

    res.status(200).json({ status: 'success', data: result });
    logAudit({ action: 'SCHOLARSHIP_APPROVE', resource: 'Scholarship', resourceId: scholarshipId }, req);
});

/** ── Overview ── */
export const getFinanceOverview = catchAsync(async (req, res, next) => {
    const [totalRevenue, pendingRevenue, totalStudents, totalScholarships] = await Promise.all([
        StudentFee.sum('paidAmount'),
        StudentFee.sum('finalAmount', { where: { status: ['Pending', 'Partial'] } }),
        StudentFee.count({ distinct: true, col: 'studentProfileId' }),
        Scholarship.sum('amount', { where: { status: 'Approved' } }),
    ]);

    res.status(200).json({
        status: 'success',
        data: {
            totalRevenue: totalRevenue || 0,
            pendingRevenue: pendingRevenue || 0,
            totalStudents: totalStudents || 0,
            totalScholarships: totalScholarships || 0,
        }
    });
});

/** ── All Payment History (admin view) ── */
export const getAllPayments = catchAsync(async (req, res, next) => {
    const { from, to, method, studentId, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;
    const where = {};

    if (from || to) {
        where.paymentDate = {};
        if (from) where.paymentDate[Op.gte] = new Date(from);
        if (to) where.paymentDate[Op.lte] = new Date(to);
    }
    if (method) where.paymentMethod = method;
    if (studentId) where.studentProfileId = studentId;

    const payments = await FeePayment.findAndCountAll({
        where,
        include: [
            {
                model: StudentProfile,
                as: 'student',
                include: [{ model: User, as: 'user', attributes: ['name', 'email'] }]
            },
            { model: StudentFee, as: 'studentFee', include: [{ model: FeeStructure, as: 'feeStructure' }] },
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

export const reversePayment = catchAsync(async (req, res, next) => {
    const { paymentId } = req.params;
    const { reason } = req.body;
    
    const result = await sequelize.transaction(async (t) => {
        const payment = await FeePayment.findByPk(paymentId, { transaction: t });
        if (!payment) throw new AppError('Payment not found', 404);
        if (payment.isReversed) throw new AppError('Payment already reversed', 400);

        payment.isReversed = true;
        payment.status = 'Reversed';
        payment.reversedBy = req.user.id;
        payment.reversedAt = new Date();
        payment.reversalReason = reason;
        await payment.save({ transaction: t });

        // Update StudentFee
        const fee = await StudentFee.findByPk(payment.studentFeeId, { transaction: t });
        if (fee) {
            fee.paidAmount = Math.max(0, Number(fee.paidAmount) - Number(payment.amountPaid));
            fee.status = fee.paidAmount >= fee.finalAmount ? 'Paid' : (fee.paidAmount > 0 ? 'Partial' : 'Pending');
            await fee.save({ transaction: t });
        }
        return payment;
    });

    res.status(200).json({ status: 'success', data: result });
});

export const getDefaulters = catchAsync(async (req, res, next) => {
    const fees = await StudentFee.findAll({
        where: {
            status: { [Op.in]: ['Pending', 'Partial', 'Overdue'] },
            dueDate: { [Op.lt]: new Date() }
        },
        include: [
            {
                model: StudentProfile,
                as: 'student',
                include: [{ model: User, as: 'user', attributes: ['name', 'email'] }]
            },
            { model: FeeStructure, as: 'feeStructure' }
        ],
        order: [['dueDate', 'ASC']]
    });

    res.status(200).json({ status: 'success', results: fees.length, data: fees });
});

export const getCollectionReport = catchAsync(async (req, res, next) => {
    const { month } = req.query; // e.g. '2026-03'
    const where = { status: 'Success' };
    
    if (month) {
        const startDate = new Date(`${month}-01`);
        const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);
        where.paymentDate = { [Op.between]: [startDate, endDate] };
    }

    const { sum } = await FeePayment.findOne({
        where,
        attributes: [
            [sequelize.fn('SUM', sequelize.col('amountPaid')), 'totalCollection']
        ]
    });

    res.status(200).json({ status: 'success', data: { totalCollection: sum?.totalCollection ?? 0 } });
});
