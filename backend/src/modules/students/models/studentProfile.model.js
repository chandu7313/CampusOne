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
    rollNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
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
    status: {
        type: DataTypes.ENUM('Active', 'Suspended', 'Graduated', 'Withdrawn'),
        defaultValue: 'Active',
    }
}, {
    timestamps: true,
});

export default StudentProfile;
