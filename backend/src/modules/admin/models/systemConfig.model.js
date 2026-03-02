import { DataTypes } from 'sequelize';
import { sequelize } from '../../../config/database.js';

const SystemConfig = sequelize.define('SystemConfig', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    key: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    value: {
        type: DataTypes.JSONB,
        allowNull: false,
    },
    category: {
        type: DataTypes.STRING,
        defaultValue: 'general',
    },
    description: {
        type: DataTypes.TEXT,
    }
}, {
    timestamps: true,
});

export default SystemConfig;
