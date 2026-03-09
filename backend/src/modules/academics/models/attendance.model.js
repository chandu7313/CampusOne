import { DataTypes } from 'sequelize';
import { sequelize } from '../../../config/database.js';

const Attendance = sequelize.define('Attendance', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    studentId: { // User ID of the student
        type: DataTypes.UUID,
        allowNull: false,
    },
    subjectId: { // Course ID
        type: DataTypes.UUID,
        allowNull: false,
    },
    facultyId: { // User ID of the faculty marking it
        type: DataTypes.UUID,
        allowNull: false,
    },
    date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('Present', 'Absent', 'Late', 'Excused'),
        defaultValue: 'Present',
    },
    remarks: {
        type: DataTypes.STRING,
    }
}, {
    timestamps: true,
});

export default Attendance;
