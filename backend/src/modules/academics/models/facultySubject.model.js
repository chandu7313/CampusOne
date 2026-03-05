import { DataTypes } from 'sequelize';
import { sequelize } from '../../../config/database.js';

const FacultySubject = sequelize.define('FacultySubject', {
    facultyProfileId: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
    },
    subjectId: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
    },
    competencyLevel: {
        type: DataTypes.INTEGER,
        defaultValue: 5,
        validate: { min: 1, max: 10 }
    }
}, {
    timestamps: true,
});

export default FacultySubject;
