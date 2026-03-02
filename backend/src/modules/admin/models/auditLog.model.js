import { DataTypes } from 'sequelize';
import { sequelize } from '../../../config/database.js';

const AuditLog = sequelize.define('AuditLog', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: true,
        comment: 'User who performed the action'
    },
    action: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: 'Type of action performed: LOGIN_FAIL, ROLE_CHANGE, etc.'
    },
    resource: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'The module or entity affected'
    },
    resourceId: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'ID of the affected resource'
    },
    metadata: {
        type: DataTypes.JSONB,
        defaultValue: {},
        comment: 'Additional details about the action'
    },
    ipAddress: {
        type: DataTypes.STRING,
    },
    userAgent: {
        type: DataTypes.STRING,
    },
    severity: {
        type: DataTypes.ENUM('INFO', 'WARNING', 'CRITICAL'),
        defaultValue: 'INFO'
    }
}, {
    timestamps: true,
    updatedAt: false, // Audit logs are immutable
});

export default AuditLog;
