import jwt from 'jsonwebtoken';
import User from '../../users/models/user.model.js';
import { generateToken } from '../utils/token.js';
import catchAsync from '../../../utils/catchAsync.js';
import AppError from '../../../utils/appError.js';
import { logAudit } from '../../admin/utils/audit.util.js';
import { Op } from 'sequelize';
import redis from '../../../config/redis.js';

export const login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new AppError('Please provide email and password', 400));
    }

    const user = await User.findOne({ where: { email } });

    if (!user) {
        await logAudit({ action: 'LOGIN_FAIL', metadata: { email, reason: 'User not found' } }, req);
        return next(new AppError('Incorrect email or password', 401));
    }

    // 1. Check if account is locked
    if (user.lockUntil && user.lockUntil > new Date()) {
        await logAudit({ action: 'LOGIN_LOCKED', userId: user.id, severity: 'WARNING' }, req);
        return next(new AppError('Account is temporarily locked due to multiple failed attempts. Please try again later.', 401));
    }

    // 2. Verify Password
    if (!(await user.comparePassword(password))) {
        // Increment failed attempts
        const failedAttempts = (user.failedLoginAttempts || 0) + 1;
        const updateData = { failedLoginAttempts: failedAttempts };

        // Lock after 5 attempts
        if (failedAttempts >= 5) {
            updateData.lockUntil = new Date(Date.now() + 30 * 60 * 1000); // 30 mins
            await logAudit({ action: 'LOCKOUT_TRIGGERED', userId: user.id, severity: 'CRITICAL' }, req);
        }

        await user.update(updateData);
        await logAudit({ action: 'LOGIN_FAIL', userId: user.id, metadata: { attempts: failedAttempts } }, req);

        return next(new AppError('Incorrect email or password', 401));
    }

    // 3. Success - Reset attempts
    await user.update({ failedLoginAttempts: 0, lockUntil: null });
    await logAudit({ action: 'LOGIN_SUCCESS', userId: user.id }, req);

    const token = generateToken(user.id);

    res.status(200).json({
        status: 'success',
        token,
        data: {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                department: user.department
            }
        }
    });
});

/**
 * POST /api/v1/auth/logout
 * Blacklists the current token in Redis for its remaining TTL.
 */
export const logout = catchAsync(async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (token) {
        try {
            const decoded = jwt.decode(token);
            if (decoded?.exp) {
                const ttl = decoded.exp - Math.floor(Date.now() / 1000);
                if (ttl > 0) {
                    await redis.setex(`blacklist:${token}`, ttl, '1');
                }
            }
        } catch (err) {
            console.error('Blacklist error:', err.message);
        }
    }

    await logAudit({ action: 'LOGOUT', userId: req.user?.id }, req);
    return res.status(200).json({ success: true, message: 'Logged out successfully.' });
});

/**
 * Force-logout all sessions for a user (e.g. after password change).
 * Any token issued before the stored timestamp will be rejected.
 *
 * @param {string|number} userId
 */
export const forceLogoutAllSessions = async (userId) => {
    await redis.set(`force_logout:${userId}`, Date.now().toString(), 'EX', 86400);
};

export const initAdmin = catchAsync(async (req, res, next) => {
    const adminExists = await User.findOne({ where: { role: 'Admin' } });

    if (adminExists) {
        return next(new AppError('Admin already exists', 400));
    }

    const admin = await User.create({
        name: 'System Admin',
        email: 'admin@campusone.edu',
        password: 'password123',
        role: 'Admin',
        department: 'Administration'
    });

    res.status(201).json({
        status: 'success',
        message: 'Default admin created',
        data: {
            email: admin.email,
            password: 'password123 (Please change after login)'
        }
    });
});
