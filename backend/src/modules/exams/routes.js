import express from 'express';
import * as examController from './controllers/exam.controller.js';
import { protect } from '../../core/middlewares/auth.middleware.js';
import { authorize } from '../../core/middlewares/security.middleware.js';

const router = express.Router();

// Student Routes
router.get('/student/schedule', authorize('Student'), examController.getStudentExams);
router.get('/student/results', authorize('Student'), examController.getStudentResults);

// Faculty Routes
router.get('/faculty/exams', authorize('Faculty', 'Admin'), examController.getFacultyExams);
router.get('/faculty/results/:subjectExamId', authorize('Faculty', 'Admin'), examController.getFacultyExamResults);

// Admin / Faculty specific operations
router.use(authorize('Faculty', 'Admin'));
router.get('/', examController.getExams);
router.post('/', authorize('Admin'), examController.createExam);
router.post('/schedule-papers', authorize('Admin'), examController.schedulePapers);
router.post('/assign-hall', authorize('Admin'), examController.assignHall);
router.post('/results/upload', examController.uploadResults);
router.get('/:id/schedule', examController.getExamSchedule);

export default router;
