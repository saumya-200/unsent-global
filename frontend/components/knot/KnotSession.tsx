import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import socketService from '../../lib/services/socketService';
import { KnotState, KnotSession as KnotSessionType } from '../../lib/types/knot.types';
import { KnotWaiting } from './KnotWaiting';
import { KnotActive } from './KnotActive';
import { KnotEnded } from './KnotEnded';
import { ParticleBackground } from './effects/ParticleBackground';

interface KnotSessionProps {
    starId: string;
    onExit: () => void;
}

export const KnotSession: React.FC<KnotSessionProps> = ({ starId, onExit }) => {
    const [sessionData, setSessionData] = useState<KnotSessionType | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [connectionState, setConnectionState] = useState<'connected' | 'connecting' | 'disconnected'>('connecting');

    useEffect(() => {
        const socket = socketService.connect();

        // Connection listeners
        const onConnect = () => setConnectionState('connected');
        const onDisconnect = () => setConnectionState('disconnected');
        const onReconnectAttempt = () => setConnectionState('connecting');

        socket.on('connect', onConnect);
        socket.on('disconnect', onDisconnect);
        socket.io.on('reconnect_attempt', onReconnectAttempt); // Access io manager for reconnect attempts

        // Request to enter knot
        socketService.enterKnot(starId);

        // Session event listeners
        const handleKnotUpdate = (data: any) => {
            console.log('Knot update:', data);
            setSessionData(prev => ({
                roomId: data.room_id,
                partnerId: data.partner_id || (prev?.partnerId),
                startTime: data.start_time, // This might be null if waiting
                state: data.status === 'active' ? 'active' : 'waiting',
                remainingSeconds: data.remaining_time || 1800,
            }));
        };

        const handleKnotStarted = (data: any) => {
            console.log('Knot started:', data);
            setSessionData({
                roomId: data.room_id,
                partnerId: data.partner_id,
                startTime: data.start_time,
                state: 'active',
                remainingSeconds: 1800,
            });
        };

        const handleTimerUpdate = (data: { remaining_seconds: number }) => {
            setSessionData(prev => prev ? ({
                ...prev,
                remainingSeconds: data.remaining_seconds
            }) : null);
        };

        const handleSessionEnded = (data: { reason: string; message: string }) => {
            // We can transition to a local 'ended' state or just show the Ended component
            // But usually we update the sessionData state to 'ended'
            setSessionData(prev => prev ? ({
                ...prev,
                state: 'ended',
                endReason: data.reason
            }) : null);
        };

        const handleError = (data: { message: string }) => {
            setError(data.message);
        };

        socketService.on('knot_update', handleKnotUpdate);
        socketService.on('knot_started', handleKnotStarted);
        socketService.on('timer_update', handleTimerUpdate);
        socketService.on('session_ended', handleSessionEnded);
        socketService.on('error', handleError);

        return () => {
            socketService.leaveKnot();
            socketService.disconnect();

            socket.off('connect', onConnect);
            socket.off('disconnect', onDisconnect);
            socket.io.off('reconnect_attempt', onReconnectAttempt);

            socketService.off('knot_update', handleKnotUpdate);
            socketService.off('knot_started', handleKnotStarted);
            socketService.off('timer_update', handleTimerUpdate);
            socketService.off('session_ended', handleSessionEnded);
            socketService.off('error', handleError);
        };
    }, [starId]);

    // Cleanup session state when exiting
    const handleExit = () => {
        socketService.leaveKnot();
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
                            reason={sessionData.endReason || 'session_ended'}
                            onExit={handleExit}
                        />
                    )}
                </div>
            )}
        </motion.div>
    );
};
