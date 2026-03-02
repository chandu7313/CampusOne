import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import User from '../../modules/users/models/user.model.js';
import catchAsync from '../../utils/catchAsync.js';
import AppError from '../../utils/appError.js';

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

    // 2. Verify token
    const decoded = await promisify(jwt.verify)(token, process.env.ACCESS_TOKEN_SECRET);

    // 3. Check if user still exists
    const currentUser = await User.findByPk(decoded.id);
    if (!currentUser) {
        return next(new AppError('The user belonging to this token no longer exists.', 401));
    }

    // 4. Check if user changed password after the token was issued (optional, skipping for now)

    // Grant Access
    req.user = currentUser;
    next();
});
