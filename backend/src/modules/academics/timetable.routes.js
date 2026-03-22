import express from 'express';
import * as timetableController from './controllers/timetable.controller.js';
import { protect } from '../../core/middlewares/auth.middleware.js';
import { authorize } from '../../core/middlewares/security.middleware.js';

const router = express.Router();

router.use(protect);
router.use(authorize('Admin'));

// Spec-aligned routes
router.get('/', timetableController.getTimetables);
router.get('/filter', timetableController.filterTimetables);
router.get('/available-sections', timetableController.getAvailableSections);
router.get('/section/:sectionId', timetableController.getSectionTimetable);
router.get('/conflicts', timetableController.checkConflicts);
// Maintenance / Data
router.get('/classrooms', timetableController.getClassrooms);
router.get('/time-slots', timetableController.getTimeSlots);

// Faculty schedule view
router.get('/faculty/:facultyId', timetableController.getFacultySlots);

router.post('/create', timetableController.createTimetable);
router.put('/update/:id', timetableController.updateTimetable);
router.delete('/delete/:id', timetableController.deleteTimetable);

// Per-slot CRUD
router.post('/:id/slots', timetableController.addSlot);
router.put('/:id/slots/:slotId', timetableController.updateSlot);
router.delete('/:id/slots/:slotId', timetableController.deleteSlot);

router.get('/:id', timetableController.getTimetableById);

export default router;

