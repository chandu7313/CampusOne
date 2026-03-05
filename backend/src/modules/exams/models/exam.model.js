import { DataTypes } from 'sequelize';
import { sequelize } from '../../../config/database.js';

const Exam = sequelize.define('Exam', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    type: {
        type: DataTypes.ENUM('MIDTERM', 'FINAL', 'RE-EXAM'),
        allowNull: false,
    },
    academicYear: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    startDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    endDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('DRAFT', 'PUBLISHED', 'COMPLETED', 'RESULTS_PUBLISHED'),
        defaultValue: 'DRAFT',
    }
}, {
    timestamps: true,
});

export default Exam;
