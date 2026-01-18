import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChatMessage } from '../../../lib/types/knot.types';

interface ChatMessageBubbleProps {
    message: ChatMessage;
}

export const ChatMessageBubble: React.FC<ChatMessageBubbleProps> = ({ message }) => {
    const [showTimestamp, setShowTimestamp] = useState(false);

    const formatTimestamp = (timestamp: number) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
        >
            <div
                onMouseEnter={() => setShowTimestamp(true)}
                onMouseLeave={() => setShowTimestamp(false)}
                className={`
          max-w-[75%] md:max-w-[60%] px-4 py-2.5 rounded-2xl
          ${message.isOwn
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-br-sm'
                        : 'bg-white/10 backdrop-blur-md text-gray-100 rounded-bl-sm border border-white/20'
                    }
          break-words shadow-lg
        `}
            >
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {message.message}
                </p>

                {/* Timestamp tooltip */}
                <AnimatePresence>
                    {showTimestamp && (
                        <motion.div
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            className="text-xs mt-1 opacity-70"
                        >
                            {formatTimestamp(message.timestamp)}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
};
