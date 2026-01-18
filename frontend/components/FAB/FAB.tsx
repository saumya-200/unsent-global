'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';

interface FABProps {
    onClick: () => void;
    visible?: boolean;
}

const FAB: React.FC<FABProps> = ({ onClick, visible = true }) => {
    if (!visible) return null;

    return (
        <button
            onClick={onClick}
            className="fixed bottom-8 right-8 z-40 w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 shadow-lg shadow-purple-500/30 flex items-center justify-center transition-all hover:scale-110 active:scale-95 hover:shadow-purple-500/50 group"
            aria-label="Share your message"
        >
            {/* Pulse Animation */}
            <div className="absolute inset-0 rounded-full bg-purple-400 animate-ping opacity-30" />

            {/* Icon */}
            <Sparkles className="w-6 h-6 text-white relative z-10 transition-transform group-hover:rotate-12" />

            {/* Tooltip */}
            <span className="absolute right-full mr-3 px-3 py-1.5 bg-black/80 backdrop-blur-sm rounded-lg text-[10px] font-bold uppercase tracking-widest text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                Share Message ✨
            </span>
        </button>
    );
};

export default FAB;
