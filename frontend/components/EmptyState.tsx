'use client';

import React from 'react';
import { Stars } from 'lucide-react';

const EmptyState: React.FC = () => {
    return (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none">
            <div className="flex flex-col items-center max-w-sm text-center px-6 animate-fade-in">
                <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mb-6 opacity-40">
                    <Stars className="text-white w-6 h-6" />
                </div>

                <p className="text-white/40 text-[10px] tracking-[0.6em] uppercase mb-4 leading-relaxed font-display">
                    The sky is silent.
                </p>

                <h2 className="text-white/60 text-lg font-light tracking-wide mb-8">
                    The constellation is waiting for its first star...
                </h2>

                <p className="text-white/20 text-[9px] tracking-[0.2em] uppercase max-w-[200px]">
                    Share your unsent message to ignite the night.
                </p>
            </div>
        </div>
    );
};

export default EmptyState;
