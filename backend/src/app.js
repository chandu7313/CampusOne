import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import globalErrorHandler from './core/middlewares/error.middleware.js';
import AppError from './utils/appError.js';
import logger from './utils/logger.js';

import authRoutes from './modules/auth/routes/auth.routes.js';
import adminRoutes from './modules/admin/routes.js';
import academicRoutes from './modules/academics/routes.js';
import studentRoutes from './modules/students/routes.js';
import examRoutes from './modules/exams/routes.js';
import financeRoutes from './modules/finance/routes.js';
import assignmentRoutes from './modules/assignments/routes.js';
import communicationRoutes from './modules/communication/routes.js';
import placementRoutes from './modules/placements/routes.js';
import dashboardRoutes from './modules/dashboard/routes.js';
import * as models from './models/index.js';
import { sequelize } from './config/database.js';

const app = express();

// Sync Database (alter: true ensures schema matches models in dev)
sequelize.sync({ alter: true }).then(() => {
    logger.info('Database synced with schema changes');
}).catch(err => {
    logger.error('Error syncing database:', err);
});

// Security HTTP headers
app.use(helmet());

// CORS
app.use(cors({
    origin: [process.env.CLIENT_URL, 'http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175'].filter(Boolean),
    credentials: true
}));

// Body parser
app.use(express.json({ limit: '10kb' }));

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/academic', academicRoutes);
app.use('/api/v1/students', studentRoutes);
app.use('/api/v1/exams', examRoutes);
app.use('/api/v1/finance-admin', financeRoutes); // Using finance-admin to distinguish from student finance
app.use('/api/v1/assignments', assignmentRoutes);
app.use('/api/v1/communication', communicationRoutes);
app.use('/api/v1/placements', placementRoutes);
app.use('/api/v1/dashboard', dashboardRoutes);

// Health check
app.get('/', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'Welcome to CampusOne API',
        version: '1.0.0'
    });
});

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

// Handle undefined routes
app.use((req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global error handler
app.use(globalErrorHandler);

export default app;
