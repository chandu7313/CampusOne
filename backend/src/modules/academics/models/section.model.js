import { DataTypes } from 'sequelize';
import { sequelize } from '../../../config/database.js';

const Section = sequelize.define('Section', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    semesterId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: 'e.g., A, B, C'
    },
    roomId: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    capacity: {
        type: DataTypes.INTEGER,
        defaultValue: 60,
    }
}, {
    timestamps: true,
});

export default Section;
