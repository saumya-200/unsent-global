import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import socketService from '../../lib/services/socketService';
import { KnotSession as KnotSessionType, KnotSessionState } from '../../lib/types/knot.types';
import { KnotWaiting } from './KnotWaiting';
import { KnotActive } from './KnotActive';
import { KnotEnded } from './KnotEnded';
import { ParticleBackground } from './effects/ParticleBackground';

interface KnotSessionProps {
    starId: string;
    roomId: string; // New required prop
    onExit: () => void;
}

export const KnotSession: React.FC<KnotSessionProps> = ({ starId, roomId, onExit }) => {
    // Initialize directly into active state since we only mount this after handshake
    const [sessionData, setSessionData] = useState<KnotSessionType | null>({
        roomId: roomId,
        starId: starId,
        state: 'active',
        partnerCount: 2,
        remainingSeconds: 1800,
        startedAt: Date.now() / 1000
    });
    const [error, setError] = useState<string | null>(null);
    const [connectionState, setConnectionState] = useState<'connected' | 'connecting' | 'disconnected'>('connected');

    useEffect(() => {
        const socket = socketService.connect();

        // Connection listeners
        const onConnect = () => setConnectionState('connected');
        const onDisconnect = () => setConnectionState('disconnected');
        const onReconnectAttempt = () => setConnectionState('connecting');

        // Socket.io standard events
        socket.on('connect', onConnect);
        socket.on('disconnect', onDisconnect);
        // @ts-ignore
        socket.io.on('reconnect_attempt', onReconnectAttempt);

        // REMOVED: requestKnot(starId) - we are already in the session.

        // Session event listeners

        const handleTimerUpdate = (data: { remaining_seconds: number }) => {
            setSessionData(prev => prev ? ({
                ...prev,
                remainingSeconds: data.remaining_seconds
            }) : null);
        };

        const handleSessionEnded = (data: { reason: string; message: string }) => {
            setSessionData(prev => prev ? ({
                ...prev,
                state: 'ended',
                endReason: data.reason as any
            }) : null);
        };

        const handleError = (data: { message: string }) => {
            setError(data.message);
        };

        // Use typed service listeners
        // socketService.onWaitingForPartner... (Removed)
        // socketService.onKnotStarted... (We rely on initial state now, but keep for updates if needed?)
        socketService.onTimerUpdate(handleTimerUpdate as any);
        socketService.onSessionEnded(handleSessionEnded as any);
        socketService.onError(handleError);

        return () => {
            // Clean up listeners
            // Note: socketService.off logic is a bit generic in my implementation, 
            // but here we can just disconnect or rely on component unmount
            // Ideally use socketService.off for each

            // Since we don't have stored references for every callback wrapper in socketService (it wraps them), 
            // we rely on disconnect/leave to clean up server side, and client side listeners attached to the single socket instance.
            // Best practice: socket.off(...) but socketService hides direct socket access mostly.
            // We will assume socketService.disconnect() cleans up all listeners if implemented well, 
            // or we manually remove them if we could.

            // Simplest: just leave knot.
            // We can't access `sessionData.roomId` reliably in cleanup if it changed. 
            // But we can try if we have a ref, or just let server handle disconnect.

            socket.off('connect', onConnect);
            socket.off('disconnect', onDisconnect);
            // @ts-ignore
            socket.io.off('reconnect_attempt', onReconnectAttempt);
        };
    }, [starId]);

    // Cleanup session state when exiting
    const handleExit = () => {
        if (sessionData?.roomId) {
            socketService.leaveKnot(sessionData.roomId);
        }
        onExit();
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#0a0a1a] text-white flex flex-col overflow-hidden"
        >
            <ParticleBackground />

            {/* Connection Indicator */}
            {connectionState !== 'connected' && (
                <div className="absolute top-16 right-4 z-[60] px-4 py-2 rounded-full bg-yellow-500/20 backdrop-blur-md text-yellow-200 text-sm flex items-center gap-2 border border-yellow-500/30">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
                    {connectionState === 'connecting' ? 'Connecting...' : 'Reconnecting...'}
                </div>
            )}

            {error ? (
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center z-10">
                    <h2 className="text-2xl text-red-400 mb-4">Connection Failed</h2>
                    <p className="text-gray-400 mb-8">{error}</p>
                    <button
                        onClick={onExit}
                        className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                    >
                        Return to Star Map
                    </button>
                </div>
            ) : !sessionData ? (
                <div className="flex-1 flex items-center justify-center z-10">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
                </div>
            ) : (
                <div className="flex-1 relative z-10 h-full">
                    {sessionData.state === 'waiting' && (
                        <KnotWaiting onCancel={handleExit} />
                    )}

                    {sessionData.state === 'active' && (
                        <KnotActive
                            session={sessionData}
                            onLeave={handleExit}
                        />
                    )}

                    {sessionData.state === 'ended' && (
                        <KnotEnded
                            reason={sessionData.endReason}
                            onClose={handleExit}
                        />
                    )}
                </div>
            )}
        </motion.div>
    );
};
