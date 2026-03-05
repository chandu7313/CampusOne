import { Holiday, Event } from '../../../models/index.js';
import catchAsync from '../../../utils/catchAsync.js';
import AppError from '../../../utils/appError.js';
import { logAudit } from '../utils/audit.util.js';
import { Op } from 'sequelize';

/**
 * Get unified calendar (Holidays + Events)
 */
export const getCalendar = catchAsync(async (req, res, next) => {
    const { start, end, academicYear } = req.query;

    const where = {};
    if (academicYear) where.academicYear = academicYear;

    const [holidays, events] = await Promise.all([
        Holiday.findAll({ where }),
        Event.findAll({
            where: {
                [Op.or]: [
                    {
                        startDate: { [Op.between]: [new Date(start), new Date(end)] }
                    },
                    {
                        endDate: { [Op.between]: [new Date(start), new Date(end)] }
                    }
                ]
            }
        })
    ]);

    res.status(200).json({
        status: 'success',
        data: { holidays, events }
    });
});

/**
 * Create batch holidays (Academic Calendar Import)
 */
export const createHolidaysBatch = catchAsync(async (req, res, next) => {
    const holidays = await Holiday.bulkCreate(req.body);

    res.status(201).json({
        status: 'success',
        data: holidays
    });

    await logAudit({ action: 'HOLIDAY_BATCH_CREATE', resource: 'Holiday' }, req);
});

/**
 * Create new institutional event
 */
export const createEvent = catchAsync(async (req, res, next) => {
    const event = await Event.create(req.body);

    res.status(201).json({
        status: 'success',
        data: event
    });

    await logAudit({
        action: 'EVENT_CREATE',
        resource: 'Event',
        resourceId: event.id,
        metadata: { title: event.title }
    }, req);
});
