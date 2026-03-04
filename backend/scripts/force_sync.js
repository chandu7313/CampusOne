import 'dotenv/config';
import { sequelize, connectDB } from '../src/config/database.js';
import User from '../src/modules/users/models/user.model.js';
import logger from '../src/utils/logger.js';

const forceSync = async () => {
    try {
        await connectDB();
        logger.info('Starting DB Sync with { alter: true }...');

        // We sync specifically to ensure the User table reflects all new fields
        await sequelize.sync({ alter: true });

        logger.info('Database schema successfully altered and synced.');
        process.exit(0);
    } catch (error) {
        logger.error('Sync Error:', error);
        process.exit(1);
    }
};

forceSync();
