import React from 'react';
import { motion } from 'framer-motion';

interface KnotWaitingProps {
    onCancel: () => void;
}

export const KnotWaiting: React.FC<KnotWaitingProps> = ({ onCancel }) => {
    return (
        <div className="flex items-center justify-center h-full relative">
            <button
                onClick={onCancel}
                className="absolute top-4 right-4 z-20 text-xs text-white/50 hover:text-white border border-white/20 hover:border-white/50 px-4 py-2 rounded-full transition-all backdrop-blur-md"
            >
                Cancel & Exit
            </button>
            <div className="text-center space-y-8">
                {/* Animated pulse circle */}
                <div className="relative flex items-center justify-center">
                    {/* Outer rings */}
                    <motion.div
                        animate={{
                            scale: [1, 1.5, 1],
                            opacity: [0.5, 0, 0.5],
                        }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                        className="absolute w-32 h-32 rounded-full bg-purple-500/30"
                    />
                    <motion.div
                        animate={{
                            scale: [1, 1.3, 1],
                            opacity: [0.7, 0, 0.7],
                        }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: 0.5,
                        }}
                        className="absolute w-32 h-32 rounded-full bg-pink-500/30"
                    />

                    {/* Center circle */}
                    <motion.div
                        animate={{
                            scale: [1, 1.1, 1],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                        className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center"
                    >
                        <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </motion.div>
                </div>

                {/* Text */}
                <div className="space-y-4">
                    <motion.h2
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="text-2xl md:text-3xl font-light text-white"
                    >
                        Waiting for someone else...
                    </motion.h2>
                    <p className="text-gray-400 text-sm md:text-base">
                        Another person will join soon.<br />
                        Stay right here.
                    </p>
                </div>
            </div>
        </div>
    );
};
