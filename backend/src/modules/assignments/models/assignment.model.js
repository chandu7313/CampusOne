import { DataTypes } from 'sequelize';
import { sequelize } from '../../../config/database.js';

const Assignment = sequelize.define('Assignment', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    subjectId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
    },
    dueDate: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    totalMarks: {
        type: DataTypes.INTEGER,
        defaultValue: 100,
    },
    type: {
        type: DataTypes.ENUM('HOMEWORK', 'PROJECT', 'QUIZ', 'LAB_REPORT'),
        defaultValue: 'HOMEWORK',
    }
}, {
    timestamps: true,
});

export default Assignment;
