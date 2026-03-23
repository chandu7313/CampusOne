import { Server } from 'socket.io';
import redis from './redis.js';

/**
 * Initialize Socket.io on the given HTTP server.
 * Uses a dedicated Redis subscriber connection for Pub/Sub.
 *
 * @param {import('http').Server} httpServer
 * @returns {import('socket.io').Server}
 */
export const initSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: [
        process.env.CLIENT_URL,
        'http://localhost:5173',
        'http://localhost:5174',
        'http://localhost:5175',
      ].filter(Boolean),
      credentials: true,
    },
  });

  // Separate Redis connection for subscribe (ioredis requirement)
  const subscriber = redis.duplicate();
  subscriber.subscribe('notifications', (err) => {
    if (err) console.error('❌ Redis subscribe error:', err.message);
  });

  subscriber.on('message', (channel, message) => {
    try {
      const { userId, data } = JSON.parse(message);
      io.to(`user:${userId}`).emit('notification', data);
    } catch (err) {
      console.error('Socket notification dispatch error:', err.message);
    }
  });

  io.on('connection', (socket) => {
    const userId = socket.handshake.query.userId;
    if (userId) {
      socket.join(`user:${userId}`);
      console.log(`👤 User ${userId} connected to socket`);
    }

    socket.on('disconnect', () => {
      console.log(`👤 User ${userId} disconnected`);
    });
  });

  return io;
};
