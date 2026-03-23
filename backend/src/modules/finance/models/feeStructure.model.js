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
    }
}, {
    timestamps: true,
});

export default FeeStructure;

