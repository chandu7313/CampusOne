import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import User from '../../modules/users/models/user.model.js';
import catchAsync from '../../utils/catchAsync.js';
import AppError from '../../utils/appError.js';
import redis from '../../config/redis.js';

/**
 * Middleware to protect routes: verifies JWT and populates req.user
 */
export const protect = catchAsync(async (req, res, next) => {
    // 1. Get token and check if it exists
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return next(new AppError('You are not logged in! Please log in to get access.', 401));
    }

    // 2. Check if token is blacklisted (logout)
    const blacklisted = await redis.get(`blacklist:${token}`);
    if (blacklisted) {
        return next(new AppError('Session expired. Please login again.', 401));
    }

    // 3. Verify token
    const decoded = await promisify(jwt.verify)(token, process.env.ACCESS_TOKEN_SECRET);

    // 4. Check if user still exists
    const currentUser = await User.findByPk(decoded.id);
    if (!currentUser) {
        return next(new AppError('The user belonging to this token no longer exists.', 401));
    }

    // 5. Check force-logout (e.g. after password change)
    const forceLogoutAt = await redis.get(`force_logout:${decoded.id}`);
    if (forceLogoutAt && decoded.iat * 1000 < parseInt(forceLogoutAt)) {
        return next(new AppError('Password changed. Please login again.', 401));
    }

    // Grant Access
    req.user = currentUser;
    next();
});
