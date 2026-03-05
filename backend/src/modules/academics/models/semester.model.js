import { DataTypes } from 'sequelize';
import { sequelize } from '../../../config/database.js';

const Semester = sequelize.define('Semester', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    programId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    semesterNumber: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    academicYear: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: 'e.g., 2024-25'
    },
    status: {
        type: DataTypes.ENUM('UPCOMING', 'ACTIVE', 'COMPLETED'),
        defaultValue: 'UPCOMING',
    }
}, {
    timestamps: true,
    indexes: [
        {
            unique: true,
            fields: ['programId', 'semesterNumber', 'academicYear']
        }
    ]
});

export default Semester;
