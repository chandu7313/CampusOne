import 'dotenv/config';
import { User } from '../src/models/index.js';
import { connectDB } from '../src/config/database.js';

const checkUsers = async () => {
    try {
        await connectDB();
        const users = await User.findAll({ attributes: ['email', 'role', 'firstName', 'lastName'] });
        console.log('--- USERS IN DATABASE ---');
        users.forEach(u => console.log(`${u.role}: ${u.email} (${u.firstName} ${u.lastName})`));
        console.log('-------------------------');
        process.exit(0);
    } catch (error) {
        console.error('Error checking users:', error);
        process.exit(1);
    }
};

checkUsers();
