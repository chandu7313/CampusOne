import { DataTypes } from 'sequelize';
import { sequelize } from '../../../config/database.js';

const FacultyProfile = sequelize.define('FacultyProfile', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
        unique: true,
    },
    employeeId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    departmentId: {
        type: DataTypes.UUID,
        allowNull: true, // Optional for non-academic faculty
    },
    designation: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    specialization: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: [],
    },
    qualification: {
        type: DataTypes.STRING,
    },
    maxWeeklyHours: {
        type: DataTypes.INTEGER,
        defaultValue: 20,
    },
    biography: {
        type: DataTypes.TEXT,
    },
    joiningDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    }
}, {
    timestamps: true,
});

export default FacultyProfile;
