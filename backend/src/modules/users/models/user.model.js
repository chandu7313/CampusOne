import { DataTypes } from 'sequelize';
import { sequelize } from '../../../config/database.js';
import bcrypt from 'bcryptjs';

const User = sequelize.define('User', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: true, // Temporarily true for migration
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    middleName: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    gender: {
        type: DataTypes.ENUM('Male', 'Female', 'Other'),
        allowNull: true,
    },
    dob: {
        type: DataTypes.DATEONLY,
        allowNull: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        },
    },
    mobile: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    alternateContact: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    permanentAddress: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    currentAddress: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    avatar: {
        type: DataTypes.STRING, // Profile Photo (Cloudinary URL)
        allowNull: true,
    },
    nationalId: {
        type: DataTypes.STRING, // Aadhar/Passport
        allowNull: true,
    },
    emergencyContact: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    bloodGroup: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    role: {
        type: DataTypes.ENUM(
            'Super Admin', 'Admin', 'HOD', 'Faculty', 'Student',
            'Finance Officer', 'Librarian', 'Hostel Warden',
            'Lab Assistant', 'IT Support Staff'
        ),
        allowNull: false,
        defaultValue: 'Student',
    },
    department: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    registrationNumber: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: true,
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
    accountStatus: {
        type: DataTypes.ENUM('Active', 'Inactive', 'Suspended'),
        defaultValue: 'Active',
    },
    lastLogin: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    failedLoginAttempts: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    lockUntil: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    passwordResetToken: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    passwordResetExpires: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    passwordExpiryDate: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    twoFactorEnabled: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    createdBy: {
        type: DataTypes.UUID,
        allowNull: true,
    }
}, {
    hooks: {
        beforeValidate: async (user) => {
            // Handle legacy 'name' field if passed for backward compatibility during migration
            if (user.name && !user.firstName) {
                const names = user.name.split(' ');
                user.firstName = names[0];
                user.lastName = names.slice(1).join(' ') || 'User';
            }
            if (user.firstName && user.lastName && !user.name) {
                user.name = `${user.firstName} ${user.lastName}`;
            }
        },
        beforeCreate: async (user) => {
            if (user.password) {
                user.password = await bcrypt.hash(user.password, 12);
            }

            // Generate Registration Number if not provided
            if (!user.registrationNumber) {
                const year = new Date().getFullYear();
                const prefixMap = {
                    'Student': 'STU',
                    'Faculty': 'FAC',
                    'Admin': 'ADM',
                    'Super Admin': 'SAD',
                    'HOD': 'HOD',
                    'Finance Officer': 'FIN',
                    'Librarian': 'LIB',
                    'Hostel Warden': 'WRD',
                    'Lab Assistant': 'LAB',
                    'IT Support Staff': 'ITS'
                };
                const prefix = prefixMap[user.role] || 'USR';
                // Lazy import crypto here since we removed the top level import
                const crypto = await import('crypto');
                const random = crypto.randomBytes(2).toString('hex').toUpperCase();
                user.registrationNumber = `${prefix}-${year}-${random}`;
            }
        },
        beforeUpdate: async (user) => {

            if (user.changed('password')) {
                user.password = await bcrypt.hash(user.password, 12);
            }
        },
    },
});

User.prototype.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

export default User;
