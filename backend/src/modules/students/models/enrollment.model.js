import { DataTypes } from 'sequelize';
import { sequelize } from '../../../config/database.js';

const Enrollment = sequelize.define('Enrollment', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    studentProfileId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    courseId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    academicYear: {
        type: DataTypes.STRING, // e.g., "2025-2026"
        allowNull: false,
    },
    semester: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    grade: {
        type: DataTypes.STRING,
    },
    status: {
        type: DataTypes.ENUM('Enrolled', 'Completed', 'Failed', 'Dropped'),
        defaultValue: 'Enrolled',
    }
}, {
    timestamps: true,
});

export default Enrollment;
