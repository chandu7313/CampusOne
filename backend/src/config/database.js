import 'dotenv/config';
import { Sequelize } from 'sequelize';
import logger from '../utils/logger.js';

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false // Necessary for some managed DBs like Supabase
        }
    },
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
    },
});

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        logger.info('PostgreSQL connected successfully.');
    } catch (error) {
        logger.error('Unable to connect to the database:', error);
        process.exit(1);
    }
};

export { sequelize, connectDB };
