import 'dotenv/config';
import { sequelize } from '../src/config/database.js';
import { Section, StudentProfile, User } from '../src/models/index.js';

const run = async () => {
    try {
        await sequelize.authenticate();
        console.log('DB connected');

        const section = await Section.findOne({
            include: [
                {
                    model: StudentProfile,
                    as: 'students',
                    include: [
                        { model: User, as: 'user', attributes: ['id', 'firstName', 'lastName', 'email', 'avatarUrl'] }
                    ]
                }
            ]
        });

        console.log('Success:', section ? section.id : 'No section found');
        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
};

run();
