import { DataTypes } from 'sequelize';
import { sequelize } from '../../../config/database.js';

const PlacementOpportunity = sequelize.define('PlacementOpportunity', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    companyName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
    },
    packageExpected: {
        type: DataTypes.STRING, // e.g., "12 - 15 LPA"
    },
    eligibilityCriteria: {
        type: DataTypes.TEXT,
    },
    lastDateToApply: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    driveDate: {
        type: DataTypes.DATE,
    },
    status: {
        type: DataTypes.ENUM('Open', 'Closed', 'Completed'),
        defaultValue: 'Open',
    }
}, {
    timestamps: true,
});

export default PlacementOpportunity;
