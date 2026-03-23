import { DataTypes } from 'sequelize';
import { sequelize } from '../../../config/database.js';

const FeeInstallment = sequelize.define('FeeInstallment', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    studentFeeId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    installmentNumber: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    dueDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    paidDate: {
        type: DataTypes.DATEONLY,
        allowNull: true,
    },
    status: {
        type: DataTypes.ENUM('Pending', 'Paid', 'Overdue'),
        defaultValue: 'Pending',
    }
}, {
    timestamps: true,
});

export default FeeInstallment;
