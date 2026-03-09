import { DataTypes } from 'sequelize';
import { sequelize } from '../../../config/database.js';

const EventRegistration = sequelize.define('EventRegistration', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    eventId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('Registered', 'Attended', 'Cancelled'),
        defaultValue: 'Registered',
    }
}, {
    timestamps: true,
});

export default EventRegistration;
