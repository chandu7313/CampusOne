import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import { faker } from '@faker-js/faker';
import bcrypt from 'bcryptjs';
import { sequelize } from '../src/config/database.js';
import {
    User, Department, Program, Semester, Course,
    Section, StudentProfile, StudentSection, Attendance, SemesterSubject
} from '../src/models/index.js';

const seedData = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected for seeding...');

        // Sync models to DB (add newly declared columns like sectionId)
        await sequelize.sync({ alter: true });
        console.log('Database synchronized.');

        // Create Departments
        const departments = [];
        for (let i = 0; i < 3; i++) {
            const num = faker.number.int({ min: 10000, max: 99999 });
            departments.push(await Department.create({
                name: faker.commerce.department() + ' Engineering ' + num,
                code: 'DEPT' + num,
                description: faker.lorem.sentence()
            }));
        }
        console.log(`Created ${departments.length} departments.`);

        // Create Programs
        const programs = [];
        for (let i = 0; i < 5; i++) {
            const dept = faker.helpers.arrayElement(departments);
            const num = faker.number.int({ min: 10000, max: 99999 });
            programs.push(await Program.create({
                name: faker.commerce.productName() + ' Degree ' + num,
                code: 'PROG' + num,
                departmentId: dept.id,
                level: faker.helpers.arrayElement(['UG', 'PG']),
                durationYears: faker.helpers.arrayElement([2, 3, 4]),
                totalSemesters: 8
            }));
        }
        console.log(`Created ${programs.length} programs.`);

        // Select one program for full data population to make it simpler to demo
        const demoProgram = programs[0];

        // Create Semesters for demo program
        const semesters = [];
        for (let i = 1; i <= 2; i++) {
            semesters.push(await Semester.create({
                programId: demoProgram.id,
                semesterNumber: i,
                academicYear: '2025-26',
                status: i === 1 ? 'ACTIVE' : 'UPCOMING'
            }));
        }
        console.log(`Created ${semesters.length} semesters.`);

        const demoSemester = semesters[0];

        // Create Courses
        const courses = [];
        for (let i = 0; i < 4; i++) {
            const num = faker.number.int({ min: 10000, max: 99999 });
            const course = await Course.create({
                name: faker.company.buzzNoun() + ' Fundamentals ' + num,
                code: 'CS' + num,
                description: faker.lorem.sentence(),
                credits: 3,
                programId: demoProgram.id,
                semester: demoSemester.semesterNumber
            });
            courses.push(course);
            await SemesterSubject.create({ semesterId: demoSemester.id, subjectId: course.id });
        }
        console.log(`Created ${courses.length} courses.`);

        // Create Sections
        const sections = [];
        for (let sectionName of ['A', 'B', 'C']) {
            sections.push(await Section.create({
                name: sectionName,
                semesterId: demoSemester.id,
                capacity: 60
            }));
        }
        console.log(`Created ${sections.length} sections.`);

        // Create Students and assign to sections (15-40 per section to meet req)
        const passwordHash = await bcrypt.hash('password123', 10);
        let studentProfilesList = [];

        // Faculty user to mark attendance
        const facultyUser = await User.create({
            email: 'faculty' + faker.string.alphanumeric(8) + Date.now() + '@demo.com',
            password: passwordHash,
            firstName: 'Demo',
            lastName: 'Faculty',
            role: 'Faculty',
            status: 'Active'
        });

        for (const section of sections) {
            const studentCount = faker.number.int({ min: 15, max: 40 });

            for (let i = 0; i < studentCount; i++) {
                const user = await User.create({
                    email: 'student' + faker.string.alphanumeric(8) + Date.now() + i + '@demo.com',
                    password: passwordHash,
                    firstName: faker.person.firstName(),
                    lastName: faker.person.lastName(),
                    role: 'Student',
                    status: 'Active'
                });

                const profile = await StudentProfile.create({
                    userId: user.id,
                    programId: demoProgram.id,
                    enrollmentNumber: 'ENR' + faker.string.alphanumeric({ length: 8, casing: 'upper' }),
                    currentSemester: demoSemester.semesterNumber,
                    batchYear: 2025
                });

                studentProfilesList.push({ user, profile });

                await StudentSection.create({
                    studentProfileId: profile.id,
                    sectionId: section.id
                });

                // Generate random attendance records for 10 days for each course
                for (const course of courses) {
                    for (let day = 1; day <= 10; day++) {
                        const recDate = new Date();
                        recDate.setDate(recDate.getDate() - day);
                        await Attendance.create({
                            studentId: user.id,
                            subjectId: course.id,
                            sectionId: section.id,
                            facultyId: facultyUser.id,
                            date: recDate,
                            status: faker.helpers.arrayElement(['Present', 'Present', 'Present', 'Absent', 'Late'])
                        });
                    }
                }
            }
            console.log(`Assigned ${studentCount} students to Section ${section.name}`);
        }

        console.log('Seeding completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Seeding error:', error);
        process.exit(1);
    }
};

seedData();
