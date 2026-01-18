import React from 'react';
import { motion } from 'framer-motion';

interface KnotEndedProps {
    reason?: 'time_expired' | 'partner_left' | 'user_left' | 'error';
    onClose: () => void;
}

export const KnotEnded: React.FC<KnotEndedProps> = ({ reason, onClose }) => {
    const getMessage = () => {
        switch (reason) {
            case 'time_expired':
                return {
                    title: "Time's Up",
                    subtitle: "Your 30 minutes together have ended",
                    emoji: "⏰",
                };
            case 'partner_left':
                return {
                    title: "They Left",
                    subtitle: "Your partner has exited the session",
                    emoji: "👋",
                };
            case 'user_left':
                return {
                    title: "Session Ended",
                    subtitle: "You have left the Knot",
                    emoji: "✨",
                };
            default:
                return {
                    title: "Session Ended",
                    subtitle: "The connection has closed",
                    emoji: "🌟",
                };
        }
    };

    const { title, subtitle, emoji } = getMessage();

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex items-center justify-center h-full"
        >
            <div className="text-center space-y-8 max-w-md px-4">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                    className="text-8xl"
                >
                    {emoji}
                </motion.div>

                <div className="space-y-2">
                    <h2 className="text-3xl md:text-4xl font-light text-white">
                        {title}
                    </h2>
                    <p className="text-gray-400">
                        {subtitle}
                    </p>
                </div>

                <motion.button
                    onClick={onClose}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-3 rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-colors"
                >
                    Return to Stars
                </motion.button>
            </div>
        </motion.div>
    );
};
