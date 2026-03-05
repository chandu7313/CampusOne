import { Announcement, User, StudentProfile } from '../../../models/index.js';
import catchAsync from '../../../utils/catchAsync.js';
import AppError from '../../../utils/appError.js';
import logger from '../../../utils/logger.js';
import { logAudit } from '../utils/audit.util.js';

/**
 * Create and broadcast announcement
 */
export const createAnnouncement = catchAsync(async (req, res, next) => {
    const announcement = await Announcement.create({
        ...req.body,
        authorId: req.user.id
    });

    res.status(201).json({
        status: 'success',
        data: announcement
    });

    await logAudit({
        action: 'ANNOUNCEMENT_CREATE',
        resource: 'Announcement',
        resourceId: announcement.id,
        metadata: { title: announcement.title }
    }, req);
});

/**
 * Simulated mass email endpoint
 */
export const sendMassEmail = catchAsync(async (req, res, next) => {
    const { targetRole, targetSectionId, subject, body } = req.body;

    let recipients = [];

    if (targetRole) {
        recipients = await User.findAll({
            where: { role: targetRole },
            attributes: ['email']
        });
    } else if (targetSectionId) {
        // Logic to find students in section
        // (Simplified for now)
    }

    // In a real app, we would push to Bull queue here
    // For now, we simulate success
    logger.info(`[Email Simulation] Sending "${subject}" to ${recipients.length} recipients.`);

    res.status(200).json({
        status: 'success',
        message: `Email queued for ${recipients.length} recipients.`
    });

    await logAudit({
        action: 'MASS_EMAIL_SEND',
        resource: 'Communication',
        metadata: { subject, recipientCount: recipients.length }
    }, req);
});

/**
 * Get active announcements for feed
 */
export const getAnnouncements = catchAsync(async (req, res, next) => {
    const announcements = await Announcement.findAll({
        where: { isPublished: true },
        include: [{ model: User, as: 'author', attributes: ['firstName', 'lastName'] }],
        order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
        status: 'success',
        data: announcements
    });
});
