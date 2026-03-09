import express from 'express';
import * as placementController from './controllers/placement.controller.js';
import { protect } from '../../core/middlewares/auth.middleware.js';
import { authorize } from '../../core/middlewares/security.middleware.js';

const router = express.Router();

// Shared Routes
router.use(protect);
router.get('/opportunities', placementController.getOpportunities);

// Student Routes
router.post('/apply', authorize('Student'), placementController.applyToOpportunity);
router.get('/my-applications', authorize('Student'), placementController.getMyApplications);

// Faculty/Admin Routes
router.post('/opportunities', authorize('Admin', 'Faculty'), placementController.createOpportunity);
router.get('/opportunities/:id/applications', authorize('Admin', 'Faculty'), placementController.getOpportunityApplications);
router.patch('/applications/:id/status', authorize('Admin', 'Faculty'), placementController.updateApplicationStatus);

// Generic Dashboard Route
router.get('/recent', placementController.getRecentPlacements);

export default router;
