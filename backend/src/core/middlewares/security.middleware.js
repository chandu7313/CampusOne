import { logAudit } from '../../modules/admin/utils/audit.util.js';
import AppError from '../../utils/appError.js';
import catchAsync from '../../utils/catchAsync.js';

/**
 * Middleware to authorize specific roles
 * @param {...string} roles 
 */
export const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user || (roles.length && !roles.includes(req.user.role))) {
            return next(new AppError('Forbidden: You do not have permission to perform this action', 403));
        }
        next();
    };
};

/**
 * Middleware to log sensitive actions
 * @param {string} actionName 
 * @param {string} resourceName 
 */
export const auditAction = (actionName, resourceName) => {
    return catchAsync(async (req, res, next) => {
        // We log after successful completion of the request
        res.on('finish', () => {
            if (res.statusCode >= 200 && res.statusCode < 300) {
                logAudit({
                    action: actionName,
                    resource: resourceName,
                    resourceId: req.params.id || req.body.id,
                    metadata: {
                        method: req.method,
                        url: req.originalUrl,
                        body: req.method !== 'GET' ? req.body : undefined
                    }
                }, req);
            }
        });
        next();
    });
};
