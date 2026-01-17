'use client';

import React from 'react';
import { Activity, Zap, TrendingUp } from 'lucide-react';

interface FloatingStatsProps {
    totalCount: number;
    totalResonance: number;
    topEmotion: string;
}

const FloatingStats: React.FC<FloatingStatsProps> = ({
    totalCount,
    totalResonance,
    topEmotion
}) => {
    return (
        <div className="fixed bottom-12 left-10 z-30 flex flex-col gap-6 pointer-events-none group">
            {/* Dynamic Activity Pulse */}
            <div className="flex items-center gap-4 bg-white/5 border border-white/10 backdrop-blur-xl px-5 py-3 rounded-2xl w-fit pointer-events-auto hover:bg-white/10 transition-colors">
                <div className="relative">
                    <Activity className="w-4 h-4 text-blue-400" />
                    <div className="absolute inset-0 w-4 h-4 text-blue-400 animate-ping opacity-50" />
                </div>
                <div className="flex flex-col">
                    <span className="text-[8px] tracking-[0.2em] uppercase text-white/30 font-bold mb-0.5">Global Resonance</span>
                    <span className="text-white font-mono text-xs font-black tabular-nums">{totalResonance.toLocaleString()}</span>
                </div>
            </div>

            {/* Main Stats Panel */}
            <div className="flex flex-col gap-5 bg-white/5 border border-white/10 backdrop-blur-xl p-6 rounded-3xl w-64 pointer-events-auto hover:bg-white/10 transition-colors shadow-2xl">
                {/* Total Stars */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                            <Zap className="w-4 h-4 text-yellow-500" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[8px] tracking-[0.2em] uppercase text-white/30 font-bold">Universe Size</span>
                            <span className="text-white text-xs font-bold leading-tight uppercase font-display">{totalCount} Stars</span>
                        </div>
                    </div>
                </div>

                <div className="h-px bg-white/5" />

                {/* Top Emotion */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                            <TrendingUp className="w-4 h-4 text-purple-400" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[8px] tracking-[0.2em] uppercase text-white/30 font-bold">Leading Frequency</span>
                            <span className="text-white text-xs font-bold leading-tight uppercase font-display">{topEmotion || "Equilibrium"}</span>
                        </div>
                    </div>
                </div>

                {/* Footer info */}
                <p className="text-[7px] tracking-[0.3em] uppercase text-white/10 font-bold text-center mt-2">
                    Syncing with local orbit...
                </p>
            </div>
        </div>
    );
};

export default FloatingStats;
