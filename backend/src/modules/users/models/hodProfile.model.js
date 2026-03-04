import { DataTypes } from 'sequelize';
import { sequelize } from '../../../config/database.js';

const HODProfile = sequelize.define('HODProfile', {
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
    departmentId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    employeeId: {
        type: DataTypes.STRING,
        unique: true,
    },
    officeContact: {
        type: DataTypes.STRING,
    },
    delegationAuthority: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    tenureStart: {
        type: DataTypes.DATEONLY,
    },
    tenureEnd: {
        type: DataTypes.DATEONLY,
    }
}, {
    timestamps: true,
});

export default HODProfile;
