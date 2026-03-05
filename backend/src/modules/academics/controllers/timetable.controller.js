import {
    Classroom, TimeSlot, TimetableEntry, Section, Course, User
} from '../../../models/index.js';
import catchAsync from '../../../utils/catchAsync.js';
import AppError from '../../../utils/appError.js';
import { logAudit } from '../../admin/utils/audit.util.js';
import { Op } from 'sequelize';

/**
 * Create a new timetable entry with conflict detection
 */
export const createTimetableEntry = catchAsync(async (req, res, next) => {
    const { timeSlotId, classroomId, sectionId, subjectId, facultyId, academicYear } = req.body;

    // 1. Check for Conflicts
    const conflict = await TimetableEntry.findOne({
        where: {
            timeSlotId,
            academicYear,
            [Op.or]: [
                { facultyId },      // Faculty busy?
                { classroomId },    // Room busy?
                { sectionId }       // Section busy?
            ]
        },
        include: [
            { model: User, as: 'faculty', attributes: ['firstName', 'lastName'] },
            { model: Classroom, as: 'classroom', attributes: ['name'] },
            { model: Section, as: 'section', attributes: ['name'] }
        ]
    });

    if (conflict) {
        let message = 'Scheduling conflict detected: ';
        if (conflict.facultyId === facultyId) message += `Faculty is already assigned to section ${conflict.section.name}. `;
        if (conflict.classroomId === classroomId) message += `Classroom ${conflict.classroom.name} is already occupied. `;
        if (conflict.sectionId === sectionId) message += `Section ${conflict.section.name} already has a lecture scheduled. `;

        return next(new AppError(message, 409));
    }

    const entry = await TimetableEntry.create(req.body);

    res.status(201).json({
        status: 'success',
        data: entry
    });

    await logAudit({
        action: 'TIMETABLE_ENTRY_CREATE',
        resource: 'TimetableEntry',
        resourceId: entry.id
    }, req);
});

/**
 * Get weekly timetable for a section
 */
export const getSectionTimetable = catchAsync(async (req, res, next) => {
    const { sectionId } = req.params;

    const timetable = await TimetableEntry.findAll({
        where: { sectionId },
        include: [
            { model: TimeSlot, as: 'timeSlot' },
            { model: Course, as: 'subject' },
            { model: User, as: 'faculty', attributes: ['firstName', 'lastName'] },
            { model: Classroom, as: 'classroom' }
        ],
        order: [
            [{ model: TimeSlot, as: 'timeSlot' }, 'dayOfWeek', 'ASC'],
            [{ model: TimeSlot, as: 'timeSlot' }, 'startTime', 'ASC']
        ]
    });

    res.status(200).json({
        status: 'success',
        data: timetable
    });
});

/**
 * Configuration CRUD
 */
export const createClassroom = catchAsync(async (req, res, next) => {
    const classroom = await Classroom.create(req.body);
    res.status(201).json({ status: 'success', data: classroom });
});

export const createTimeSlotsBatch = catchAsync(async (req, res, next) => {
    const slots = await TimeSlot.bulkCreate(req.body);
    res.status(201).json({ status: 'success', data: slots });
});

export const getClassrooms = catchAsync(async (req, res, next) => {
    const classrooms = await Classroom.findAll({ order: [['name', 'ASC']] });
    res.status(200).json({ status: 'success', data: classrooms });
});

export const getTimeSlots = catchAsync(async (req, res, next) => {
    const slots = await TimeSlot.findAll({ order: [['dayOfWeek', 'ASC'], ['startTime', 'ASC']] });
    res.status(200).json({ status: 'success', data: slots });
});
