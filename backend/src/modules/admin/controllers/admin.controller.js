import {
    User, FacultyProfile, HODProfile, StaffProfile, AuditLog, SystemConfig,
    StudentProfile, Department, StudentFee, Program
} from '../../../models/index.js';
import catchAsync from '../../../utils/catchAsync.js';
import AppError from '../../../utils/appError.js';
import { logAudit } from '../utils/audit.util.js';
import { Op } from 'sequelize';
import { sequelize } from '../../../config/database.js';
import { uploadImage } from '../../../utils/cloudinary.js';

/*Get aggregated institutional statistics for the Admin Dashboard
*/
export const getDashboardStats = catchAsync(async (req, res, next) => {
    // 1. User Counts
    const studentCount = await User.count({ where: { role: 'Student' } });
    const facultyCount = await User.count({ where: { role: 'Faculty' } });
    const adminCount = await User.count({ where: { role: 'Admin' } });

    // 2. Revenue Trends (Last 6 months)
    const revenueData = await StudentFee.findAll({
        attributes: [
            [sequelize.fn('date_trunc', 'month', sequelize.col('createdAt')), 'month'],
            [sequelize.fn('sum', sequelize.col('paidAmount')), 'total']
        ],
        group: [sequelize.fn('date_trunc', 'month', sequelize.col('createdAt'))],
        order: [[sequelize.fn('date_trunc', 'month', sequelize.col('createdAt')), 'ASC']],
        limit: 6,
        raw: true
    });

    // 3. Department Distribution
    const departmentDistribution = await StudentProfile.findAll({
        attributes: [
            [sequelize.col('program.department.name'), 'department'],
            [sequelize.fn('count', sequelize.col('StudentProfile.id')), 'count']
        ],
        include: [{
            model: Program,
            as: 'program',
            attributes: [],
            include: [{
                model: Department,
                as: 'department',
                attributes: []
            }]
        }],
        group: [sequelize.col('program.department.name')],
        raw: true
    });

    // 4. Recent Security Activities
    const recentLogs = await AuditLog.findAll({
        limit: 5,
        order: [['createdAt', 'DESC']],
        include: [{
            model: User,
            as: 'user',
            attributes: ['name', 'email']
        }]
    });

    // 5. System Health
    const systemHealth = {
        database: 'Connected',
        cloudinary: 'Active',
        lastBackup: new Date().toISOString()
    };

    res.status(200).json({
        status: 'success',
        data: {
            counts: {
                students: studentCount,
                faculty: facultyCount,
                admins: adminCount
            },
            revenueData: revenueData.map(r => ({
                month: new Date(r.month).toLocaleDateString('default', { month: 'short' }),
                amount: parseFloat(r.total)
            })),
            departmentData: departmentDistribution.map(d => ({
                name: d.department || 'Unassigned',
                value: parseInt(d.count)
            })),
            recentLogs,
            systemHealth
        }
    });

    await logAudit({ action: 'DASHBOARD_VIEW', resource: 'AdminDashboard' }, req);
});

/* Get institutional activity logs (paginated)
 */
export const getActivityLogs = catchAsync(async (req, res, next) => {
    const { page = 1, limit = 10, action, severity } = req.query;
    const offset = (page - 1) * limit;

    const where = {};
    if (action) where.action = action;
    if (severity) where.severity = severity;

    const { count, rows } = await AuditLog.findAndCountAll({
        where,
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['createdAt', 'DESC']],
        include: [{
            model: User,
            as: 'user',
            attributes: ['name', 'email']
        }]
    });

    res.status(200).json({
        status: 'success',
        data: {
            total: count,
            pages: Math.ceil(count / limit),
            currentPage: parseInt(page),
            logs: rows
        }
    });
});

/* List all users with pagination and filters
 */
export const getUsers = catchAsync(async (req, res, next) => {
    const { page = 1, limit = 10, search, role, isActive, department } = req.query;
    const offset = (page - 1) * limit;

    const where = {};
    if (role) where.role = role;
    if (department) where.department = department;
    if (isActive !== undefined && isActive !== '') where.isActive = isActive === 'true';
    if (search) {
        where[Op.or] = [
            { firstName: { [Op.iLike]: `%${search}%` } },
            { lastName: { [Op.iLike]: `%${search}%` } },
            { email: { [Op.iLike]: `%${search}%` } },
            { registrationNumber: { [Op.iLike]: `%${search}%` } }
        ];
    }

    const { count, rows } = await User.findAndCountAll({
        where,
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['createdAt', 'DESC']],
        attributes: { exclude: ['password'] }
    });

    res.status(200).json({
        status: 'success',
        data: {
            total: count,
            pages: Math.ceil(count / limit),
            currentPage: parseInt(page),
            users: rows
        }
    });
});

/* Create a new user (Admin-only creation)
 */
export const createUser = catchAsync(async (req, res, next) => {
    const {
        firstName, middleName, lastName, email, password, role, department,
        mobile, gender, dob, ...profileData
    } = req.body;

    // Handle Image Upload if file exists
    let avatarUrl = null;
    if (req.file) {
        const uploadResult = await uploadImage(req.file.buffer);
        avatarUrl = uploadResult.secure_url;
    }

    // Prevent privilege escalation: only SuperAdmin can create other Admins via API 
    // (Simulated for now, we'll assume the primary admin is performing this)
    if (role === 'Admin' || role === 'Super Admin') {
        if (req.user && req.user.email !== 'admin@campusone.edu') {
            return next(new AppError('Unauthorized: You cannot create high-level administrative accounts', 403));
        }
    }

    // 2. Execute within a Transaction
    const result = await sequelize.transaction(async (t) => {
        // Create the base User
        const user = await User.create({
            name: `${firstName} ${lastName}`, // Legacy fallback
            firstName,
            middleName,
            lastName,
            email,
            password,
            role,
            department,
            mobile,
            gender,
            dob,
            avatar: avatarUrl,
            createdBy: req.user ? req.user.id : null
        }, { transaction: t });

        // Handle Role-Specific Profiles dynamically
        if (role === 'Student') {
            await StudentProfile.create({
                userId: user.id,
                rollNumber: profileData.rollNumber,
                programId: profileData.programId,
                batchYear: profileData.batchYear
            }, { transaction: t });
        } else if (role === 'Faculty') {
            await FacultyProfile.create({
                userId: user.id,
                employeeId: profileData.employeeId,
                designation: profileData.designation,
                specialization: profileData.specialization,
                joiningDate: profileData.joiningDate
            }, { transaction: t });
        } else if (role === 'HOD') {
            await HODProfile.create({
                userId: user.id,
                employeeId: profileData.employeeId,
                departmentId: profileData.departmentId,
                officeContact: profileData.officeContact
            }, { transaction: t });
        } else if (['Librarian', 'Hostel Warden', 'Lab Assistant', 'IT Support Staff', 'Finance Officer'].includes(role)) {
            await StaffProfile.create({
                userId: user.id,
                employeeId: profileData.employeeId,
                department: department,
                designation: role,
                labAssigned: profileData.labAssigned,
                hostelAssigned: profileData.hostelAssigned,
                shiftTiming: profileData.shiftTiming,
                financeRoleLevel: profileData.financeRoleLevel,
                approvalLimit: profileData.approvalLimit
            }, { transaction: t });
        }

        return user;
    });

    res.status(201).json({
        status: 'success',
        data: {
            user: {
                id: result.id,
                name: result.name || `${result.firstName} ${result.lastName}`,
                email: result.email,
                role: result.role,
                registrationNumber: result.registrationNumber
            }
        }
    });

    await logAudit({
        action: 'USER_CREATE',
        resource: 'User',
        resourceId: result.id,
        metadata: { createdRole: role }
    }, req);
});

/*Toggle user active status
 */
export const toggleUserStatus = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const user = await User.findByPk(id);

    if (!user) return next(new AppError('User not found', 404));

    user.isActive = !user.isActive;
    await user.save();

    res.status(200).json({
        status: 'success',
        data: { isActive: user.isActive }
    });

    await logAudit({
        action: user.isActive ? 'USER_ACTIVATE' : 'USER_DEACTIVATE',
        resource: 'User',
        resourceId: user.id
    }, req);
});

/* Get all system configurations
 */
export const getSystemConfigs = catchAsync(async (req, res, next) => {
    const configs = await SystemConfig.findAll();
    res.status(200).json({ status: 'success', data: configs });
});

/* Update a specific system config
 */
export const updateSystemConfig = catchAsync(async (req, res, next) => {
    const { key } = req.params;
    const { value } = req.body;

    const [config] = await SystemConfig.upsert({ key, value });

    res.status(200).json({ status: 'success', data: config });

    await logAudit({
        action: 'CONFIG_UPDATE',
        resource: 'SystemConfig',
        metadata: { key, value }
    }, req);
});
