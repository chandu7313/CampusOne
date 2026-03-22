import { sequelize } from './src/config/database.js';
import { Department, Program, Semester, Course } from './src/models/index.js';

const checkDb = async () => {
    try {
        await sequelize.authenticate();
        console.log('DB connected.');
        const hierarchy = await Department.findAll({
            include: [{
                model: Program,
                as: 'programs',
                include: [
                    { model: Semester, as: 'semesters' },
                    { model: Course, as: 'courses' }
                ]
            }]
        });
        console.log('Hierarchy length:', hierarchy?.length);
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
checkDb();
