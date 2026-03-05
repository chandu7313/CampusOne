import express from 'express';
import * as examController from './controllers/exam.controller.js';
import { protect } from '../../core/middlewares/auth.middleware.js';
import { authorize } from '../../core/middlewares/security.middleware.js';

const router = express.Router();

// All exam management requires Authentication and Admin role
router.use(protect);
router.use(authorize('Admin'));

router.get('/', examController.getExams);
router.post('/', examController.createExam);
router.post('/schedule-papers', examController.schedulePapers);
router.post('/assign-hall', examController.assignHall);
router.post('/results/upload', examController.uploadResults);
router.get('/:id/schedule', examController.getExamSchedule);

export default router;
