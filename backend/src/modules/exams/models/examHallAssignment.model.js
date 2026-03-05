import { DataTypes } from 'sequelize';
import { sequelize } from '../../../config/database.js';

const ExamHallAssignment = sequelize.define('ExamHallAssignment', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    subjectExamId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    classroomId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    facultyId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    studentCount: {
        type: DataTypes.INTEGER,
    }
}, {
    timestamps: true,
});

export default ExamHallAssignment;
