import { useEffect } from 'react';
import { socket } from '../socket';
import { Star } from '../types';

interface UseSocketEventsProps {
    onConnect?: () => void;
    onDisconnect?: () => void;
    onNewStar?: (star: Star) => void;
    onResonanceUpdate?: (data: { star_id: string; resonance_count: number }) => void;
}

export const useSocketEvents = ({
    onConnect,
    onDisconnect,
    onNewStar,
    onResonanceUpdate
}: UseSocketEventsProps) => {
    useEffect(() => {
        // console.log("Initializing Socket Hooks");

        const handleConnect = () => {
            // console.log("Socket connected:", socket.id);
            if (onConnect) onConnect();
        };

        const handleDisconnect = () => {
            // console.log("Socket disconnected");
            if (onDisconnect) onDisconnect();
        };

        const handleNewStar = (star: Star) => {
            // console.log("Socket: New Star Received:", star);
            if (onNewStar) onNewStar(star);
        };

        const handleResonance = (data: { star_id: string; resonance_count: number }) => {
            // console.log("Socket: Resonance Update:", data);
            if (onResonanceUpdate) onResonanceUpdate(data);
        };

        socket.on('connect', handleConnect);
        socket.on('disconnect', handleDisconnect);
        socket.on('new_star', handleNewStar);
        socket.on('resonance_update', handleResonance);

        return () => {
            socket.off('connect', handleConnect);
            socket.off('disconnect', handleDisconnect);
            socket.off('new_star', handleNewStar);
            socket.off('resonance_update', handleResonance);
        };
    }, [onConnect, onDisconnect, onNewStar, onResonanceUpdate]);
};
