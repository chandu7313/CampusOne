import { DataTypes } from 'sequelize';
import { sequelize } from '../../../config/database.js';

const AssignmentSubmission = sequelize.define('AssignmentSubmission', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    assignmentId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    studentId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('SUBMITTED', 'GRADED', 'LATE', 'RETURNED'),
        defaultValue: 'SUBMITTED',
    },
    submissionUrl: {
        type: DataTypes.STRING, // Link to file in Cloudinary
    },
    marksObtained: {
        type: DataTypes.FLOAT,
    },
    feedback: {
        type: DataTypes.TEXT,
    },
    submittedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    }
}, {
    timestamps: true,
});

export default AssignmentSubmission;
