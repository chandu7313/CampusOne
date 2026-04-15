import 'dotenv/config';
import { faker } from '@faker-js/faker';
import { sequelize, connectDB } from '../src/config/database.js';
import logger from '../src/utils/logger.js';
import * as models from '../src/models/index.js';

const {
    User,
    FacultyProfile,
    StudentProfile,
    Department,
    Program,
    Year,
    Semester,
    Classroom,
    Course,
    Section,
    TimeSlot,
    TimetableEntry,
    Exam,
    Announcement,
    Assignment,
    AssignmentSubmission,
    Message,
    PlacementRecord,
    FeeStructure,
    StudentFee,
    FeePayment
} = models;

const NUM_DEPARTMENTS = 5;
const NUM_PROGRAMS = 10;
const NUM_FACULTY = 30;
const NUM_STUDENTS = 200;
const NUM_SECTIONS = 20;

const runSeeder = async () => {
    try {
        await connectDB();

        logger.info('⚠️ WIPING DATABASE SCHEMA...');
        await sequelize.sync({ force: true });
        logger.info('✅ Database schema reset.');

        // ==========================================
        // PHASE 1: SYSTEM ADMIN & BASE DEPARTMENTS
        // ==========================================
        logger.info('Phase 1: Admin & Departments...');
        await User.create({
            firstName: 'System',
            lastName: 'Admin',
            email: 'admin@campusone.edu',
            password: 'adminpassword123',
            role: 'Admin',
            department: 'Administration',
            isActive: true
        });

        const deptNames = ['Computer Science', 'Electrical Engineering', 'Mechanical Engineering', 'Business Administration', 'Data Science'];
        const departments = [];
        for (let i = 0; i < NUM_DEPARTMENTS; i++) {
            const dept = await Department.create({
                name: deptNames[i],
                code: deptNames[i].substring(0, 3).toUpperCase(),
            });
            departments.push(dept);
        }

        const classrooms = [];
        for (let i = 1; i <= 20; i++) {
            classrooms.push(await Classroom.create({
                name: `${faker.helpers.arrayElement(['A', 'B', 'C'])}-${100 + i}`,
                building: faker.helpers.arrayElement(['Main', 'Science', 'Engineering']),
                capacity: faker.helpers.arrayElement([40, 60, 80, 120]),
                type: faker.helpers.arrayElement(['LECTURE_HALL', 'LAB', 'SEMINAR_ROOM']),
            }));
        }

        // ==========================================
        // PHASE 2: ACADEMIC HIERARCHY
        // ==========================================
        logger.info('Phase 2: Programs, Semesters & Courses...');
        const programs = [];
        const programLevels = ['UG', 'PG', 'DIPLOMA'];
        for (let i = 0; i < NUM_PROGRAMS; i++) {
            const dept = faker.helpers.arrayElement(departments);
            const level = faker.helpers.arrayElement(programLevels);
            const totalSems = level === 'UG' ? 8 : (level === 'PG' ? 4 : 2);
            programs.push(await Program.create({
                departmentId: dept.id,
                name: `${level} in ${dept.name} ${i}`,
                code: `${level}-${dept.code}-${i}`,
                durationYears: totalSems / 2,
                totalSemesters: totalSems,
                isActive: true
            }));
        }

        const semesters = [];
        for (const prog of programs) {
            for (let y = 1; y <= prog.durationYears; y++) {
                const year = await Year.create({
                    programId: prog.id,
                    name: `Year ${y}`,
                    yearNumber: y
                });
                for (let s = 1; s <= 2; s++) {
                    const semNumber = (y - 1) * 2 + s;
                    semesters.push(await Semester.create({
                        programId: prog.id,
                        yearId: year.id,
                        semesterNumber: semNumber,
                        academicYear: '2024-25',
                        status: semNumber === 1 ? 'ACTIVE' : 'UPCOMING'
                    }));
                }
            }
        }

        const courses = [];
        for (let i = 0; i < 50; i++) {
            const prog = faker.helpers.arrayElement(programs);
            const course = await Course.create({
                programId: prog.id,
                code: `${prog.code}-CS${100 + i}`,
                name: faker.hacker.ingverb() + ' ' + faker.hacker.noun(),
                credits: faker.helpers.arrayElement([2, 3, 4]),
                semester: faker.number.int({ min: 1, max: prog.totalSemesters }),
                isActive: true
            });
            courses.push(course);

            // Create 2 assignments per course
            for (let j = 1; j <= 2; j++) {
                await Assignment.create({
                    subjectId: course.id,
                    title: `${faker.hacker.ingverb()} ${faker.hacker.noun()} ${j}`,
                    description: faker.lorem.paragraph(),
                    dueDate: faker.date.future(),
                    type: faker.helpers.arrayElement(['HOMEWORK', 'PROJECT', 'QUIZ']),
                    totalMarks: 100
                });
            }
        }

        // ==========================================
        // PHASE 3: SECTIONS & FACULTY
        // ==========================================
        logger.info('Phase 3: Faculty & Sections...');
        const sections = [];
        for (let i = 0; i < NUM_SECTIONS; i++) {
            const sem = faker.helpers.arrayElement(semesters);
            sections.push(await Section.create({
                semesterId: sem.id,
                name: String.fromCharCode(65 + (i % 3)), // A, B, C
                capacity: faker.number.int({ min: 30, max: 60 })
            }));
        }

        const facultyList = [];
        for (let i = 0; i < NUM_FACULTY; i++) {
            const dept = faker.helpers.arrayElement(departments);
            const fName = faker.person.firstName();
            const lName = faker.person.lastName();
            const regNum = `FAC-2025-${String(i + 1).padStart(4, '0')}`;
            const user = await User.create({
                firstName: fName,
                lastName: lName,
                email: faker.internet.email({ firstName: fName, lastName: lName, provider: 'campusone.edu' }),
                password: 'password123',
                role: 'Faculty',
                department: dept.name,
                registrationNumber: regNum,
                isActive: true
            });

            const profile = await FacultyProfile.create({
                userId: user.id,
                employeeId: regNum,
                departmentId: dept.id,
                designation: faker.helpers.arrayElement(['Professor', 'Assistant Professor', 'Lecturer']),
                specialization: [faker.hacker.noun()],
                qualification: faker.helpers.arrayElement(['Ph.D', 'M.Tech', 'M.Sc']),
                joiningDate: faker.date.past({ years: 5 })
            });
            facultyList.push(profile);
        }

        // ==========================================
        // PHASE 4: STUDENTS
        // ==========================================
        logger.info('Phase 4: Students...');
        for (let i = 0; i < NUM_STUDENTS; i++) {
            const prog = faker.helpers.arrayElement(programs);
            const fName = faker.person.firstName();
            const lName = faker.person.lastName();
            const regNum = `STU-2025-${String(i + 1).padStart(5, '0')}`;

            const user = await User.create({
                firstName: fName,
                lastName: lName,
                email: faker.internet.email({ firstName: fName, lastName: lName, provider: 'campusone.edu' }),
                password: 'password123',
                role: 'Student',
                department: departments.find(d => d.id === prog.departmentId)?.name || 'General',
                registrationNumber: regNum,
                isActive: true,
                gender: faker.helpers.arrayElement(['Male', 'Female']),
                dob: faker.date.birthdate({ min: 18, max: 24, mode: 'age' }),
                mobile: faker.phone.number()
            });

            await StudentProfile.create({
                userId: user.id,
                registrationNumber: regNum,
                rollNumber: `ROLL-2025-${String(i + 1).padStart(5, '0')}`,
                programId: prog.id,
                batchYear: 2025,
                currentSemester: 1,
                status: 'Active'
            });

            // Create some messages for the student
            for (let j = 0; j < 3; j++) {
                await Message.create({
                    senderId: (await User.findOne({ where: { role: 'Faculty' } })).id,
                    receiverId: user.id,
                    subject: faker.hacker.phrase(),
                    body: faker.lorem.sentences(2),
                    type: faker.helpers.arrayElement(['FACULTY', 'MENTOR', 'SYSTEM'])
                });
            }

            // Create placement records for some students
            if (i % 10 === 0) {
                await PlacementRecord.create({
                    studentId: user.id,
                    companyName: faker.company.name(),
                    package: `${faker.number.int({ min: 8, max: 25 })} LPA`,
                    designation: faker.person.jobTitle(),
                    placementYear: 2024
                });
            }
        }

        // ==========================================
        // PHASE 5: TIMESLOTS & TIMETABLE
        // ==========================================
        logger.info('Phase 5: TimeSlots & Timetable...');
        const timeSlots = [];
        const days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'];
        const startHours = [9, 10, 11, 13, 14, 15];

        for (const day of days) {
            for (const h of startHours) {
                timeSlots.push(await TimeSlot.create({
                    dayOfWeek: day,
                    startTime: `${String(h).padStart(2, '0')}:00:00`,
                    endTime: `${String(h + 1).padStart(2, '0')}:00:00`,
                }));
            }
        }

        for (const sec of sections) {
            // Find courses for the program associated with this section's semester
            const sem = semesters.find(s => s.id === sec.semesterId);
            const progCourses = courses.filter(c => c.programId === sem.programId && c.semester === sem.semesterNumber);

            if (progCourses.length > 0) {
                const selectedCourses = faker.helpers.arrayElements(progCourses, Math.min(progCourses.length, 4));
                for (const course of selectedCourses) {
                    const faculty = faker.helpers.arrayElement(facultyList);
                    const slot = faker.helpers.arrayElement(timeSlots);
                    const classroom = faker.helpers.arrayElement(classrooms);

                    await TimetableEntry.create({
                        timeSlotId: slot.id,
                        classroomId: classroom.id,
                        sectionId: sec.id,
                        subjectId: course.id,
                        facultyId: faculty.userId, // Controller expects userId usually, but model says facultyId (UUID). Let's use userId since FacultyProfile.id is it.
                        academicYear: '2024-25'
                    });
                }
            }
        }

        // ==========================================
        // PHASE 6: EXAMS & ANNOUNCEMENTS
        // ==========================================
        logger.info('Phase 6: Exams & Announcements...');
        for (let i = 0; i < 10; i++) {
            await Exam.create({
                name: `${faker.helpers.arrayElement(['Mid-Term', 'Final', 'Re-Exam'])} - ${faker.hacker.adjective()}`,
                type: faker.helpers.arrayElement(['MIDTERM', 'FINAL']),
                academicYear: '2024-25',
                startDate: faker.date.soon({ days: 10 }),
                endDate: faker.date.future(),
                status: 'PUBLISHED'
            });
        }

        for (let i = 0; i < 10; i++) {
            await Announcement.create({
                title: faker.company.catchPhrase(),
                content: faker.lorem.paragraphs(2),
                priority: faker.helpers.arrayElement(['Low', 'Medium', 'High', 'Urgent']),
                authorId: (await User.findOne({ where: { role: 'Admin' } })).id,
                isPublished: true
            });
        }

        // ==========================================
        // PHASE 7: FINANCE MODULE
        // ==========================================
        logger.info('Phase 7: Finance (Fees & Payments)...');
        const feeStructures = [];
        for (const prog of programs) {
            feeStructures.push(await FeeStructure.create({
                programId: prog.id,
                academicYear: '2024-25',
                semester: 1,
                tuitionFee: faker.number.int({ min: 50000, max: 150000 }),
                libraryFee: faker.number.int({ min: 2000, max: 5000 }),
                labFee: faker.number.int({ min: 5000, max: 15000 }),
                examinationFee: faker.number.int({ min: 1000, max: 3000 }),
                sportsFee: faker.number.int({ min: 1000, max: 2000 }),
                hostelFee: faker.number.int({ min: 20000, max: 60000 }),
                transportFee: faker.number.int({ min: 10000, max: 30000 }),
                developmentFee: faker.number.int({ min: 5000, max: 12000 }),
                medicalFee: faker.number.int({ min: 500, max: 1500 }),
                miscellaneous: 1000,
                dueDate: 15,
                lateFeePerDay: 50,
                lateFeeStartDate: 5
            }));
        }

        const students = await StudentProfile.findAll({ limit: 50 });
        for (const student of students) {
            const structure = feeStructures.find(fs => fs.programId === student.programId);
            if (structure) {
                const total = Number(structure.tuitionFee) + Number(structure.libraryFee) + Number(structure.labFee) + 
                              Number(structure.examinationFee) + Number(structure.sportsFee) + Number(structure.hostelFee) + 
                              Number(structure.transportFee) + Number(structure.developmentFee) + Number(structure.medicalFee) + Number(structure.miscellaneous);
                
                const status = faker.helpers.arrayElement(['Paid', 'Pending', 'Partial', 'Overdue']);
                let paidAmount = 0;
                
                if (status === 'Paid') paidAmount = total;
                else if (status === 'Partial') paidAmount = faker.number.int({ min: total * 0.3, max: total * 0.8 });

                const fee = await StudentFee.create({
                    studentProfileId: student.id,
                    feeStructureId: structure.id,
                    totalAmount: total,
                    paidAmount,
                    status,
                    dueDate: faker.date.future(),
                    tuitionFee: structure.tuitionFee,
                    libraryFee: structure.libraryFee,
                    labFee: structure.labFee,
                    examinationFee: structure.examinationFee,
                    sportsFee: structure.sportsFee,
                    hostelFee: structure.hostelFee,
                    transportFee: structure.transportFee,
                    developmentFee: structure.developmentFee,
                    medicalFee: structure.medicalFee,
                    miscellaneous: structure.miscellaneous,
                });

                if (paidAmount > 0) {
                    await FeePayment.create({
                        studentFeeId: fee.id,
                        studentProfileId: student.id,
                        amountPaid: paidAmount,
                        paymentMethod: faker.helpers.arrayElement(['Online', 'Cash', 'UPI']),
                        transactionId: `TXN-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
                        receiptNumber: `RCP-202501-${Math.floor(Math.random() * 10000)}`,
                        paymentDate: faker.date.recent(),
                        status: 'Success'
                    });
                }
            }
        }

        logger.info('✅ SEEDING COMPLETE!');
        process.exit(0);

    } catch (error) {
        logger.error('❌ SEEDING FAILED:', error);
        process.exit(1);
    }
};

runSeeder();
