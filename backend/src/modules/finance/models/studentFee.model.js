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
    paidAmount: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0,
    },
    dueDate: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('Pending', 'Partial', 'Paid', 'Overdue'),
        defaultValue: 'Pending',
    }
}, {
    timestamps: true,
});

export default StudentFee;
