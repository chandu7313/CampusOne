import { DataTypes } from 'sequelize';
import { sequelize } from '../../../config/database.js';

const EmployeeSalary = sequelize.define('EmployeeSalary', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    salaryStructureId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    basicPay: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0,
    },
    hra: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0,
    },
    da: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0,
    },
    ta: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0,
    },
    medicalAllowance: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0,
    },
    grossSalary: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0,
    },
    pfDeduction: {
        type: DataTypes.DECIMAL(10, 2),
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
    netSalary: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0,
    },
    bankAccount: {
        type: DataTypes.STRING(30),
        allowNull: true,
    },
    bankName: {
        type: DataTypes.STRING(100),
        allowNull: true,
    },
    ifscCode: {
        type: DataTypes.STRING(15),
        allowNull: true,
    },
    effectiveFrom: {
        type: DataTypes.DATEONLY,
        allowNull: true,
    },
    assignedBy: {
        type: DataTypes.UUID,
        allowNull: true,
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    }
}, {
    tableName: 'employee_salaries',
    timestamps: true,
    hooks: {
        beforeSave: (instance) => {
            const gross = 
                Number(instance.basicPay || 0) +
                Number(instance.hra || 0) +
                Number(instance.da || 0) +
                Number(instance.ta || 0) +
                Number(instance.medicalAllowance || 0);
            
            const deductions = 
                Number(instance.pfDeduction || 0) +
                Number(instance.taxDeduction || 0) +
                Number(instance.otherDeductions || 0);
            
            instance.grossSalary = gross;
            instance.netSalary = Math.max(0, gross - deductions);
        }
    }
});

export default EmployeeSalary;
