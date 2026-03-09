import 'dotenv/config';
import { StudentProfile, Course, Enrollment } from '../models/index.js';
import { sequelize, connectDB } from '../config/database.js';
import logger from '../utils/logger.js';

const seedEnrollments = async () => {
    try {
        await connectDB();

        const students = await StudentProfile.findAll();
        const courses = await Course.findAll();

        console.log(`Found ${students.length} students and ${courses.length} courses.`);

        if (students.length === 0 || courses.length === 0) {
            console.log('No students or courses found. Seed cancelled.');
            process.exit(0);
        }

        let enrollmentCount = 0;
        const academicYear = "2025-2026";

        for (const student of students) {
            // Find courses for student's program
            let studentCourses = courses.filter(c => c.programId === student.programId);

            // Filter by semester if possible
            const semesterMatches = studentCourses.filter(c => c.semester === student.currentSemester);

            if (semesterMatches.length > 0) {
                studentCourses = semesterMatches;
            } else if (studentCourses.length > 0) {
                console.log(`Fallback: Student ${student.id} (Program: ${student.programId}) has no courses for Semester ${student.currentSemester}. Enrolling in all ${studentCourses.length} available program courses.`);
            }

            for (const course of studentCourses) {
                // Check if already enrolled to avoid duplicates
                const existingEnrollment = await Enrollment.findOne({
                    where: {
                        studentProfileId: student.id,
                        courseId: course.id
                    }
                });

                if (!existingEnrollment) {
                    await Enrollment.create({
                        studentProfileId: student.id,
                        courseId: course.id,
                        academicYear,
                        semester: course.semester, // Use course's semester if it's different
                        status: 'Enrolled'
                    });
                    enrollmentCount++;
                }
            }
        }

        console.log(`Successfully seeded ${enrollmentCount} enrollments.`);
        process.exit(0);
    } catch (error) {
        console.error('Error seeding enrollments:', error);
        process.exit(1);
    }
};

seedEnrollments();
