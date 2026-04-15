import { DataTypes } from 'sequelize';
import { sequelize } from '../../../config/database.js';

const FeeStructure = sequelize.define('FeeStructure', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    programId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    academicYear: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    semester: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    tuitionFee: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    libraryFee: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0,
    },
    labFee: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0,
    },
    examinationFee: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0,
    },
    sportsFee: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0,
    },
    hostelFee: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0,
    },
    transportFee: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0,
    },
    developmentFee: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0,
    },
    medicalFee: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0,
    },
    miscellaneous: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0,
    },
    otherFees: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    discountPercentage: {
        type: DataTypes.DECIMAL(5, 2),
        defaultValue: 0,
        comment: 'Percentage discount applied to all students using this structure',
    },
    dueDate: {
        type: DataTypes.INTEGER,
        defaultValue: 15,
        comment: 'Day of the month or days after assignment',
    },
    lateFeePerDay: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0,
    },
    lateFeeStartDate: {
        type: DataTypes.INTEGER,
        allowNull: true,
    }
}, {
    timestamps: true,
});

export default FeeStructure;

