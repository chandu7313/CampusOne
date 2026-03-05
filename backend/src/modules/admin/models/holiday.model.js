import { DataTypes } from 'sequelize';
import { sequelize } from '../../../config/database.js';

const Holiday = sequelize.define('Holiday', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    date: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    type: {
        type: DataTypes.ENUM('National', 'Institutional', 'Regional'),
        defaultValue: 'Institutional'
    },
    academicYear: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    timestamps: true
});

export default Holiday;
