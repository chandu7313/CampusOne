import { DataTypes } from 'sequelize';
import { sequelize } from '../../../config/database.js';

const SalaryStructure = sequelize.define('SalaryStructure', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    designation: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    roleType: {
        type: DataTypes.ENUM('Faculty', 'Staff', 'Authority'),
        allowNull: false,
    },
    grade: {
        type: DataTypes.STRING(20),
        allowNull: true,
    },
    basicPay: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
    },
    hraPercent: {
        type: DataTypes.DECIMAL(5, 2),
        defaultValue: 0,
    },
    daPercent: {
        type: DataTypes.DECIMAL(5, 2),
        defaultValue: 0,
    },
    taPercent: {
        type: DataTypes.DECIMAL(5, 2),
        defaultValue: 0,
    },
    medicalAllowance: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0,
    },
    pfDeductionPercent: {
        type: DataTypes.DECIMAL(5, 2),
        defaultValue: 0,
    },
    taxDeduction: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0,
    },
    otherDeductions: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0,
    },
    effectiveFrom: {
        type: DataTypes.DATEONLY,
        allowNull: true,
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    }
}, {
    tableName: 'salary_structures',
    timestamps: true,
});

export default SalaryStructure;
