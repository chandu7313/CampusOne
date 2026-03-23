import express from 'express';
import * as feeAdmin from './controllers/feeAdmin.controller.js';
import * as feeStudent from './controllers/feeStudent.controller.js';
import * as salaryAdmin from './controllers/salaryAdmin.controller.js';
import { protect } from '../../core/middlewares/auth.middleware.js';
import { authorize } from '../../core/middlewares/security.middleware.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// ─────────────────────────────────────────────
// STUDENT ROUTES
// ─────────────────────────────────────────────
router.get('/fees/me', authorize('Student'), feeStudent.getMyFees);
router.post('/fees/pay', authorize('Student'), feeStudent.processPayment);
router.get('/fees/payments/me', authorize('Student'), feeStudent.getMyPaymentHistory);
router.get('/fees/payments/:paymentId/receipt', authorize('Student', 'Admin', 'Finance'), feeStudent.getReceipt);

// ─────────────────────────────────────────────
// ADMIN / FINANCE — FEE MANAGEMENT
// ─────────────────────────────────────────────
const adminOnly = authorize('Admin', 'Finance');

// Fee Structures
router.get('/fee-structures', adminOnly, feeAdmin.getFeeStructures);
router.post('/fee-structures', adminOnly, feeAdmin.createFeeStructure);
router.put('/fee-structures/:id', adminOnly, feeAdmin.updateFeeStructure);
router.delete('/fee-structures/:id', adminOnly, feeAdmin.deleteFeeStructure);

// Student Fee Assignment
router.get('/fees', adminOnly, feeAdmin.getStudentFeesList);
router.post('/fees/assign', adminOnly, feeAdmin.assignStudentFee);
router.put('/fees/:id', adminOnly, feeAdmin.updateStudentFee);
router.delete('/fees/:id', adminOnly, feeAdmin.deleteStudentFee);

// Installments
router.post('/fees/:id/installments', adminOnly, feeAdmin.createInstallmentPlan);

// Scholarships
router.post('/fees/:feeId/scholarships', adminOnly, feeAdmin.applyScholarship);
router.patch('/scholarships/:scholarshipId/approve', adminOnly, feeAdmin.approveScholarship);

// Payment History (admin)
router.get('/payments', adminOnly, feeAdmin.getAllPayments);

// Finance Overview
router.get('/overview', adminOnly, feeAdmin.getFinanceOverview);

// ─────────────────────────────────────────────
// ADMIN / FINANCE — SALARY STRUCTURES (TEMPLATES)
// ─────────────────────────────────────────────
router.get('/salary-structures', adminOnly, salaryAdmin.getSalaryStructures);
router.post('/salary-structures', adminOnly, salaryAdmin.createSalaryStructure);
router.put('/salary-structures/:id', adminOnly, salaryAdmin.updateSalaryStructure);
router.delete('/salary-structures/:id', adminOnly, salaryAdmin.deleteSalaryStructure);

// ─────────────────────────────────────────────
// ADMIN / FINANCE — EMPLOYEE SALARIES (ASSIGNMENTS)
// ─────────────────────────────────────────────
router.get('/employee-salaries', adminOnly, salaryAdmin.getEmployeeSalaries);
router.post('/employee-salaries/assign', adminOnly, salaryAdmin.assignEmployeeSalary);
router.get('/employee-salaries/:userId/history', adminOnly, salaryAdmin.getSalaryHistory);

// ─────────────────────────────────────────────
// ADMIN / FINANCE — PAYROLL PROCESSING
// ─────────────────────────────────────────────
router.post('/payroll/generate', adminOnly, salaryAdmin.generatePayroll);
router.get('/payroll', adminOnly, salaryAdmin.getPayrollMonths);
router.put('/payroll/:id/status', adminOnly, salaryAdmin.updatePayrollStatus);

// ─────────────────────────────────────────────
// ADMIN / FINANCE — PAYSLIPS
// ─────────────────────────────────────────────
router.get('/payslips/:payrollId', adminOnly, salaryAdmin.getPayslipsForMonth);
router.put('/payslips/:id', adminOnly, salaryAdmin.updatePayslip);

// Employee Self-Service Dashboard route
router.get('/salary/me/:userId', authorize('Faculty', 'Staff', 'Admin', 'Finance'), salaryAdmin.getEmployeeDashboardSalaryInfo);

// ─────────────────────────────────────────────
// ADMIN / FINANCE — REPORTS & EXPORTS
// ─────────────────────────────────────────────
router.get('/salary/reports/summary', adminOnly, salaryAdmin.getOrgWideSalarySummary);
router.get('/salary/reports/monthly/:monthId', adminOnly, salaryAdmin.getMonthlyPayrollReport);
router.get('/payslips/:id/download', authorize('Faculty', 'Staff', 'Admin', 'Finance'), salaryAdmin.downloadPayslipPDF);

export default router;
