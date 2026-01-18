"use client";

import React from 'react';
import { motion } from 'framer-motion';

interface KnotButtonProps {
    starId: string;
    onEnterKnot: (starId: string) => void;
    disabled?: boolean;
    className?: string;
}

export const KnotButton: React.FC<KnotButtonProps> = ({
    starId,
    onEnterKnot,
    disabled = false,
    className = '',
}) => {
    return (
        <motion.button
            onClick={() => onEnterKnot(starId)}
            disabled={disabled}
            whileHover={!disabled ? { scale: 1.05 } : {}}
            whileTap={!disabled ? { scale: 0.95 } : {}}
            className={`
        px-6 py-3 rounded-full
        bg-gradient-to-r from-purple-500 to-pink-500
        text-white font-medium
        transition-all duration-300
        hover:shadow-lg hover:shadow-purple-500/50
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
        >
            <span className="flex items-center gap-2">
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
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                </svg>
                Enter Knot
            </span>
        </motion.button>
    );
};
