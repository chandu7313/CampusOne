import express from 'express';
import * as messageController from './controllers/message.controller.js';
import * as feedController from './controllers/feed.controller.js';
import { protect } from '../../core/middlewares/auth.middleware.js';

const router = express.Router();

router.use(protect);

// Messages
router.get('/messages', messageController.getMyMessages);
router.patch('/messages/:id/read', messageController.markAsRead);

// Feeds (Announcements & Events)
router.get('/announcements', feedController.getActiveAnnouncements);
router.get('/events', feedController.getUpcomingEvents);

export default router;
