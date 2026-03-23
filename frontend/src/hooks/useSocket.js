import { useEffect } from 'react';
import { io } from 'socket.io-client';
import { useAuthStore } from '../store/authStore';
import { useToast } from './useToast';

let socket;

export const useSocket = () => {
    const { user, addNotification } = useAuthStore();
    const { toastInfo } = useToast();

    useEffect(() => {
        if (!user?.id) return;

        // Connect to Socket.io server
        socket = io(import.meta.env.VITE_API_URL || 'http://localhost:4000', {
            query: { userId: user.id },
            withCredentials: true,
        });

        // Listen for real-time notifications
        socket.on('notification', (data) => {
            // Add to global state
            if (addNotification) {
                addNotification(data);
            }
            // Show toast message
            toastInfo(data.title || 'New Notification', data.message);
        });

        socket.on('connect_error', (err) => {
            console.error('Socket connection error:', err.message);
        });

        return () => {
            if (socket) {
                socket.disconnect();
            }
        };
    }, [user?.id, addNotification, toastInfo]);

    return socket;
};
