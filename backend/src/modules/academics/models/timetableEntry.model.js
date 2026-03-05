import { DataTypes } from 'sequelize';
import { sequelize } from '../../../config/database.js';

const TimetableEntry = sequelize.define('TimetableEntry', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
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
    academicYear: {
        type: DataTypes.STRING,
        allowNull: false,
    }
}, {
    timestamps: true,
});

export default TimetableEntry;
