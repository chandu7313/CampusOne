import { DataTypes } from 'sequelize';
import { sequelize } from '../../../config/database.js';

const StudentSection = sequelize.define('StudentSection', {
    studentProfileId: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
    },
    sectionId: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
    },
    allocatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    }
}, {
    timestamps: false,
});

export default StudentSection;
