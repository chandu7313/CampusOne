import 'dotenv/config';
import http from 'http';
import app from './src/app.js';
import { connectDB } from './src/config/database.js';
import logger from './src/utils/logger.js';
import { initSocket } from './src/config/socket.js';

const port = process.env.PORT || 5000;

const startServer = async () => {
    await connectDB();

    const httpServer = http.createServer(app);
    initSocket(httpServer);

    httpServer.listen(port, () => {
        logger.info(`Server running on port ${port} in ${process.env.NODE_ENV} mode`);
    });

    process.on('unhandledRejection', (err) => {
        logger.error('UNHANDLED REJECTION!  Shutting down...');
        logger.error(err.name, err.message);
        httpServer.close(() => {
            process.exit(1);
        });
    });
};

startServer();
