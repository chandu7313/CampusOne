import { DataTypes } from 'sequelize';
import { sequelize } from '../../../config/database.js';

const FeePayment = sequelize.define('FeePayment', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    studentFeeId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    studentProfileId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    amountPaid: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    paymentMethod: {
        type: DataTypes.ENUM('Online', 'Cash', 'Cheque', 'DD', 'NEFT', 'UPI'),
        defaultValue: 'Online',
    },
    transactionId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    receiptNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    paymentDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    installmentId: {
        type: DataTypes.UUID,
        allowNull: true, // null means it's not tied to a specific installment
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    status: {
        type: DataTypes.ENUM('Success', 'Failed', 'Pending', 'Reversed'),
        defaultValue: 'Success',
    },
    isReversed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    reversedBy: {
        type: DataTypes.UUID,
        allowNull: true,
    },
    reversedAt: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    reversalReason: {
        type: DataTypes.TEXT,
        allowNull: true,
    }
}, {
    timestamps: true,
});

export default FeePayment;
