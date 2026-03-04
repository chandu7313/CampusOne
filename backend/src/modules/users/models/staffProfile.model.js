import { DataTypes } from 'sequelize';
import { sequelize } from '../../../config/database.js';

const StaffProfile = sequelize.define('StaffProfile', {
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
        unique: true,
    },
    // Generic Staff Fields
    department: {
        type: DataTypes.STRING,
    },
    designation: {
        type: DataTypes.STRING,
    },
    joiningDate: {
        type: DataTypes.DATEONLY,
    },
    shiftTiming: {
        type: DataTypes.STRING, // For Librarian, Warden
    },
    // Finance Specific
    financeRoleLevel: {
        type: DataTypes.STRING,
    },
    approvalLimit: {
        type: DataTypes.DECIMAL(15, 2),
    },
    assignedCampus: {
        type: DataTypes.STRING,
    },
    // Hostel Specific
    hostelAssigned: {
        type: DataTypes.STRING,
    },
    // Lab Specific
    labAssigned: {
        type: DataTypes.STRING,
    },
    // Librarian Specific
    librarySection: {
        type: DataTypes.STRING,
    }
}, {
    timestamps: true,
});

export default StaffProfile;
