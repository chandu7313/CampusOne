import 'dotenv/config';
import { Year, Semester, Program } from '../src/models/index.js';
import { connectDB } from '../src/config/database.js';

const migrate = async () => {
    await connectDB();
    console.log('Connected to DB');

    const semesters = await Semester.findAll({ where: { yearId: null } });
    console.log(`Found ${semesters.length} semesters without yearId`);

    for (const sem of semesters) {
        let yearNum = Math.ceil(sem.semesterNumber / 2);

        // Find or create Year
        let [year] = await Year.findOrCreate({
            where: {
                programId: sem.programId,
                yearNumber: yearNum
            },
            defaults: {
                name: `Year ${yearNum}`
            }
        });

        sem.yearId = year.id;
        await sem.save();
        console.log(`Updated Semester ${sem.semesterNumber} for Program ${sem.programId} with Year ${yearNum}`);
    }

    console.log('Migration complete');
    process.exit(0);
};

migrate().catch(err => {
    console.error(err);
    process.exit(1);
});
