import express from 'express';
import * as financeController from './controllers/finance.controller.js';
import { protect } from '../../core/middlewares/auth.middleware.js';
import { authorize } from '../../core/middlewares/security.middleware.js';

const router = express.Router();

// Student Routes
router.get('/student/me', authorize('Student'), financeController.getStudentFees);
router.post('/student/pay', authorize('Student'), financeController.processFeePayment);

// Admin / Finance Routes
router.use(authorize('Admin', 'Finance'));
router.get('/overview', financeController.getFinanceOverview);
router.post('/fee-structures', financeController.createFeeStructure);
router.patch('/scholarships/:scholarshipId/approve', financeController.approveScholarship);

export default router;
