import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { KnotSession } from '../../lib/types/knot.types';
import { ChatInterface } from './chat/ChatInterface';
import { DrawingCanvas } from './canvas/DrawingCanvas';
import { CountdownTimer } from './timer/CountdownTimer';
import { WarningToast } from './notifications/WarningToast';

interface KnotActiveProps {
    session: KnotSession;
    onLeave: () => void;
}

export const KnotActive: React.FC<KnotActiveProps> = ({ session, onLeave }) => {
    const [warningMessage, setWarningMessage] = useState<string | null>(null);

    const handleWarning = (seconds: number) => {
        if (seconds === 300) {
            setWarningMessage('5 minutes remaining');
        } else if (seconds === 60) {
            setWarningMessage('1 minute remaining');
        }
    };

    return (
        <div className="h-full flex flex-col relative z-10">
            {/* Warning toast */}
            <WarningToast
                message={warningMessage || ''}
                visible={!!warningMessage}
                onDismiss={() => setWarningMessage(null)}
                type="warning"
            />

            {/* Header with timer */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 md:p-4 flex items-center justify-between md:justify-center bg-white/5 backdrop-blur-md border-b border-white/10"
            >
                <div className="md:absolute md:left-4">
                    {/* Small logo or title could go here */}
                    <span className="text-white/30 text-xs tracking-widest uppercase font-light">Unsent Knot</span>
                </div>

                <CountdownTimer
                    targetDate={new Date((session.startedAt || Date.now() / 1000) * 1000 + (session.remainingSeconds || 1800) * 1000)}
                    onWarning={handleWarning}
                />

                <button
                    onClick={onLeave}
                    className="md:absolute md:right-4 text-xs text-red-400/70 hover:text-red-400 border border-red-400/20 hover:border-red-400/50 px-3 py-1 rounded-full transition-all"
                >
                    Exit
                </button>
            </motion.div>

            {/* Main content area with improved spacing */}
            <div className="flex-1 flex flex-col md:flex-row p-2 md:p-4 gap-2 md:gap-4 overflow-hidden">
                {/* Drawing canvas - larger on desktop */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex-1 md:flex-[2] min-h-0 relative rounded-xl overflow-hidden shadow-xl"
                >
                    <DrawingCanvas
                        roomId={session.roomId}
                        isActive={session.state === 'active'}
                    />
                </motion.div>

                {/* Chat interface - sidebar on desktop */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex-1 md:max-w-md min-h-0 h-[40vh] md:h-auto rounded-xl overflow-hidden shadow-xl"
                >
                    <ChatInterface
                        roomId={session.roomId}
                        isActive={session.state === 'active'}
                    />
                </motion.div>
            </div>
        </div>
    );
};
