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
    programId: {
        type: DataTypes.UUID,
        allowNull: true,
    },
    academicYear: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    semester: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    totalAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    tuitionFee: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
    libraryFee: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
    labFee: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
    examinationFee: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
    sportsFee: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
    hostelFee: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
    transportFee: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
    developmentFee: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
    medicalFee: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
    miscellaneous: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
    otherFees: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
    discountAmount: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0,
    },
    discountReason: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    scholarshipAmount: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0,
    },
    finalAmount: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0,
        comment: 'total - discount - scholarship + fineAmount; set on create/update',
    },
    fineAmount: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0,
    },
    fineReason: {
        type: DataTypes.STRING,
        allowNull: true,
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
                Number(fee.scholarshipAmount || 0) +
                Number(fee.fineAmount || 0)
            );
        }
    }
});

export default StudentFee;

