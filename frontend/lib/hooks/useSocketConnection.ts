import { useEffect, useState } from 'react';
import socketService from '../services/socketService';

export function useSocketConnection() {
    const [isConnected, setIsConnected] = useState(false);
    const [socketId, setSocketId] = useState<string | undefined>(undefined);

    useEffect(() => {
        // Connect on mount
        const socket = socketService.connect();

        // Setup listeners
        const handleConnect = () => {
            setIsConnected(true);
            setSocketId(socketService.getSocketId());
        };

        const handleDisconnect = () => {
            setIsConnected(false);
            setSocketId(undefined);
        };

        socket.on('connect', handleConnect);
        socket.on('disconnect', handleDisconnect);

        // Set initial state if already connected
        if (socket.connected) {
            handleConnect();
        }

        // Cleanup on unmount
        return () => {
            socket.off('connect', handleConnect);
            socket.off('disconnect', handleDisconnect);
            // Don't disconnect here - keep connection alive for app lifetime
        };
    }, []);

    return { isConnected, socketId };
}
