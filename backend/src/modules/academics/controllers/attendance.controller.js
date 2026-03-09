import { Attendance, Course, User, StudentProfile } from '../../../models/index.js';
import catchAsync from '../../../utils/catchAsync.js';
import AppError from '../../../utils/appError.js';
import { Op } from 'sequelize';

// FACULTY: Mark or update attendance for a class
export const markAttendance = catchAsync(async (req, res, next) => {
    const { subjectId, date, records } = req.body;
    const { id: facultyId } = req.user;

    // records: [{ studentId: 'uuid', status: 'Present', remarks: '' }]

    // Bulk upsert logic
    const attendanceData = records.map(record => ({
        studentId: record.studentId,
        subjectId,
        facultyId,
        date,
        status: record.status,
        remarks: record.remarks || null
    }));

    // In a real DB with unique constraints on (studentId, subjectId, date), 
    // bulkCreate with updateOnDuplicate would be ideal.
    // Here we'll just loop for simplicity in SQLite/Postgres without complex unique keys.
    const results = await Promise.all(attendanceData.map(async (data) => {
        const [attendance, created] = await Attendance.findOrCreate({
            where: { studentId: data.studentId, subjectId: data.subjectId, date: data.date },
            defaults: data
        });

        if (!created) {
            await attendance.update(data);
        }
        return attendance;
    }));

    res.status(200).json({
        status: 'success',
        results: results.length,
        message: 'Attendance marked successfully'
    });
});

// STUDENT: Get full attendance statistics
export const getMyAttendance = catchAsync(async (req, res, next) => {
    const { id: userId, role } = req.user;

    if (role !== 'Student') {
        return next(new AppError('Only students can view their attendance stats', 403));
    }

    const attendances = await Attendance.findAll({
        where: { studentId: userId },
        include: [
            { model: Course, as: 'subject', attributes: ['name', 'code', 'credits'] }
        ]
    });

    // Group by subject and calculate percentages
    const stats = {};

    attendances.forEach(att => {
        const subId = att.subjectId;
        if (!stats[subId]) {
            stats[subId] = {
                subject: att.subject,
                total: 0,
                present: 0,
                absent: 0,
                late: 0,
                excused: 0
            };
        }

        stats[subId].total += 1;
        if (att.status === 'Present') stats[subId].present += 1;
        else if (att.status === 'Absent') stats[subId].absent += 1;
        else if (att.status === 'Late') stats[subId].late += 1;
        else if (att.status === 'Excused') stats[subId].excused += 1;
    });

    const summary = Object.values(stats).map(s => ({
        ...s,
        percentage: s.total > 0 ? ((s.present + s.late + s.excused) / s.total) * 100 : 0
    }));

    res.status(200).json({
        status: 'success',
        data: summary
    });
});

// FACULTY: Get attendance for a specific class date
export const getClassAttendance = catchAsync(async (req, res, next) => {
    const { subjectId, date } = req.query;

    if (!subjectId || !date) {
        return next(new AppError('Please provide subjectId and date', 400));
    }

    const attendances = await Attendance.findAll({
        where: { subjectId, date },
        include: [
            {
                model: User,
                as: 'student',
                attributes: ['firstName', 'lastName'],
                include: [{ model: StudentProfile, as: 'studentProfile', attributes: ['enrollmentNumber'] }]
            }
        ]
    });

    res.status(200).json({
        status: 'success',
        results: attendances.length,
        data: attendances
    });
});
