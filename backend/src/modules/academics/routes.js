import express from 'express';
import * as academicController from './controllers/academic.controller.js';
import * as timetableController from './controllers/timetable.controller.js';
import * as facultyController from './controllers/faculty.controller.js';
import { protect } from '../../core/middlewares/auth.middleware.js';
import { authorize } from '../../core/middlewares/security.middleware.js';

const router = express.Router();

// All academic management requires Authentication and Admin role
router.use(protect);
router.use(authorize('Admin'));

// Academic Hierarchy
router.get('/hierarchy', academicController.getAcademicHierarchy);
router.post('/departments', academicController.createDepartment);
router.post('/programs', academicController.createProgram);
router.get('/courses', academicController.getCourses);
router.get('/courses/student', academicController.getStudentCourses);
router.post('/courses', academicController.createCourse);

// Academic Structure
router.post('/semesters/assign-subjects', academicController.assignSubjectsToSemester);
router.post('/sections', academicController.createSection);
router.post('/sections/allocate', academicController.allocateStudentsToSection);

// Timetable Routes
router.get('/classrooms', timetableController.getClassrooms);
router.post('/timetable/classrooms', timetableController.createClassroom);
router.get('/time-slots', timetableController.getTimeSlots);
router.post('/timetable/slots/batch', timetableController.createTimeSlotsBatch);
router.post('/timetable/entries', timetableController.createTimetableEntry);
router.post('/timetable', timetableController.createTimetableEntry);  // alias used by frontend hook
router.get('/timetable/sections/:sectionId', timetableController.getSectionTimetable);
router.get('/timetable/section/:sectionId', timetableController.getSectionTimetable);  // alias

// Faculty Routes
router.get('/faculty', facultyController.getFaculty);
router.post('/faculty/assign-competency', facultyController.assignCompetency);
router.post('/faculty/allocate-section', facultyController.allocateSectionSubject);
router.get('/faculty/workload/:id', facultyController.getFacultyWorkload);

export default router;
