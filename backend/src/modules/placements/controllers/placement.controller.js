import { PlacementRecord, User } from '../../../models/index.js';
import catchAsync from '../../../utils/catchAsync.js';

/**
 * Get recent placement records for display
 */
export const getRecentPlacements = catchAsync(async (req, res, next) => {
    const records = await PlacementRecord.findAll({
        include: [
            {
                model: User,
                as: 'student',
                attributes: ['firstName', 'lastName', 'avatar']
            }
        ],
        order: [['createdAt', 'DESC']],
        limit: 20
    });

    res.status(200).json({
        status: 'success',
        data: records
    });
});
