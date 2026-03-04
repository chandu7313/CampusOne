import 'dotenv/config';
import { connectDB, sequelize } from '../src/config/database.js';
import Department from '../src/modules/academics/models/department.model.js';
import Program from '../src/modules/academics/models/program.model.js';
import logger from '../src/utils/logger.js';

const programsList = [
    "Civil Engineering",
    "Mechanical Engineering",
    "Electrical Engineering",
    "Chemical Engineering",
    "Computer Science & Engineering (CSE)",
    "Software Engineering",
    "Information Technology (IT) Engineering",
    "Cybersecurity Engineering",
    "Data Science & Artificial Intelligence",
    "Aerospace Engineering",
    "Aeronautical Engineering",
    "Biomedical Engineering",
    "Biotechnology Engineering",
    "Biochemical Engineering",
    "Genetic Engineering"
];

const seedPrograms = async () => {
    try {
        await connectDB();
        await sequelize.sync();

        // 1. Create Engineering Department
        let engineeringDept = await Department.findOne({ where: { code: 'ENG' } });
        if (!engineeringDept) {
            engineeringDept = await Department.create({
                name: 'Engineering',
                code: 'ENG',
                description: 'Faculty of Engineering and Technology'
            });
            logger.info('Engineering Department created.');
        }

        // 2. Create Programs
        for (const progName of programsList) {
            const progCode = progName.split(' ').map(word => word[0]).join('').toUpperCase() + Math.floor(100 + Math.random() * 900);
            const exists = await Program.findOne({ where: { name: progName } });

            if (!exists) {
                await Program.create({
                    name: progName,
                    code: progCode,
                    departmentId: engineeringDept.id,
                    durationYears: 4,
                });
                logger.info(`Program created: ${progName} (${progCode})`);
            }
        }

        logger.info('Academic seeding completed successfully.');
        process.exit(0);
    } catch (error) {
        logger.error('Error seeding programs:', error);
        process.exit(1);
    }
};

seedPrograms();
