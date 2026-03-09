import { Announcement, Event, User } from '../../../models/index.js';
import catchAsync from '../../../utils/catchAsync.js';
import { Op } from 'sequelize';

/**
 * Get active announcements for students and faculty
 */
export const getActiveAnnouncements = catchAsync(async (req, res, next) => {
    // Optionally filter by role or department here in the future
    const announcements = await Announcement.findAll({
        where: { isPublished: true },
        include: [{ model: User, as: 'author', attributes: ['firstName', 'lastName', 'role', 'avatar'] }],
        order: [['createdAt', 'DESC']],
        limit: 20
    });

    res.status(200).json({
        status: 'success',
        results: announcements.length,
        data: announcements
    });
});

/**
 * Get upcoming and active events
 */
export const getUpcomingEvents = catchAsync(async (req, res, next) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const events = await Event.findAll({
        where: {
            endDate: {
                [Op.gte]: today
            }
        },
        order: [['startDate', 'ASC']],
        limit: 20
    });

    res.status(200).json({
        status: 'success',
        results: events.length,
        data: events
    });
});
