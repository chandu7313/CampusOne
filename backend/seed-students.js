import { sequelize } from './src/config/database.js';
import { User, StudentProfile, StudentSection, Section, Semester, Program, Department } from './src/models/index.js';
import { faker } from '@faker-js/faker';
import bcrypt from 'bcryptjs';

const seedStudents = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected.');

        // Get the specific hierarchy (Engineering > B.Tech/B.E. > Sem 1 > Section A)
        // First get department
        const dept = await Department.findOne({ where: { code: 'ENG' } });
        if (!dept) throw new Error("Engineering department not found.");

        // Get program
        const program = await Program.findOne({ where: { departmentId: dept.id, code: 'ENG-922' } }); // Assuming code from previous output
        if (!program) throw new Error("B.Tech program not found.");

        // Get semester 1
        const semester = await Semester.findOne({ where: { programId: program.id, semesterNumber: 1 } });
        if (!semester) throw new Error("Semester 1 not found.");

        // Get section A
        const section = await Section.findOne({ where: { semesterId: semester.id, name: 'A' } });
        if (!section) throw new Error("Section A not found in Semester 1.");

        console.log(`Found target Section A with ID: ${section.id}`);

        // Create 20 users and student profiles
        const studentProfiles = [];

        for (let i = 0; i < 20; i++) {
            const firstName = faker.person.firstName();
            const lastName = faker.person.lastName();
            const email = `student_${Date.now()}_${i}@campusone.edu`;
            const password = await bcrypt.hash('password123', 12);

            const user = await User.create({
                firstName,
                lastName,
                email,
                password,
                role: 'Student',
                isActive: true
            });

            const studentProfile = await StudentProfile.create({
                userId: user.id,
                rollNumber: `ENG25${String(i + 1).padStart(3, '0')}`,
                programId: program.id,
                batchYear: 2025
            });

            studentProfiles.push(studentProfile);
            console.log(`Created student: ${firstName} ${lastName} (${email})`);
        }

        // Allocate to Section A
        const allocations = studentProfiles.map(sp => ({
            sectionId: section.id,
            studentProfileId: sp.id
        }));

        await StudentSection.bulkCreate(allocations, { ignoreDuplicates: true });
        console.log(`Successfully allocated 20 students to Section A (ENG B.Tech Sem 1)`);

        process.exit(0);
    } catch (e) {
        console.error('Seeding failed:', e);
        process.exit(1);
    }
};

seedStudents();
