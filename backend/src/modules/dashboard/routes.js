import express from 'express';
import * as dashboardController from './controllers/studentDashboard.controller.js';
import { protect } from '../../core/middlewares/auth.middleware.js';
import { authorize } from '../../core/middlewares/security.middleware.js';

const router = express.Router();

router.get('/summary', protect, authorize('Student'), dashboardController.getStudentSummary);

export default router;
