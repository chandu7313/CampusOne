import { sequelize } from './src/config/database.js';
import { Department, Program, Semester, Section } from './src/models/index.js';

const checkDb = async () => {
    try {
        await sequelize.authenticate();
        console.log('DB connected.');
        const depts = await Department.findAll({ include: [{ model: Program, as: 'programs', include: [{ model: Semester, as: 'semesters', include: [{ model: Section, as: 'sections', required: false }] }] }] });
        console.log('Departments:', JSON.stringify(depts, null, 2));
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
checkDb();
