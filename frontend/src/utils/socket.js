import { io } from 'socket.io-client';
import { API_BASE_URL } from '../config/api';

// Create a socket instance
let socket = null;

/**
 * Initialize socket connection
 * @param {string} token - User authentication token
 * @returns {Object} Socket instance
 */
export const initSocket = (token) => {
    if (socket) {
        socket.disconnect();
    }

    // Create new socket connection with auth token
    socket = io(API_BASE_URL, {
        auth: {
            token
        },
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000
    });

    // Connection event handlers
    socket.on('connect', () => {
        console.log('Socket connected:', socket.id);
    });

    socket.on('connect_error', (err) => {
        console.error('Socket connection error:', err.message);
    });

    socket.on('disconnect', (reason) => {
        console.log('Socket disconnected:', reason);
    });

    return socket;
};

/**
 * Get the current socket instance
 * @returns {Object|null} Socket instance or null if not initialized
 */
export const getSocket = () => socket;

/**
 * Disconnect socket
 */
export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
};

export default {
    initSocket,
    getSocket,
    disconnectSocket
}; 