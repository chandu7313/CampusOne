import express from 'express';
import * as placementController from './controllers/placement.controller.js';
import { protect } from '../../core/middlewares/auth.middleware.js';

const router = express.Router();

router.get('/', protect, placementController.getRecentPlacements);

export default router;
