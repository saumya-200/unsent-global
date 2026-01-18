'use client';

import React from 'react';
import { Emotion } from '@/lib/types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface SuccessAnimationProps {
    active: boolean;
    emotion: Emotion;
}

const emotionColors: Record<Emotion, string> = {
    joy: 'bg-yellow-400',
    sadness: 'bg-blue-400',
    anger: 'bg-red-500',
    fear: 'bg-purple-400',
    gratitude: 'bg-emerald-400',
    regret: 'bg-orange-400',
    love: 'bg-pink-400',
    hope: 'bg-cyan-400',
    loneliness: 'bg-indigo-400',
};

const SuccessAnimation: React.FC<SuccessAnimationProps> = ({ active, emotion }) => {
    if (!active) return null;

    const color = emotionColors[emotion] || 'bg-white';

    return (
        <div className="absolute inset-0 pointer-events-none z-50 flex items-center justify-center overflow-visible">
            {/* Sparkles */}
            {[...Array(20)].map((_, i) => (
                <div
                    key={i}
                    className={cn(
                        "absolute w-1 h-1 rounded-full",
                        color,
                        "animate-sparkle"
                    )}
                    style={{
                        '--tx': `${(Math.random() - 0.5) * 300}px`,
                        '--ty': `${(Math.random() - 0.5) * 300}px`,
                        '--delay': `${Math.random() * 0.15}s`,
                    } as React.CSSProperties}
                />
            ))}

            {/* Ripple */}
            <div className={cn(
                "absolute w-4 h-4 rounded-full opacity-0 animate-ripple",
                color.replace('bg-', 'border-')
            )}
                style={{ borderStyle: 'solid', borderWidth: '2px' }}
            />
        </div>
    );
};

export default SuccessAnimation;
