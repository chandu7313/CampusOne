import 'dotenv/config';
import { Timetable, TimetableEntry, TimeSlot } from '../src/models/index.js';
import { connectDB } from '../src/config/database.js';

const debugPublish = async () => {
    try {
        await connectDB();
        const latestTimetable = await Timetable.findOne({
            order: [['createdAt', 'DESC']]
        });
        
        console.log("Latest Timetable:");
        console.log(latestTimetable?.toJSON());
        
        if (latestTimetable) {
            const entries = await TimetableEntry.findAll({
                where: { timetableId: latestTimetable.id }
            });
            console.log("Entries for this timetable:");
            console.log(entries.map(e => e.toJSON()));
        }
        
        process.exit(0);
    } catch(err) {
        console.error(err);
        process.exit(1);
    }
}

debugPublish();
