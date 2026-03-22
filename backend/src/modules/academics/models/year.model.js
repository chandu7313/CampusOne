import { DataTypes } from 'sequelize';
import { sequelize } from '../../../config/database.js';

const Year = sequelize.define('Year', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    programId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: 'e.g., Year 1, 2nd Year'
    },
    yearNumber: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
}, {
    timestamps: true,
    indexes: [
        {
            unique: true,
            fields: ['programId', 'yearNumber']
        }
    ]
});

export default Year;
