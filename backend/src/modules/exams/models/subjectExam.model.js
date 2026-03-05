import { DataTypes } from 'sequelize';
import { sequelize } from '../../../config/database.js';

const SubjectExam = sequelize.define('SubjectExam', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    examId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    subjectId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    examDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    startTime: {
        type: DataTypes.TIME,
        allowNull: false,
    },
    endTime: {
        type: DataTypes.TIME,
        allowNull: false,
    },
    totalMarks: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    passingMarks: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
}, {
    timestamps: true,
});

export default SubjectExam;
