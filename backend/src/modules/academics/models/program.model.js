import { DataTypes } from 'sequelize';
import { sequelize } from '../../../config/database.js';

const Program = sequelize.define('Program', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    code: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    departmentId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    durationYears: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    totalSemesters: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 8 // Default for 4-year programs
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    }
}, {
    timestamps: true,
});

export default Program;
