import { DataTypes } from 'sequelize';
import { sequelize } from '../../../config/database.js';

const TimetableEntry = sequelize.define('TimetableEntry', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    timetableId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    timeSlotId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    classroomId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    sectionId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    subjectId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    facultyId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    dayOfWeek: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'Monday',
    },
    slotType: {
        type: DataTypes.ENUM('LECTURE', 'LAB', 'TUTORIAL', 'BREAK'),
        defaultValue: 'LECTURE',
        allowNull: false,
    },
    academicYear: {
        type: DataTypes.STRING,
        allowNull: false,
    }
}, {
    timestamps: true,
});

export default TimetableEntry;
