import express from 'express';
import * as authController from '../controllers/auth.controller.js';
import { protect } from '../../../core/middlewares/auth.middleware.js';
import { rateLimitMiddleware, loginRateLimiter } from '../../../core/middlewares/rateLimiter.middleware.js';

const router = express.Router();

router.post('/login', rateLimitMiddleware(loginRateLimiter), authController.login);
router.post('/logout', protect, authController.logout);
router.post('/init-admin', authController.initAdmin);

export default router;
