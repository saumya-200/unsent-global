'use client';

import React, { useState } from 'react';
import { Heart, Check } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface ResonanceButtonProps {
    resonanceCount: number;
    hasResonated: boolean;
    onResonate: () => void;
    isLoading?: boolean;
    disabled?: boolean;
}

const ResonanceButton: React.FC<ResonanceButtonProps> = ({
    resonanceCount,
    hasResonated,
    onResonate,
    isLoading,
    disabled
}) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <button
            onClick={onResonate}
            disabled={disabled || hasResonated || isLoading}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={cn(
                "group relative flex items-center justify-center gap-4 px-10 py-4 rounded-full transition-all duration-500 overflow-hidden",
                hasResonated
                    ? "bg-emerald-500/20 border border-emerald-500/30 cursor-default"
                    : "bg-white text-black hover:bg-white/90 hover:scale-105 active:scale-95 shadow-[0_0_50px_rgba(255,255,255,0.1)]",
                (disabled || isLoading) && !hasResonated && "opacity-50 cursor-not-allowed"
            )}
        >
            {/* Background Pulse for unresonated state */}
            {!hasResonated && !isLoading && (
                <div className="absolute inset-0 bg-white/10 animate-pulse group-hover:hidden" />
            )}

            {/* Content */}
            <div className="relative z-10 flex items-center gap-4">
                {hasResonated ? (
                    <>
                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500 text-white">
                            <Check className="w-4 h-4" />
                        </div>
                        <span className="text-emerald-400 text-[10px] font-black tracking-[0.2em] uppercase">
                            You feel this too
                        </span>
                    </>
                ) : (
                    <>
                        <Heart
                            className={cn(
                                "w-5 h-5 transition-all duration-500",
                                isHovered ? "fill-red-500 text-red-500 scale-125" : "text-black"
                            )}
                        />
                        <span className="text-[10px] font-black tracking-[0.2em] uppercase">
                            {isLoading ? "Broadcasting..." : "I feel this too"}
                        </span>
                    </>
                )}
            </div>

            {/* Resonance Count Overlay */}
            <div className={cn(
                "absolute right-2 px-3 py-1.5 rounded-full font-mono text-[9px] font-bold tabular-nums transition-colors duration-500",
                hasResonated ? "bg-emerald-500/20 text-emerald-400" : "bg-black/10 text-black/60"
            )}>
                {resonanceCount.toLocaleString()}
            </div>
        </button>
    );
};

export default ResonanceButton;
