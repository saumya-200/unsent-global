import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import socketService from '../../lib/services/socketService';
import { KnotSession as KnotSessionType, KnotSessionState } from '../../lib/types/knot.types';
import { KnotWaiting } from './KnotWaiting';
import { KnotActive } from './KnotActive';
import { KnotEnded } from './KnotEnded';

interface KnotSessionProps {
    starId: string;
    onExit: () => void;
}

export const KnotSession: React.FC<KnotSessionProps> = ({ starId, onExit }) => {
    const [session, setSession] = useState<KnotSessionType>({
        roomId: '',
        starId: starId,
        state: 'connecting',
        partnerCount: 0,
        remainingSeconds: 1800, // 30 minutes
    });

    useEffect(() => {
        // Request Knot session
        socketService.requestKnot(starId);

        // Setup socket listeners
        const handleWaiting = (data: any) => {
            setSession(prev => ({
                ...prev,
                roomId: data.room_id,
                state: 'waiting',
                partnerCount: 1,
            }));
        };

        const handleKnotStarted = (data: any) => {
            setSession(prev => ({
                ...prev,
                roomId: data.room_id,
                state: 'active',
                partnerCount: 2,
                remainingSeconds: data.duration,
                startedAt: Date.now(),
            }));
        };

        const handleTimerUpdate = (data: any) => {
            setSession(prev => ({
                ...prev,
                remainingSeconds: data.remaining_seconds,
            }));
        };

        const handleSessionEnded = (data: any) => {
            setSession(prev => ({
                ...prev,
                state: 'ended',
                endedAt: Date.now(),
                endReason: data.reason,
            }));
        };

        const handlePartnerLeft = (data: any) => {
            setSession(prev => ({
                ...prev,
                state: 'ended',
                endedAt: Date.now(),
                endReason: 'partner_left',
            }));
        };

        const handleError = (data: any) => {
            console.error('Knot error:', data);
            // Show error toast or message
        };

        socketService.onWaitingForPartner(handleWaiting);
        socketService.onKnotStarted(handleKnotStarted);
        socketService.onTimerUpdate(handleTimerUpdate);
        socketService.onSessionEnded(handleSessionEnded);
        socketService.onPartnerLeft(handlePartnerLeft);
        socketService.onError(handleError);

        // Cleanup
        return () => {
            socketService.off('waiting_for_partner', handleWaiting);
            socketService.off('knot_started', handleKnotStarted);
            socketService.off('timer_update', handleTimerUpdate);
            socketService.off('session_ended', handleSessionEnded);
            socketService.off('partner_left', handlePartnerLeft);
            socketService.off('error', handleError);
        };
    }, [starId]);

    const handleLeave = () => {
        if (session.roomId) {
            socketService.leaveKnot(session.roomId);
        }
        onExit();
    };

    return (
        <AnimatePresence mode="wait">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="fixed inset-0 z-50 bg-[#0a0a0f] overflow-hidden"
            >
                {/* Background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-pink-900/20" />

                {/* Exit button */}
                <button
                    onClick={handleLeave}
                    className="absolute top-4 right-4 z-10 p-3 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 transition-colors"
                >
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* Content based on state */}
                <AnimatePresence mode="wait">
                    {(session.state === 'connecting' || session.state === 'waiting') && (
                        <KnotWaiting key="waiting" />
                    )}

                    {session.state === 'active' && (
                        <KnotActive
                            key="active"
                            session={session}
                            onLeave={handleLeave}
                        />
                    )}

                    {session.state === 'ended' && (
                        <KnotEnded
                            key="ended"
                            reason={session.endReason}
                            onClose={handleLeave}
                        />
                    )}
                </AnimatePresence>
            </motion.div>
        </AnimatePresence>
    );
};
