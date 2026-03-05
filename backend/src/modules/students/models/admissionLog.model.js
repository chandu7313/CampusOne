import { DataTypes } from 'sequelize';
import { sequelize } from '../../../config/database.js';

const AdmissionLog = sequelize.define('AdmissionLog', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    studentProfileId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    academicYear: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    admissionType: {
        type: DataTypes.STRING,
    },
    documentsVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    }
}, {
    timestamps: true,
});

export default AdmissionLog;
