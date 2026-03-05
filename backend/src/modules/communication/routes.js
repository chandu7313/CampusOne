import express from 'express';
import * as messageController from './controllers/message.controller.js';
import { protect } from '../../core/middlewares/auth.middleware.js';

const router = express.Router();

router.use(protect);

router.get('/', messageController.getMyMessages);
router.patch('/:id/read', messageController.markAsRead);

export default router;
