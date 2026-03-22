import express from 'express';
import * as academicController from './controllers/academic.controller.js';
import * as timetableController from './controllers/timetable.controller.js';
import * as facultyController from './controllers/faculty.controller.js';
import * as attendanceController from './controllers/attendance.controller.js';
import * as authoritiesController from './controllers/authorities.controller.js';
import { protect } from '../../core/middlewares/auth.middleware.js';
import { authorize } from '../../core/middlewares/security.middleware.js';

const router = express.Router();

// All academic routes require authentication
router.use(protect);

// ─── Student/Faculty accessible routes ───
router.get('/courses/student', academicController.getStudentCourses);
router.get('/timetable/me', timetableController.getMyTimetable);
router.get('/attendance/me', attendanceController.getMyAttendance);
router.post('/attendance/mark', authorize('Faculty', 'Admin'), attendanceController.markAttendance);
router.get('/attendance/class', authorize('Faculty', 'Admin'), attendanceController.getClassAttendance);
router.get('/sections', academicController.getSections);
router.get('/sections/:id/students', academicController.getSectionStudents);
router.get('/attendance/student/:studentId', authorize('Student', 'Faculty', 'Admin'), attendanceController.getStudentAttendance);
router.get('/attendance/section/:sectionId', authorize('Faculty', 'Admin'), attendanceController.getSectionAttendance);

// ─── Admin-only routes ───
router.use(authorize('Admin'));

// Hierarchy & Courses
router.get('/hierarchy', academicController.getAcademicHierarchy);
router.get('/courses', academicController.getCourses);
router.post('/courses', academicController.createCourse);

// Departments
router.post('/departments', academicController.createDepartment);
router.put('/departments/:id', academicController.updateDepartment);
router.delete('/departments/:id', academicController.deleteDepartment);

// Programs
router.post('/programs', academicController.createProgram);
router.delete('/programs/:id', academicController.deleteProgram);
router.post('/programs/:id/initialize', academicController.initializeProgram);

// Years & Semesters (cascade delete)
router.delete('/years/:id', academicController.deleteYear);
router.delete('/semesters/:id', academicController.deleteSemester);

// Semesters & Subjects
router.post('/semesters/assign-subjects', academicController.assignSubjectsToSemester);

// Sections
router.post('/sections', academicController.createSection);
router.put('/sections/:id', academicController.updateSection);
router.delete('/sections/:id', academicController.deleteSection);
router.post('/sections/allocate', academicController.allocateStudentsToSection);

// Faculty
router.get('/faculty', facultyController.getFaculty);
router.post('/faculty/assign-competency', facultyController.assignCompetency);
router.post('/faculty/allocate-section', facultyController.allocateSectionSubject);
router.get('/faculty/workload/:id', facultyController.getFacultyWorkload);

export default router;
