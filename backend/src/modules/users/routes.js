import express from 'express';
import * as userController from './controllers/user.controller.js';
import { protect } from '../../core/middlewares/auth.middleware.js';

const router = express.Router();

router.use(protect);

router.get('/me', userController.getMe);
router.patch('/update-me', userController.updateMe);

export default router;
