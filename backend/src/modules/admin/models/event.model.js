import { DataTypes } from 'sequelize';
import { sequelize } from '../../../config/database.js';

const Event = sequelize.define('Event', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT
    },
    startDate: {
        type: DataTypes.DATE,
        allowNull: false
    },
    endDate: {
        type: DataTypes.DATE,
        allowNull: false
    },
    location: {
        type: DataTypes.STRING
    },
    type: {
        type: DataTypes.ENUM('Workshop', 'Cultural', 'Sports', 'Seminar'),
        defaultValue: 'Workshop'
    },
    isPublic: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    targetRoles: {
        type: DataTypes.JSONB,
        defaultValue: ["Student", "Faculty"]
    }
}, {
    timestamps: true
});

export default Event;
