import 'dotenv/config';
import User from '../src/modules/users/models/user.model.js';
import { connectDB } from '../src/config/database.js';

const verifyPasswords = async () => {
    try {
        await connectDB();
        const user = await User.findOne({ where: { email: 'admin@campusone.edu' } });
        if (!user) {
            console.log('Admin user not found');
            process.exit(1);
        }

        const passwords = ['adminpassword123', 'password123'];
        for (const pw of passwords) {
            const isMatch = await user.comparePassword(pw);
            console.log(`Password "${pw}": ${isMatch ? '✅ MATCH' : '❌ NO MATCH'}`);
        }
        process.exit(0);
    } catch (error) {
        console.error('Error verifying passwords:', error);
        process.exit(1);
    }
};

verifyPasswords();
