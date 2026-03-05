import { DataTypes } from 'sequelize';
import { sequelize } from '../../../config/database.js';

const ExamResult = sequelize.define('ExamResult', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    subjectExamId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    studentId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    marksObtained: {
        type: DataTypes.DECIMAL(5, 2),
    },
    grade: {
        type: DataTypes.STRING(2),
    },
    remarks: {
        type: DataTypes.TEXT,
    },
    isAbsent: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    }
}, {
    timestamps: true,
});

export default ExamResult;
