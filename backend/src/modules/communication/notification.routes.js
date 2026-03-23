import express from 'express';
import { protect } from '../../core/middlewares/auth.middleware.js';
import { getNotifications } from '../../utils/notify.js';

const router = express.Router();

/**
 * GET /api/v1/notifications
 * Returns the last 50 notifications for the authenticated user.
 */
router.get('/', protect, async (req, res) => {
  const notifications = await getNotifications(req.user.id);
  return res.status(200).json({ success: true, data: notifications });
});

export default router;
