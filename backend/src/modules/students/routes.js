import express from 'express';
import * as studentController from './controllers/student.controller.js';
import { protect } from '../../core/middlewares/auth.middleware.js';
import { authorize } from '../../core/middlewares/security.middleware.js';

const router = express.Router();

// All student management requires Authentication and Admin role
router.use(protect);
router.use(authorize('Admin'));

router.post('/admit', studentController.admitStudent);
router.post('/enroll', studentController.enrollInCourse);
router.post('/promote', studentController.promoteStudents);

export default router;
