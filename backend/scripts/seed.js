import 'dotenv/config';
import User from '../src/modules/users/models/user.model.js';
import { connectDB, sequelize } from '../src/config/database.js';
import logger from '../src/utils/logger.js';

const seedUsers = async () => {
    try {
        await connectDB();

        // Sync models with database
        logger.info('Syncing database schema...');
        await sequelize.sync({ alter: true });
        logger.info('Database schema synced successfully.');

        // Create Faculty Account
        const facultyExists = await User.findOne({ where: { email: 'faculty@campusone.edu' } });
        if (!facultyExists) {
            await User.create({
                name: 'Dr. Jane Smith',
                email: 'faculty@campusone.edu',
                password: 'password123',
                role: 'Faculty',
                department: 'Computer Science'
            });
            logger.info('Faculty account created: faculty@campusone.edu / password123');
        } else {
            logger.info('Faculty account already exists.');
        }

        // Create Student Account
        const studentExists = await User.findOne({ where: { email: 'student@campusone.edu' } });
        if (!studentExists) {
            await User.create({
                name: 'John Doe',
                email: 'student@campusone.edu',
                password: 'password123',
                role: 'Student',
                department: 'Information Technology'
            });
            logger.info('Student account created: student@campusone.edu / password123');
        } else {
            logger.info('Student account already exists.');
        }

        logger.info('Seeding completed successfully.');
        process.exit(0);
    } catch (error) {
        logger.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedUsers();
