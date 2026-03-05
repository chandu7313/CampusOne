import { DataTypes } from 'sequelize';
import { sequelize } from '../../../config/database.js';

const Announcement = sequelize.define('Announcement', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    priority: {
        type: DataTypes.ENUM('Low', 'Medium', 'High', 'Urgent'),
        defaultValue: 'Medium'
    },
    targetRoles: {
        type: DataTypes.JSONB,
        defaultValue: ["All"]
    },
    targetSections: {
        type: DataTypes.JSONB, // Array of section IDs if restricted
        allowNull: true
    },
    expiresAt: {
        type: DataTypes.DATE,
        allowNull: true
    },
    isPublished: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    authorId: {
        type: DataTypes.UUID,
        allowNull: false
    }
}, {
    timestamps: true
});

export default Announcement;
