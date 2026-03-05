import express from 'express';
import * as assignmentController from './controllers/assignment.controller.js';
import { protect } from '../../core/middlewares/auth.middleware.js';
import { authorize } from '../../core/middlewares/security.middleware.js';

const router = express.Router();

router.use(protect);

router.get('/student', authorize('Student'), assignmentController.getStudentAssignments);
router.post('/submit', authorize('Student'), assignmentController.submitAssignment);

export default router;
