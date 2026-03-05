import { DataTypes } from 'sequelize';
import { sequelize } from '../../../config/database.js';

const FacultyAssignment = sequelize.define('FacultyAssignment', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    facultyProfileId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    sectionId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    subjectId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    semesterId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    academicYear: {
        type: DataTypes.STRING,
        allowNull: false,
    }
}, {
    timestamps: true,
});

export default FacultyAssignment;
