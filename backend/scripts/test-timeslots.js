import 'dotenv/config';
import { TimeSlot } from '../src/models/index.js';
import { connectDB } from '../src/config/database.js';

const test = async () => {
    try {
        await connectDB();
        console.log('Connected to DB');

        const slots = await TimeSlot.findAll({ order: [['dayOfWeek', 'ASC'], ['startTime', 'ASC']] });
        console.log(`Found ${slots.length} time slots`);
        process.exit(0);
    } catch (err) {
        console.error('ERROR during TimeSlot query:');
        console.error(err);
        process.exit(1);
    }
};

test();
