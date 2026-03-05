import { DataTypes } from 'sequelize';
import { sequelize } from '../../../config/database.js';

const StudentProfile = sequelize.define('StudentProfile', {
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
    registrationNumber: {
        type: DataTypes.STRING,
        unique: true,
    },
    rollNumber: {
        type: DataTypes.STRING,
        allowNull: true, // Can be assigned after admission
        unique: true,
    },
    admissionDate: {
        type: DataTypes.DATEONLY,
        defaultValue: DataTypes.NOW,
    },
    programId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    batchYear: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    currentSemester: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
    },
    isFullPaid: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    status: {
        type: DataTypes.ENUM('Active', 'Suspended', 'Graduated', 'Withdrawn'),
        defaultValue: 'Active',
    }
}, {
    timestamps: true,
});

export default StudentProfile;
