import express from 'express';
import * as assignmentController from './controllers/assignment.controller.js';
import { protect } from '../../core/middlewares/auth.middleware.js';
import { authorize } from '../../core/middlewares/security.middleware.js';

const router = express.Router();

router.use(protect);

// Student Routes
router.get('/student', authorize('Student'), assignmentController.getStudentAssignments);
router.post('/submit', authorize('Student'), assignmentController.submitAssignment);

// Faculty Routes
router.get('/faculty', authorize('Faculty', 'Admin'), assignmentController.getFacultyAssignments);
router.post('/', authorize('Faculty', 'Admin'), assignmentController.createAssignment);
router.get('/:id/submissions', authorize('Faculty', 'Admin'), assignmentController.getAssignmentSubmissions);
router.post('/submissions/:id/grade', authorize('Faculty', 'Admin'), assignmentController.gradeSubmission);

export default router;
