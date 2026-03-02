import User from '../../users/models/user.model.js';
import AuditLog from './auditLog.model.js';
import SystemConfig from './systemConfig.model.js';

// Define associations
AuditLog.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasMany(AuditLog, { foreignKey: 'userId', as: 'auditLogs' });

export {
    AuditLog,
    SystemConfig
};
