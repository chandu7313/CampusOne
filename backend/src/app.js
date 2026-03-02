import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import globalErrorHandler from './core/middlewares/error.middleware.js';
import AppError from './utils/appError.js';

import authRoutes from './modules/auth/routes/auth.routes.js';
import adminRoutes from './modules/admin/routes.js';
import academicRoutes from './modules/academics/routes.js';
import studentRoutes from './modules/students/routes.js';
import financeRoutes from './modules/finance/routes.js';
import * as models from './models/index.js';
import { sequelize } from './config/database.js';

const app = express();

// Sync Database
sequelize.sync().then(() => {
    console.log('Database synced');
}).catch(err => {
    console.error('Error syncing database:', err);
});

// Security HTTP headers
app.use(helmet());

// CORS
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true
}));

// Body parser
app.use(express.json({ limit: '10kb' }));

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/academic', academicRoutes);
app.use('/api/v1/students', studentRoutes);
app.use('/api/v1/finance-admin', financeRoutes); // Using finance-admin to distinguish from student finance

// Health check
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
