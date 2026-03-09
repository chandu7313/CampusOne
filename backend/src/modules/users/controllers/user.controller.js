import { User, StudentProfile, FacultyProfile, Department, Program } from '../../../models/index.js';
import catchAsync from '../../../utils/catchAsync.js';
import AppError from '../../../utils/appError.js';

/**
 * Get current user profile data
 */
export const getMe = catchAsync(async (req, res, next) => {
    const userId = req.user.id;
    const role = req.user.role;

    let profileData = null;

    const user = await User.findByPk(userId, {
        attributes: { exclude: ['password'] }
    });

    if (role === 'Student') {
        profileData = await StudentProfile.findOne({
            where: { userId },
            include: [
                { model: Program, as: 'program', attributes: ['name'] },
                { model: Department, as: 'department', attributes: ['name'] }
            ]
        });
    } else if (role === 'Faculty') {
        profileData = await FacultyProfile.findOne({
            where: { userId },
            include: [{ model: Department, as: 'department', attributes: ['name'] }]
        });
    }

    res.status(200).json({
        status: 'success',
        data: {
            user,
            profile: profileData
        }
    });
});

/**
 * Update current user profile
 */
export const updateMe = catchAsync(async (req, res, next) => {
    const { firstName, lastName, email, phone, bio, avatar } = req.body;
    const user = await User.findByPk(req.user.id);

    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (email) user.email = email;
    await user.save();

    // Update role specific bio/phone if they exist in profiles
    if (req.user.role === 'Student') {
        const profile = await StudentProfile.findOne({ where: { userId: user.id } });
        if (profile) {
            if (phone) profile.phoneNumber = phone;
            await profile.save();
        }
    } else if (req.user.role === 'Faculty') {
        const profile = await FacultyProfile.findOne({ where: { userId: user.id } });
        if (profile) {
            if (phone) profile.phoneNumber = phone;
            if (bio) profile.bio = bio;
            await profile.save();
        }
    }

    res.status(200).json({
        status: 'success',
        data: { user }
    });
});
