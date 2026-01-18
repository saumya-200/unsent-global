import { io } from 'socket.io-client';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Initialize Socket.io connection
// Using 'websocket' transport strictly to avoid CORS/polling issues initially
export const socket = io(API_URL, {
    transports: ['websocket', 'polling'], // Try websocket first
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
});
