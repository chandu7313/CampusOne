import { DataTypes } from 'sequelize';
import { sequelize } from '../../../config/database.js';

const Scholarship = sequelize.define('Scholarship', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    studentProfileId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    type: {
        type: DataTypes.ENUM('Merit', 'Need-Based', 'Sports', 'Other'),
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('Applied', 'Approved', 'Rejected'),
        defaultValue: 'Applied',
    }
}, {
    timestamps: true,
});

export default Scholarship;
