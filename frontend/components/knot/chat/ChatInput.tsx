import React, { useState, useRef, KeyboardEvent } from 'react';
import { motion } from 'framer-motion';

interface ChatInputProps {
    onSend: (message: string) => void;
    disabled?: boolean;
    placeholder?: string;
    maxLength?: number;
}

export const ChatInput: React.FC<ChatInputProps> = ({
    onSend,
    disabled = false,
    placeholder = "Type a message...",
    maxLength = 500,
}) => {
    const [message, setMessage] = useState('');
    const inputRef = useRef<HTMLTextAreaElement>(null);

    const handleSend = () => {
        if (!message.trim() || disabled) return;
        onSend(message);
        setMessage('');
        inputRef.current?.focus();
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        // Send on Enter, new line on Shift+Enter
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const remainingChars = maxLength - message.length;
    const isNearLimit = remainingChars < 50;

    return (
        <div className="p-4 bg-white/5 border-t border-white/10">
            <div className="flex gap-2 items-end">
                {/* Text input */}
                <div className="flex-1 relative">
                    <textarea
                        ref={inputRef}
                        value={message}
                        onChange={(e) => setMessage(e.target.value.slice(0, maxLength))}
                        onKeyDown={handleKeyDown}
                        disabled={disabled}
                        placeholder={placeholder}
                        rows={1}
                        className="
              w-full px-4 py-2.5 pr-16
              bg-white/10 backdrop-blur-md
              border border-white/20 rounded-full
              text-white placeholder-gray-400
              focus:outline-none focus:ring-2 focus:ring-purple-500/50
              disabled:opacity-50 disabled:cursor-not-allowed
              resize-none
              scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent
            "
                        style={{
                            maxHeight: '120px',
                            minHeight: '42px',
                        }}
                    />

                    {/* Character counter */}
                    {isNearLimit && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="absolute right-14 bottom-3 text-xs text-gray-400"
                        >
                            {remainingChars}
                        </motion.div>
                    )}
                </div>

                {/* Send button */}
                <motion.button
                    onClick={handleSend}
                    disabled={disabled || !message.trim()}
                    whileHover={!disabled && message.trim() ? { scale: 1.05 } : {}}
                    whileTap={!disabled && message.trim() ? { scale: 0.95 } : {}}
                    className={`
            p-3 rounded-full transition-all
            ${disabled || !message.trim()
                            ? 'bg-white/10 text-gray-500 cursor-not-allowed'
                            : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg hover:shadow-purple-500/50'
                        }
          `}
                >
                    <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                        />
                    </svg>
                </motion.button>
            </div>

            {/* Helper text */}
            <p className="text-xs text-gray-500 mt-2 px-1">
                Press Enter to send, Shift+Enter for new line
            </p>
        </div>
    );
};
