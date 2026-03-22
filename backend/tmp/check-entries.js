import 'dotenv/config';
import { Timetable, TimetableEntry, TimeSlot } from '../src/models/index.js';
import { connectDB } from '../src/config/database.js';

const checkEntries = async () => {
    try {
        await connectDB();
        const entries = await TimetableEntry.findAll({
            include: [{ model: TimeSlot, as: 'timeSlot' }],
            limit: 5,
            order: [['createdAt', 'DESC']]
        });
        
        console.log("Recent Entries:");
        entries.forEach(e => {
            console.log(`ID: ${e.id}, Day: ${e.dayOfWeek}, TimeSlotID: ${e.timeSlotId}, TimeSlot.dayOfWeek: ${e.timeSlot?.dayOfWeek}, TimeSlot.startTime: ${e.timeSlot?.startTime}`);
        });
        process.exit(0);
    } catch(err) {
        console.error(err);
        process.exit(1);
    }
}

checkEntries();
