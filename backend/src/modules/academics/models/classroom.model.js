import { DataTypes } from 'sequelize';
import { sequelize } from '../../../config/database.js';

const Classroom = sequelize.define('Classroom', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    building: {
        type: DataTypes.STRING,
    },
    capacity: {
        type: DataTypes.INTEGER,
        defaultValue: 60,
    },
    type: {
        type: DataTypes.ENUM('LECTURE_HALL', 'LAB', 'SEMINAR_ROOM'),
        defaultValue: 'LECTURE_HALL',
    }
}, {
    timestamps: true,
});

export default Classroom;
