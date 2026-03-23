import { DataTypes } from 'sequelize';
import { sequelize } from '../../../config/database.js';

const Payslip = sequelize.define('Payslip', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    payrollMonthId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    basicPay: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
    hra: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
    da: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
    ta: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
    medicalAllowance: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
    otherAllowances: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
    grossSalary: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
    pfDeduction: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
    taxDeduction: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
    otherDeductions: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
    workingDays: { type: DataTypes.INTEGER, defaultValue: 30 },
    absentDays: { type: DataTypes.INTEGER, defaultValue: 0 },
    leaveDeduction: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
    bonus: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
    arrears: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
    netSalary: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
    remarks: { type: DataTypes.TEXT, allowNull: true },
    status: {
        type: DataTypes.ENUM('Generated', 'Approved', 'Paid', 'Held'),
        defaultValue: 'Generated',
    },
    paymentDate: { type: DataTypes.DATE, allowNull: true },
    paymentRef: { type: DataTypes.STRING(100), allowNull: true }
}, {
    tableName: 'payslips',
    timestamps: true,
    hooks: {
        beforeSave: (instance) => {
            const gross = 
                Number(instance.basicPay || 0) +
                Number(instance.hra || 0) +
                Number(instance.da || 0) +
                Number(instance.ta || 0) +
                Number(instance.medicalAllowance || 0) +
                Number(instance.otherAllowances || 0) +
                Number(instance.bonus || 0) +
                Number(instance.arrears || 0);
            
            const deductions = 
                Number(instance.pfDeduction || 0) +
                Number(instance.taxDeduction || 0) +
                Number(instance.otherDeductions || 0) +
                Number(instance.leaveDeduction || 0);
            
            instance.grossSalary = gross;
            instance.netSalary = Math.max(0, gross - deductions);
        }
    }
});

export default Payslip;
