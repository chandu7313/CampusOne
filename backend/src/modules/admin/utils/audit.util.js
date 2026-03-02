import AuditLog from '../models/auditLog.model.js';
import logger from '../../../utils/logger.js';

/**
 * Log an administrative or security action
 * @param {Object} data 
 * @param {string} data.userId - ID of user performing the action
 * @param {string} data.action - Action type (e.g., LOGIN_FAIL)
 * @param {string} data.resource - Affected resource
 * @param {string} data.resourceId - ID of affected resource
 * @param {Object} data.metadata - Additional details
 * @param {Object} req - Express request object (to extract IP/UA)
 * @param {string} data.severity - INFO, WARNING, CRITICAL
 */
export const logAudit = async (data, req) => {
    try {
        const auditData = {
            userId: data.userId || (req?.user ? req.user.id : null),
            action: data.action,
            resource: data.resource,
            resourceId: data.resourceId,
            metadata: data.metadata || {},
            ipAddress: req?.ip || req?.connection?.remoteAddress,
            userAgent: req?.get('User-Agent'),
            severity: data.severity || 'INFO'
        };

        return await AuditLog.create(auditData);
    } catch (error) {
        logger.error('Failed to create audit log:', error);
        // We don't throw here to prevent the main process from crashing if logging fails
        return null;
    }
};
