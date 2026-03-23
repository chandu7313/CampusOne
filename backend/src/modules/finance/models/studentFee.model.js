import { DataTypes } from 'sequelize';
import { sequelize } from '../../../config/database.js';

const StudentFee = sequelize.define('StudentFee', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    studentProfileId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    feeStructureId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    totalAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    discountAmount: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0,
    },
    scholarshipAmount: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0,
    },
    finalAmount: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0,
        comment: 'total - discount - scholarship; set on create/update',
    },
    paidAmount: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0,
    },
    dueDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('Pending', 'Partial', 'Paid', 'Overdue'),
        defaultValue: 'Pending',
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true,
    }
}, {
    timestamps: true,
    hooks: {
        beforeSave: (fee) => {
            fee.finalAmount = Math.max(
                0,
                Number(fee.totalAmount || 0) -
                Number(fee.discountAmount || 0) -
                Number(fee.scholarshipAmount || 0)
            );
        }
    }
});

export default StudentFee;

