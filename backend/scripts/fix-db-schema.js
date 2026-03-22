import 'dotenv/config';
import { sequelize } from '../src/config/database.js';

const syncDb = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connected to DB');

        // Add yearId to Semesters
        await sequelize.query('ALTER TABLE "Semesters" ADD COLUMN IF NOT EXISTS "yearId" UUID;');
        console.log('Added yearId to Semesters');

        // Note: You might need to add a foreign key constraint here as well
        // await sequelize.query('ALTER TABLE "Semesters" ADD CONSTRAINT "Semesters_yearId_fkey" FOREIGN KEY ("yearId") REFERENCES "Years" ("id") ON DELETE SET NULL ON UPDATE CASCADE;');

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

syncDb();
