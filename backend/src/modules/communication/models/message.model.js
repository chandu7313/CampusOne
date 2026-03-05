import { DataTypes } from 'sequelize';
import { sequelize } from '../../../config/database.js';

const Message = sequelize.define('Message', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    senderId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    receiverId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    subject: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    body: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    isRead: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    type: {
        type: DataTypes.ENUM('SYSTEM', 'FACULTY', 'MENTOR', 'ADMIN'),
        defaultValue: 'SYSTEM',
    }
}, {
    timestamps: true,
});

export default Message;
