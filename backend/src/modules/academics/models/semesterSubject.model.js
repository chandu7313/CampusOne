import { DataTypes } from 'sequelize';
import { sequelize } from '../../../config/database.js';

const SemesterSubject = sequelize.define('SemesterSubject', {
    semesterId: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
    },
    subjectId: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
    }
}, {
    timestamps: false,
});

export default SemesterSubject;
