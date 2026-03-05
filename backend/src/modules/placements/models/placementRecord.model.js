import { DataTypes } from 'sequelize';
import { sequelize } from '../../../config/database.js';

const PlacementRecord = sequelize.define('PlacementRecord', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    studentId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    companyName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    package: {
        type: DataTypes.STRING, // e.g., "12 LPA"
    },
    designation: {
        type: DataTypes.STRING,
    },
    logoUrl: {
        type: DataTypes.STRING,
    },
    placementYear: {
        type: DataTypes.INTEGER,
    }
}, {
    timestamps: true,
});

export default PlacementRecord;
