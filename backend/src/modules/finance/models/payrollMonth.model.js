import { DataTypes } from 'sequelize';
import { sequelize } from '../../../config/database.js';

const PayrollMonth = sequelize.define('PayrollMonth', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    month: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: { min: 1, max: 12 }
    },
    year: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('Draft', 'Processing', 'Approved', 'Disbursed'),
        defaultValue: 'Draft',
    },
    totalGross: {
        type: DataTypes.DECIMAL(12, 2),
        defaultValue: 0,
    },
    totalDeductions: {
        type: DataTypes.DECIMAL(12, 2),
        defaultValue: 0,
    },
    totalNet: {
        type: DataTypes.DECIMAL(12, 2),
        defaultValue: 0,
    },
    employeeCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    approvedBy: {
        type: DataTypes.UUID,
        allowNull: true,
    },
    approvedAt: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    disbursedAt: {
        type: DataTypes.DATE,
        allowNull: true,
    }
}, {
    tableName: 'payroll_months',
    timestamps: true,
    indexes: [
        {
            unique: true,
            fields: ['month', 'year']
        }
    ]
});

export default PayrollMonth;
