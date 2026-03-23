import { Op } from 'sequelize';
import { 
    SalaryStructure, 
    EmployeeSalary, 
    PayrollMonth, 
    Payslip, 
    SalaryRevision 
} from '../models/index.js';
import User from '../../users/models/user.model.js';
import catchAsync from '../../../utils/catchAsync.js';
import AppError from '../../../utils/appError.js';
import { logAudit } from '../../admin/utils/audit.util.js';
import { sequelize } from '../../../config/database.js';

/** ==========================================
 *  1. SALARY STRUCTURE (GRADE TEMPLATES)
 *  ========================================== */

export const getSalaryStructures = catchAsync(async (req, res, next) => {
    const structures = await SalaryStructure.findAll({
        where: { isActive: true },
        order: [['roleType', 'ASC'], ['grade', 'ASC']]
    });
    res.status(200).json({ status: 'success', data: structures });
});

export const createSalaryStructure = catchAsync(async (req, res, next) => {
    const structure = await SalaryStructure.create({ ...req.body });
    logAudit({ action: 'SALARY_TEMPLATE_CREATE', resource: 'SalaryStructure', resourceId: structure.id }, req);
    res.status(201).json({ status: 'success', data: structure });
});

export const updateSalaryStructure = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const structure = await SalaryStructure.findByPk(id);
    if (!structure) return next(new AppError('Salary structure not found', 404));

    await structure.update(req.body);
    logAudit({ action: 'SALARY_TEMPLATE_UPDATE', resource: 'SalaryStructure', resourceId: id }, req);
    res.status(200).json({ status: 'success', data: structure });
});

export const deleteSalaryStructure = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const structure = await SalaryStructure.findByPk(id);
    if (!structure) return next(new AppError('Salary structure not found', 404));

    structure.isActive = false;
    await structure.save();
    res.status(200).json({ status: 'success', message: 'Salary structure deactivated' });
});

/** ==========================================
 *  2. EMPLOYEE SALARY (ASSIGNMENTS)
 *  ========================================== */

export const getEmployeeSalaries = catchAsync(async (req, res, next) => {
    const { role, search, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    const userWhere = { role: { [Op.in]: ['Faculty', 'HOD', 'Staff', 'Admin'] } };
    if (role) userWhere.role = role;
    if (search) userWhere.name = { [Op.iLike]: `%${search}%` };

    const employees = await User.findAndCountAll({
        where: userWhere,
        attributes: ['id', 'name', 'email', 'role', 'department'],
        include: [{
            model: EmployeeSalary,
            as: 'salaries',
            where: { isActive: true },
            required: false,
            include: [{ model: SalaryStructure, as: 'structure' }]
        }],
        limit: Number(limit),
        offset,
        order: [['name', 'ASC']],
    });

    res.status(200).json({
        status: 'success',
        results: employees.count,
        totalPages: Math.ceil(employees.count / limit),
        currentPage: Number(page),
        data: employees.rows,
    });
});

export const assignEmployeeSalary = catchAsync(async (req, res, next) => {
    const {
        userId, salaryStructureId, basicPay,
        hra, da, ta, medicalAllowance,
        pfDeduction, taxDeduction, otherDeductions,
        bankAccount, bankName, ifscCode,
        effectiveFrom, remarks, revisionType = 'correction'
    } = req.body;

    // Use a transaction to deactivate old and set new + log revision
    const transaction = await sequelize.transaction();

    try {
        const oldSalary = await EmployeeSalary.findOne({
            where: { userId, isActive: true },
            transaction
        });

        if (oldSalary) {
            oldSalary.isActive = false;
            await oldSalary.save({ transaction });

            if (Number(oldSalary.basicPay) !== Number(basicPay)) {
                await SalaryRevision.create({
                    userId,
                    oldBasic: oldSalary.basicPay,
                    newBasic: basicPay,
                    revisionType,
                    effectiveDate: effectiveFrom || new Date(),
                    approvedBy: req.user.id,
                    remarks
                }, { transaction });
            }
        }

        const newSalary = await EmployeeSalary.create({
            userId, salaryStructureId, basicPay,
            hra, da, ta, medicalAllowance,
            pfDeduction, taxDeduction, otherDeductions,
            bankAccount, bankName, ifscCode,
            effectiveFrom: effectiveFrom || new Date(),
            assignedBy: req.user.id
        }, { transaction });

        await transaction.commit();

        logAudit({ action: 'EMPLOYEE_SALARY_ASSIGN', resource: 'EmployeeSalary', resourceId: newSalary.id }, req);
        res.status(201).json({ status: 'success', data: newSalary });
    } catch (error) {
        await transaction.rollback();
        return next(new AppError('Failed to assign salary: ' + error.message, 500));
    }
});

export const getSalaryHistory = catchAsync(async (req, res, next) => {
    const { userId } = req.params;
    const history = await SalaryRevision.findAll({
        where: { userId },
        order: [['createdAt', 'DESC']]
    });
    res.status(200).json({ status: 'success', data: history });
});

/** ==========================================
 *  3. PAYROLL MONTH (BATCH PROCESSING)
 *  ========================================== */

export const generatePayroll = catchAsync(async (req, res, next) => {
    const { month, year } = req.body;
    if (!month || !year) return next(new AppError('Month and Year are required', 400));

    // Check if payroll already exists for this month/year
    const existing = await PayrollMonth.findOne({ where: { month, year } });
    if (existing) {
        return next(new AppError('Payroll already exists for this month', 400));
    }

    const transaction = await sequelize.transaction();

    try {
        const activeEmployees = await EmployeeSalary.findAll({ where: { isActive: true }, transaction });
        
        if (activeEmployees.length === 0) {
            await transaction.rollback();
            return next(new AppError('No active employees with assigned salaries found', 404));
        }

        const payroll = await PayrollMonth.create({ month, year, status: 'Draft', employeeCount: activeEmployees.length }, { transaction });

        let totalGross = 0, totalDed = 0, totalNet = 0;
        const payslips = [];

        for (const emp of activeEmployees) {
            const slip = await Payslip.create({
                payrollMonthId: payroll.id,
                userId: emp.userId,
                basicPay: emp.basicPay,
                hra: emp.hra,
                da: emp.da,
                ta: emp.ta,
                medicalAllowance: emp.medicalAllowance,
                pfDeduction: emp.pfDeduction,
                taxDeduction: emp.taxDeduction,
                otherDeductions: emp.otherDeductions,
                workingDays: 30, // Default
                status: 'Generated'
            }, { transaction });

            totalGross += Number(slip.grossSalary);
            totalDed += Number(slip.pfDeduction) + Number(slip.taxDeduction) + Number(slip.otherDeductions);
            totalNet += Number(slip.netSalary);
            payslips.push(slip);
        }

        payroll.totalGross = totalGross;
        payroll.totalDeductions = totalDed;
        payroll.totalNet = totalNet;
        await payroll.save({ transaction });

        await transaction.commit();

        logAudit({ action: 'PAYROLL_GENERATE', resource: 'PayrollMonth', resourceId: payroll.id }, req);
        res.status(201).json({ status: 'success', message: 'Payroll drafted', data: payroll });
    } catch (err) {
        await transaction.rollback();
        return next(new AppError('Failed to generate payroll: ' + err.message, 500));
    }
});

export const getPayrollMonths = catchAsync(async (req, res, next) => {
    const { page = 1, limit = 20 } = req.query;
    const payrolls = await PayrollMonth.findAndCountAll({
        order: [['year', 'DESC'], ['month', 'DESC']],
        limit: Number(limit),
        offset: (page - 1) * limit
    });
    
    res.status(200).json({
        status: 'success',
        results: payrolls.count,
        totalPages: Math.ceil(payrolls.count / limit),
        currentPage: Number(page),
        data: payrolls.rows,
    });
});

export const updatePayrollStatus = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!['Approved', 'Disbursed'].includes(status)) {
        return next(new AppError('Invalid status update', 400));
    }

    const payroll = await PayrollMonth.findByPk(id);
    if (!payroll) return next(new AppError('Payroll not found', 404));

    const transaction = await sequelize.transaction();

    try {
        payroll.status = status;
        if (status === 'Approved') {
            payroll.approvedBy = req.user.id;
            payroll.approvedAt = new Date();
            await Payslip.update({ status: 'Approved' }, { where: { payrollMonthId: id, status: 'Generated' }, transaction });
        } else if (status === 'Disbursed') {
            payroll.disbursedAt = new Date();
            await Payslip.update({ status: 'Paid', paymentDate: new Date() }, { where: { payrollMonthId: id, status: 'Approved' }, transaction });
        }
        await payroll.save({ transaction });
        await transaction.commit();

        logAudit({ action: `PAYROLL_STATUS_${status.toUpperCase()}`, resource: 'PayrollMonth', resourceId: id }, req);
        res.status(200).json({ status: 'success', message: `Payroll marked as ${status}`, data: payroll });
    } catch (err) {
        await transaction.rollback();
        return next(new AppError('Failed to update payroll status', 500));
    }
});

/** ==========================================
 *  4. PAYSLIPS
 *  ========================================== */

export const getPayslipsForMonth = catchAsync(async (req, res, next) => {
    const { payrollId } = req.params;
    const payslips = await Payslip.findAll({
        where: { payrollMonthId: payrollId },
        include: [{ model: User, as: 'employee', attributes: ['id', 'name', 'email', 'role', 'department'] }],
        order: [[{ model: User, as: 'employee' }, 'name', 'ASC']]
    });
    res.status(200).json({ status: 'success', data: payslips });
});

export const updatePayslip = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const slip = await Payslip.findByPk(id);
    if (!slip) return next(new AppError('Payslip not found', 404));

    if (slip.status === 'Paid') return next(new AppError('Cannot edit paid payslip', 400));

    await slip.update(req.body);

    // After updating a single payslip, recalculate the PayrollMonth totals
    const payroll = await PayrollMonth.findByPk(slip.payrollMonthId);
    if (payroll) {
        const result = await Payslip.findAll({
            where: { payrollMonthId: slip.payrollMonthId },
            attributes: [
                [sequelize.fn('SUM', sequelize.col('grossSalary')), 'totalGross'],
                [sequelize.fn('SUM', sequelize.col('netSalary')), 'totalNet']
            ],
            raw: true
        });
        
        // Sum totalDeductions manually or via query.
        const allSlips = await Payslip.findAll({ where: { payrollMonthId: slip.payrollMonthId }, attributes: ['pfDeduction', 'taxDeduction', 'otherDeductions', 'leaveDeduction']});
        const totalDed = allSlips.reduce((acc, curr) => acc + Number(curr.pfDeduction) + Number(curr.taxDeduction) + Number(curr.otherDeductions) + Number(curr.leaveDeduction), 0);

        payroll.totalGross = result[0]?.totalGross || 0;
        payroll.totalNet = result[0]?.totalNet || 0;
        payroll.totalDeductions = totalDed;
        await payroll.save();
    }

    res.status(200).json({ status: 'success', data: slip });
});

export const getEmployeeDashboardSalaryInfo = catchAsync(async (req, res, next) => {
    const { userId } = req.params; // or req.user.id for auth checks
    const activeSalary = await EmployeeSalary.findOne({ where: { userId, isActive: true }, include: [{ model: SalaryStructure, as: 'structure' }] });
    const payslips = await Payslip.findAll({ where: { userId, status: 'Paid' }, order: [['createdAt', 'DESC']], limit: 12 });
    
    res.status(200).json({
        status: 'success',
        data: { activeSalary, payslips }
    });
});

/** ==========================================
 *  5. REPORTS & EXPORTS
 *  ========================================== */

export const getMonthlyPayrollReport = catchAsync(async (req, res, next) => {
    const { monthId } = req.params;
    const payroll = await PayrollMonth.findByPk(monthId);
    if (!payroll) return next(new AppError('Payroll not found', 404));

    const allSlips = await Payslip.findAll({
        where: { payrollMonthId: monthId },
        include: [{ model: User, as: 'employee', attributes: ['id', 'name', 'role', 'department'] }]
    });

    // Group by department
    const deptSummary = allSlips.reduce((acc, slip) => {
        const dept = slip.employee?.department || 'Unassigned';
        if (!acc[dept]) acc[dept] = { count: 0, totalGross: 0, totalNet: 0 };
        acc[dept].count += 1;
        acc[dept].totalGross += Number(slip.grossSalary);
        acc[dept].totalNet += Number(slip.netSalary);
        return acc;
    }, {});

    res.status(200).json({
        status: 'success',
        data: { payroll, departmentSummary: deptSummary, slips: allSlips.length }
    });
});

export const getOrgWideSalarySummary = catchAsync(async (req, res, next) => {
    // Basic org-wide analytics
    const [totalEmployees, avgSalary, totalExpenditureYTD] = await Promise.all([
        EmployeeSalary.count({ where: { isActive: true } }),
        EmployeeSalary.findAll({ where: { isActive: true }, attributes: [[sequelize.fn('AVG', sequelize.col('basicPay')), 'avgBasic']] }),
        PayrollMonth.sum('totalNet', { where: { year: new Date().getFullYear(), status: 'Disbursed' } })
    ]);

    res.status(200).json({
        status: 'success',
        data: {
            totalActiveEmployees: totalEmployees,
            averageBasicPay: avgSalary[0]?.dataValues?.avgBasic || 0,
            ytdExpenditure: totalExpenditureYTD || 0,
        }
    });
});

export const downloadPayslipPDF = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const slip = await Payslip.findByPk(id, {
        include: [
            { model: User, as: 'employee', attributes: ['name', 'role', 'department', 'email'] },
            { model: PayrollMonth, as: 'payrollMonth', attributes: ['month', 'year'] }
        ]
    });
    if (!slip) return next(new AppError('Payslip not found', 404));

    // Return HTML meant for printing (can easily be converted to PDF via Puppeteer in prod)
    const html = `
    <html>
      <body style="font-family: Arial, sans-serif; padding: 40px; color: #333;">
        <h1 style="color: #4F46E5;">CampusOne ERP - Payslip</h1>
        <h3>${new Date(2000, slip.payrollMonth.month - 1).toLocaleString('en', {month:'long'})} ${slip.payrollMonth.year}</h3>
        <hr/>
        <p><strong>Employee:</strong> ${slip.employee.name} (${slip.employee.role})</p>
        <p><strong>Department:</strong> ${slip.employee.department}</p>
        <br/>
        <table style="width: 100%; border-collapse: collapse;">
          <tr style="background: #f3f4f6;"><th style="padding: 8px; text-align: left;">Earnings</th><th style="padding: 8px; text-align: right;">Amount</th></tr>
          <tr><td style="padding: 8px;">Basic Pay</td><td style="padding: 8px; text-align: right;">${slip.basicPay}</td></tr>
          <tr><td style="padding: 8px;">Bonus / Arrears</td><td style="padding: 8px; text-align: right;">${Number(slip.bonus) + Number(slip.arrears)}</td></tr>
          <tr style="background: #f3f4f6;"><th style="padding: 8px; text-align: left;">Deductions</th><th style="padding: 8px; text-align: right;">Amount</th></tr>
          <tr><td style="padding: 8px;">Tax + PF</td><td style="padding: 8px; text-align: right;">${Number(slip.taxDeduction) + Number(slip.pfDeduction)}</td></tr>
          <tr><td style="padding: 8px;">Leave Deduction</td><td style="padding: 8px; text-align: right;">${slip.leaveDeduction}</td></tr>
        </table>
        <h2 style="text-align: right; margin-top: 40px;">Net Pay: ₹${slip.netSalary}</h2>
      </body>
    </html>
    `;
    
    res.setHeader('Content-Type', 'text/html');
    res.send(html);
});
