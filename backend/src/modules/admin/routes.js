import express from 'express';
import * as adminController from './controllers/admin.controller.js';
import { protect } from '../../core/middlewares/auth.middleware.js';
import { authorize } from '../../core/middlewares/security.middleware.js';

const router = express.Router();

// All routes here require Authentication and Admin role
router.use(protect);
router.use(authorize('Admin'));

router.get('/stats', adminController.getDashboardStats);
router.get('/logs', adminController.getActivityLogs);

// User Management
router.get('/users', adminController.getUsers);
router.post('/users', adminController.createUser);
router.patch('/users/:id/status', adminController.toggleUserStatus);

// System Configuration
router.get('/config', adminController.getSystemConfigs);
router.put('/config/:key', adminController.updateSystemConfig);

export default router;
