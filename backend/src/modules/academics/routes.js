import express from 'express';
import * as academicController from './controllers/academic.controller.js';
import { protect } from '../../core/middlewares/auth.middleware.js';
import { authorize } from '../../core/middlewares/security.middleware.js';

const router = express.Router();

// All academic management requires Authentication and Admin role
router.use(protect);
router.use(authorize('Admin'));

router.get('/hierarchy', academicController.getAcademicHierarchy);

router.post('/departments', academicController.createDepartment);
router.post('/programs', academicController.createProgram);
router.post('/courses', academicController.createCourse);

export default router;
