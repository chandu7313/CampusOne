import { DataTypes } from 'sequelize';
import { sequelize } from '../../../config/database.js';

const SalaryRevision = sequelize.define('SalaryRevision', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    oldBasic: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    newBasic: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    revisionType: {
        type: DataTypes.STRING(30),
        allowNull: true,
    },
    effectiveDate: {
        type: DataTypes.DATEONLY,
        allowNull: true,
    },
    approvedBy: {
        type: DataTypes.UUID,
        allowNull: true,
    },
    remarks: {
        type: DataTypes.TEXT,
        allowNull: true,
    }
}, {
    tableName: 'salary_revisions',
    timestamps: true,
});

export default SalaryRevision;
