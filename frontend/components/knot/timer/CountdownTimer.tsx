import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CountdownTimerProps {
    targetDate: Date;
    onWarning?: (seconds: number) => void;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({
    targetDate,
    onWarning,
}) => {
    const calculateRemaining = () => Math.max(0, Math.floor((targetDate.getTime() - Date.now()) / 1000));
    const [remainingSeconds, setRemainingSeconds] = useState(calculateRemaining());

    useEffect(() => {
        const timer = setInterval(() => {
            const left = calculateRemaining();
            setRemainingSeconds(left);

            // Warnings
            if (left === 300) onWarning?.(300);
            if (left === 60) onWarning?.(60);

            if (left <= 0) clearInterval(timer);
        }, 1000);

        return () => clearInterval(timer);
    }, [targetDate, onWarning]);

    const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const getTimerColor = (): string => {
        if (remainingSeconds <= 60) return 'text-red-400';
        if (remainingSeconds <= 300) return 'text-yellow-400';
        return 'text-white';
    };

    const shouldPulse = remainingSeconds <= 300;

    return (
        <div className="relative">
            <motion.div
                animate={shouldPulse ? {
                    scale: [1, 1.05, 1],
                } : {}}
                transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                className={`
          text-3xl md:text-4xl font-mono font-bold
          ${getTimerColor()}
          transition-colors duration-500
        `}
            >
                {formatTime(remainingSeconds)}
            </motion.div>

            {/* Warning indicator */}
            <AnimatePresence>
                {remainingSeconds <= 60 && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0 }}
                        className="absolute -top-2 -right-2"
                    >
                        <div className="w-3 h-3 bg-red-500 rounded-full animate-ping" />
                        <div className="w-3 h-3 bg-red-500 rounded-full absolute top-0 right-0" />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
