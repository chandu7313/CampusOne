import { Message, User } from '../../../models/index.js';
import catchAsync from '../../../utils/catchAsync.js';
import { Op } from 'sequelize';

/**
 * Get messages for the logged-in user
 */
export const getMyMessages = catchAsync(async (req, res, next) => {
    const messages = await Message.findAll({
        where: { receiverId: req.user.id },
        include: [
            {
                model: User,
                as: 'sender',
                attributes: ['firstName', 'lastName', 'role', 'avatar']
            }
        ],
        order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
        status: 'success',
        results: messages.length,
        data: messages
    });
});

/**
 * Mark message as read
 */
export const markAsRead = catchAsync(async (req, res, next) => {
    await Message.update(
        { isRead: true },
        { where: { id: req.params.id, receiverId: req.user.id } }
    );

    res.status(200).json({ status: 'success' });
});
