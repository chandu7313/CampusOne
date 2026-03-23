import {
    Classroom, TimeSlot, TimetableEntry, Timetable, Section, Course, User, Year, Semester, Department, Program,
    StudentProfile, StudentSection
} from '../../../models/index.js';
import catchAsync from '../../../utils/catchAsync.js';
import AppError from '../../../utils/appError.js';
import { logAudit } from '../../admin/utils/audit.util.js';
import { Op } from 'sequelize';
import { invalidateCache } from '../../../utils/invalidateCache.js';
import { notify } from '../../../utils/notify.js';

/**
 * GET /api/v1/timetables
 * List all active timetables with hierarchy info
 */
export const getTimetables = catchAsync(async (req, res, next) => {
    const timetables = await Timetable.findAll({
        include: [
            { model: Department, as: 'department', attributes: ['name', 'code'] },
            { model: Program, as: 'program', attributes: ['name', 'code'] },
            { model: Year, as: 'year', attributes: ['name', 'yearNumber'] },
            { model: Semester, as: 'semester', attributes: ['semesterNumber'] },
            { model: Section, as: 'section', attributes: ['name'] }
        ],
        order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
        status: 'success',
        results: timetables.length,
        data: timetables
    });
});

/**
 * GET /api/v1/timetables/filter
 * Filter timetables based on hierarchy
 */
export const filterTimetables = catchAsync(async (req, res, next) => {
    const { departmentId, programId, yearId, semesterId, sectionId } = req.query;
    const filter = {};
    if (departmentId) filter.departmentId = departmentId;
    if (programId) filter.programId = programId;
    if (yearId) filter.yearId = yearId;
    if (semesterId) filter.semesterId = semesterId;
    if (sectionId) filter.sectionId = sectionId;

    const timetables = await Timetable.findAll({
        where: filter,
        include: [
            { model: Department, as: 'department' },
            { model: Program, as: 'program' },
            { model: Year, as: 'year' },
            { model: Semester, as: 'semester' },
            { model: Section, as: 'section' }
        ]
    });

    res.status(200).json({ status: 'success', data: timetables });
});

/**
 * GET /api/v1/timetables/available-sections
 * Return sections that do not yet have a timetable for the current academic year
 */
export const getAvailableSections = catchAsync(async (req, res, next) => {
    const { semesterId, academicYear } = req.query;

    const scheduledSections = await Timetable.findAll({
        where: { semesterId, academicYear },
        attributes: ['sectionId']
    });

    const scheduledIds = scheduledSections.map(s => s.sectionId);

    const availableSections = await Section.findAll({
        where: {
            semesterId,
            id: { [Op.notIn]: scheduledIds }
        }
    });

    res.status(200).json({ status: 'success', data: availableSections });
});

/**
 * POST /api/v1/timetables/create
 * Create a new Timetable header and its entries
 */
export const createTimetable = catchAsync(async (req, res, next) => {
    const {
        departmentId, programId, yearId, semesterId, sectionId, academicYear, entries
    } = req.body;

    // 1. Double check if already exists
    const existing = await Timetable.findOne({
        where: { sectionId, semesterId, academicYear }
    });

    if (existing) {
        return next(new AppError('A timetable already exists for this section in this semester.', 400));
    }

    // 2. Create Header
    const timetable = await Timetable.create({
        departmentId, programId, yearId, semesterId, sectionId, academicYear,
        status: 'ACTIVE'
    });

    // 3. Create Entries
    if (entries && entries.length > 0) {
        const entriesWithHeader = entries.map(e => ({
            ...e,
            timetableId: timetable.id
        }));
        await TimetableEntry.bulkCreate(entriesWithHeader);
    }

    res.status(201).json({
        status: 'success',
        data: timetable
    });

    await invalidateCache('/api/v1/timetables*');

    await logAudit({
        action: 'TIMETABLE_CREATE',
        resource: 'Timetable',
        resourceId: timetable.id,
        metadata: { sectionId, entryCount: entries?.length || 0 }
    }, req);
});

/**
 * PUT /api/v1/timetables/update/:id
 * Update Timetable entries (Replace all logic)
 */
export const updateTimetable = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const { entries, status } = req.body;

    const timetable = await Timetable.findByPk(id);
    if (!timetable) {
        return next(new AppError('Timetable not found', 404));
    }

    if (status) {
        await timetable.update({ status });
    }

    if (entries) {
        // Simple strategy: Clear and Re-insert
        await TimetableEntry.destroy({ where: { timetableId: id } });
        const entriesWithHeader = entries.map(e => ({
            ...e,
            timetableId: id
        }));
        await TimetableEntry.bulkCreate(entriesWithHeader);
    }

    res.status(200).json({
        status: 'success',
        data: timetable
    });

    await invalidateCache(`/api/v1/timetables/${id}*`, '/api/v1/timetables*');

    await logAudit({
        action: 'TIMETABLE_UPDATE',
        resource: 'Timetable',
        resourceId: id
    }, req);
});

/**
 * DELETE /api/v1/timetables/delete/:id
 * Remove header and cascaded entries
 */
export const deleteTimetable = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const timetable = await Timetable.findByPk(id);

    if (!timetable) {
        return next(new AppError('Timetable not found', 404));
    }

    // Deletion order matters if not using cascade in DB
    await TimetableEntry.destroy({ where: { timetableId: id } });
    await timetable.destroy();

    res.status(204).json({
        status: 'success',
        data: null
    });

    await invalidateCache('/api/v1/timetables*');

    await logAudit({
        action: 'TIMETABLE_DELETE',
        resource: 'Timetable',
        resourceId: id
    }, req);
});

/**
 * GET /api/v1/timetables/:id
 * Fetch a specific timetable by ID with entries
 */
export const getTimetableById = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const timetable = await Timetable.findByPk(id, {
        include: [
            { model: Section, as: 'section' },
            {
                model: TimetableEntry,
                as: 'entries',
                include: [
                    { model: TimeSlot, as: 'timeSlot' },
                    { model: Course, as: 'subject' },
                    { model: User, as: 'faculty', attributes: ['firstName', 'lastName'] },
                    { model: Classroom, as: 'classroom' }
                ]
            }
        ],
        order: [[{ model: TimetableEntry, as: 'entries' }, { model: TimeSlot, as: 'timeSlot' }, 'dayOfWeek', 'ASC']]
    });

    if (!timetable) return next(new AppError('Timetable not found', 404));

    res.status(200).json({
        status: 'success',
        data: timetable
    });
});

/**
 * GET /api/v1/timetables/section/:sectionId
 * Fetch full grid data for a specific section
 */
export const getSectionTimetable = catchAsync(async (req, res, next) => {
    const { sectionId } = req.params;

    const timetable = await Timetable.findOne({
        where: { sectionId, status: { [Op.ne]: 'ARCHIVED' } },
        include: [
            {
                model: TimetableEntry,
                as: 'entries',
                include: [
                    { model: TimeSlot, as: 'timeSlot' },
                    { model: Course, as: 'subject' },
                    { model: User, as: 'faculty', attributes: ['firstName', 'lastName'] },
                    { model: Classroom, as: 'classroom' }
                ]
            }
        ],
        order: [[{ model: TimetableEntry, as: 'entries' }, { model: TimeSlot, as: 'timeSlot' }, 'dayOfWeek', 'ASC']]
    });

    if (!timetable) {
        return res.status(200).json({ status: 'success', data: null });
    }

    res.status(200).json({
        status: 'success',
        data: timetable
    });
});

/**
 * Conflict detection (Unchanged in logic but exposed for UI)
 */
export const checkConflicts = catchAsync(async (req, res, next) => {
    const { facultyId, classroomId, timeSlotId, dayOfWeek, academicYear, ignoreTimetableId } = req.query;

    const conflicts = [];

    if (facultyId && timeSlotId && dayOfWeek) {
        const facultyConflict = await TimetableEntry.findOne({
            where: {
                facultyId,
                timeSlotId,
                dayOfWeek,
            },
            include: [{
                model: Timetable,
                as: 'timetable',
                where: {
                    academicYear,
                    id: { [Op.ne]: ignoreTimetableId }
                },
                include: [{ model: Section, as: 'section' }]
            }, { model: Course, as: 'subject' }]
        });

        if (facultyConflict) {
            conflicts.push({
                type: 'FACULTY',
                message: `Faculty overlap: teaching ${facultyConflict.subject.name} in Section ${facultyConflict.timetable.section.name}`
            });
        }
    }

    if (classroomId && timeSlotId && dayOfWeek) {
        const roomConflict = await TimetableEntry.findOne({
            where: {
                classroomId,
                timeSlotId,
                dayOfWeek,
            },
            include: [{
                model: Timetable,
                as: 'timetable',
                where: {
                    academicYear,
                    id: { [Op.ne]: ignoreTimetableId }
                },
                include: [{ model: Section, as: 'section' }]
            }, { model: Course, as: 'subject' }]
        });

        if (roomConflict) {
            conflicts.push({
                type: 'CLASSROOM',
                message: `Room overlap: occupied by ${roomConflict.subject.name} for Section ${roomConflict.timetable.section.name}`
            });
        }
    }

    res.status(200).json({ status: 'success', data: conflicts });
});

/**
 * Role-based timetable fetch (Student/Faculty)
 */
export const getMyTimetable = catchAsync(async (req, res, next) => {
    const { role, id: userId } = req.user;

    if (role === 'Student') {
        const profile = await StudentProfile.findOne({ where: { userId } });
        if (!profile) return next(new AppError('Student profile not found', 404));

        const studentSection = await StudentSection.findOne({
            where: { studentProfileId: profile.id }
        });
        if (!studentSection) return next(new AppError('You are not assigned to any section.', 404));

        const timetable = await Timetable.findOne({
            where: { sectionId: studentSection.sectionId, status: 'ACTIVE' },
            include: [
                {
                    model: TimetableEntry,
                    as: 'entries',
                    include: [
                        { model: TimeSlot, as: 'timeSlot' },
                        { model: Course, as: 'subject' },
                        { model: User, as: 'faculty', attributes: ['firstName', 'lastName'] },
                        { model: Classroom, as: 'classroom' }
                    ]
                }
            ],
            order: [[{ model: TimetableEntry, as: 'entries' }, { model: TimeSlot, as: 'timeSlot' }, 'dayOfWeek', 'ASC']]
        });

        return res.status(200).json({
            status: 'success',
            data: {
                entries: timetable?.entries || [],
                meta: {
                    sectionId: studentSection.sectionId,
                    timetableId: timetable?.id
                }
            }
        });
    }

    if (role === 'Faculty') {
        const entries = await TimetableEntry.findAll({
            where: { facultyId: userId },
            include: [
                { model: TimeSlot, as: 'timeSlot' },
                { model: Course, as: 'subject' },
                {
                    model: Timetable,
                    as: 'timetable',
                    include: [{ model: Section, as: 'section' }]
                },
                { model: Classroom, as: 'classroom' }
            ],
            order: [[{ model: TimeSlot, as: 'timeSlot' }, 'dayOfWeek', 'ASC'], [{ model: TimeSlot, as: 'timeSlot' }, 'startTime', 'ASC']]
        });

        return res.status(200).json({
            status: 'success',
            data: {
                entries: entries || []
            }
        });
    }

    next(new AppError('Unauthorized role for this view', 403));
});

/**
 * Configuration CRUD
 */
export const getClassrooms = catchAsync(async (req, res) => {
    const data = await Classroom.findAll({ order: [['name', 'ASC']] });
    res.status(200).json({ status: 'success', data });
});

export const getTimeSlots = catchAsync(async (req, res) => {
    const data = await TimeSlot.findAll({ order: [['dayOfWeek', 'ASC'], ['startTime', 'ASC']] });
    res.status(200).json({ status: 'success', data });
});

/**
 * POST /api/v1/timetables/:id/slots
 * Add a single new slot/entry to an existing timetable
 */
export const addSlot = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const { timeSlotId, subjectId, facultyId, classroomId, slotType, dayOfWeek, sectionId, academicYear } = req.body;

    const timetable = await Timetable.findByPk(id);
    if (!timetable) return next(new AppError('Timetable not found', 404));

    // Conflict checks
    const facultyConflict = await TimetableEntry.findOne({
        where: { facultyId, timeSlotId, dayOfWeek },
        include: [{ model: Timetable, as: 'timetable', where: { academicYear: timetable.academicYear, id: { [Op.ne]: id } } }]
    });
    if (facultyConflict) {
        return next(new AppError('Faculty conflict: This faculty member is already assigned at this day/time.', 409));
    }

    const roomConflict = await TimetableEntry.findOne({
        where: { classroomId, timeSlotId, dayOfWeek },
        include: [{ model: Timetable, as: 'timetable', where: { academicYear: timetable.academicYear, id: { [Op.ne]: id } } }]
    });
    if (roomConflict) {
        return next(new AppError('Room conflict: This classroom is already booked at this day/time.', 409));
    }

    const entry = await TimetableEntry.create({
        timetableId: id,
        timeSlotId,
        subjectId,
        facultyId,
        classroomId,
        slotType: slotType || 'LECTURE',
        dayOfWeek,
        sectionId: sectionId || timetable.sectionId,
        academicYear: academicYear || timetable.academicYear,
    });

    const populated = await TimetableEntry.findByPk(entry.id, {
        include: [
            { model: TimeSlot, as: 'timeSlot' },
            { model: Course, as: 'subject' },
            { model: User, as: 'faculty', attributes: ['id', 'firstName', 'lastName'] },
            { model: Classroom, as: 'classroom' },
        ]
    });

    res.status(201).json({ status: 'success', data: populated });

    await invalidateCache(`/api/v1/timetables/${id}*`, '/api/v1/timetables*');

    // Notify assigned faculty in real time
    if (facultyId) {
        await notify(facultyId, {
            type: 'TIMETABLE_ASSIGNED',
            title: 'New Class Assigned',
            message: `You have been assigned a new timetable slot.`,
            link: `/faculty/timetable`
        });
    }
});

/**
 * PUT /api/v1/timetables/:id/slots/:slotId
 * Update an individual slot (faculty reassignment, room change, slotType, etc.)
 */
export const updateSlot = catchAsync(async (req, res, next) => {
    const { id, slotId } = req.params;
    const { subjectId, facultyId, classroomId, slotType, dayOfWeek, timeSlotId } = req.body;

    const entry = await TimetableEntry.findOne({ where: { id: slotId, timetableId: id } });
    if (!entry) return next(new AppError('Slot not found in this timetable', 404));

    const timetable = await Timetable.findByPk(id);
    const effectiveTimeSlotId = timeSlotId || entry.timeSlotId;
    const effectiveDayOfWeek = dayOfWeek || entry.dayOfWeek;
    const effectiveFacultyId = facultyId || entry.facultyId;
    const effectiveClassroomId = classroomId || entry.classroomId;

    // Faculty conflict check (skip self)
    if (facultyId || timeSlotId || dayOfWeek) {
        const facultyConflict = await TimetableEntry.findOne({
            where: { facultyId: effectiveFacultyId, timeSlotId: effectiveTimeSlotId, dayOfWeek: effectiveDayOfWeek, id: { [Op.ne]: slotId } },
            include: [{ model: Timetable, as: 'timetable', where: { academicYear: timetable.academicYear } }]
        });
        if (facultyConflict) {
            return next(new AppError('Faculty conflict: This faculty member is already assigned at this day/time.', 409));
        }
    }

    // Room conflict check (skip self)
    if (classroomId || timeSlotId || dayOfWeek) {
        const roomConflict = await TimetableEntry.findOne({
            where: { classroomId: effectiveClassroomId, timeSlotId: effectiveTimeSlotId, dayOfWeek: effectiveDayOfWeek, id: { [Op.ne]: slotId } },
            include: [{ model: Timetable, as: 'timetable', where: { academicYear: timetable.academicYear } }]
        });
        if (roomConflict) {
            return next(new AppError('Room conflict: This classroom is already booked at this day/time.', 409));
        }
    }

    await entry.update({
        ...(subjectId && { subjectId }),
        ...(facultyId && { facultyId }),
        ...(classroomId && { classroomId }),
        ...(slotType && { slotType }),
        ...(dayOfWeek && { dayOfWeek }),
        ...(timeSlotId && { timeSlotId }),
    });

    const populated = await TimetableEntry.findByPk(entry.id, {
        include: [
            { model: TimeSlot, as: 'timeSlot' },
            { model: Course, as: 'subject' },
            { model: User, as: 'faculty', attributes: ['id', 'firstName', 'lastName'] },
            { model: Classroom, as: 'classroom' },
        ]
    });

    res.status(200).json({ status: 'success', data: populated });

    await invalidateCache(`/api/v1/timetables/${id}*`, '/api/v1/timetables*');

    // Notify reassigned faculty in real time
    if (facultyId) {
        await notify(facultyId, {
            type: 'TIMETABLE_UPDATED',
            title: 'Timetable Slot Updated',
            message: `One of your timetable slots has been updated.`,
            link: `/faculty/timetable`
        });
    }

    await logAudit({ action: 'SLOT_UPDATE', resource: 'TimetableEntry', resourceId: slotId }, req);
});

/**
 * DELETE /api/v1/timetables/:id/slots/:slotId
 * Remove a single slot from a timetable
 */
export const deleteSlot = catchAsync(async (req, res, next) => {
    const { id, slotId } = req.params;

    const entry = await TimetableEntry.findOne({ where: { id: slotId, timetableId: id } });
    if (!entry) return next(new AppError('Slot not found in this timetable', 404));

    await entry.destroy();

    res.status(204).json({ status: 'success', data: null });

    await invalidateCache(`/api/v1/timetables/${id}*`, '/api/v1/timetables*');

    await logAudit({ action: 'SLOT_DELETE', resource: 'TimetableEntry', resourceId: slotId }, req);
});

/**
 * GET /api/v1/timetables/faculty/:facultyId
 * Get all timetable slots assigned to a specific faculty member
 */
export const getFacultySlots = catchAsync(async (req, res, next) => {
    const { facultyId } = req.params;
    const { academicYear } = req.query;

    const where = { facultyId };

    const entries = await TimetableEntry.findAll({
        where,
        include: [
            { model: TimeSlot, as: 'timeSlot' },
            { model: Course, as: 'subject' },
            { model: Classroom, as: 'classroom' },
            {
                model: Timetable,
                as: 'timetable',
                where: academicYear ? { academicYear } : {},
                include: [
                    { model: Section, as: 'section' },
                    { model: Department, as: 'department', attributes: ['name'] },
                    { model: Program, as: 'program', attributes: ['name'] },
                ]
            }
        ],
        order: [[{ model: TimeSlot, as: 'timeSlot' }, 'dayOfWeek', 'ASC'], [{ model: TimeSlot, as: 'timeSlot' }, 'startTime', 'ASC']]
    });

    res.status(200).json({ status: 'success', results: entries.length, data: entries });
});

