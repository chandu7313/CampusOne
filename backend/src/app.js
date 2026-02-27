import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import globalErrorHandler from './core/middlewares/error.middleware.js';
import AppError from './utils/appError.js';

const app = express();

// Security HTTP headers
app.use(helmet());

// CORS
app.use(cors());

// Body parser
app.use(express.json({ limit: '10kb' }));

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
