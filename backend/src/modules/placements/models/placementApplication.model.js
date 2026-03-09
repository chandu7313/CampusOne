import { DataTypes } from 'sequelize';
import { sequelize } from '../../../config/database.js';

const PlacementApplication = sequelize.define('PlacementApplication', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    opportunityId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    studentId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    resumeUrl: {
        type: DataTypes.STRING,
    },
    status: {
        type: DataTypes.ENUM('Applied', 'Shortlisted', 'Interviewing', 'Selected', 'Rejected'),
        defaultValue: 'Applied',
    },
    notes: {
        type: DataTypes.TEXT,
    }
}, {
    timestamps: true,
});

export default PlacementApplication;
