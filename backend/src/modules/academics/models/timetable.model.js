import { DataTypes } from 'sequelize';
import { sequelize } from '../../../config/database.js';

const Timetable = sequelize.define('Timetable', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    departmentId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    programId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    yearId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    semesterId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    sectionId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    academicYear: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('DRAFT', 'ACTIVE', 'ARCHIVED'),
        defaultValue: 'DRAFT',
    }
}, {
    timestamps: true,
    indexes: [
        {
            unique: true,
            fields: ['sectionId', 'semesterId', 'academicYear']
        }
    ]
});

export default Timetable;
