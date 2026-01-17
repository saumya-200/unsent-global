'use client';

import React from 'react';
import { Emotion } from '@/lib/types';
import {
    Sun,
    CloudRain,
    Flame,
    Wind,
    Heart,
    Sparkles,
    Moon,
    Compass,
    Coffee
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface EmotionIconProps {
    emotion: Emotion;
    size?: 'small' | 'medium' | 'large';
    showLabel?: boolean;
}

const emotionConfigs: Record<Emotion, { icon: any, color: string, label: string, emoji: string }> = {
    joy: { icon: Sun, color: 'text-yellow-400', label: 'Joy', emoji: '✨' },
    sadness: { icon: CloudRain, color: 'text-blue-400', label: 'Sadness', emoji: '💙' },
    anger: { icon: Flame, color: 'text-red-500', label: 'Anger', emoji: '🔥' },
    fear: { icon: Wind, color: 'text-purple-400', label: 'Fear', emoji: '😰' },
    gratitude: { icon: Sparkles, color: 'text-emerald-400', label: 'Gratitude', emoji: '🙏' },
    regret: { icon: Coffee, color: 'text-orange-400', label: 'Regret', emoji: '💭' },
    love: { icon: Heart, color: 'text-pink-400', label: 'Love', emoji: '💗' },
    hope: { icon: Compass, color: 'text-cyan-400', label: 'Hope', emoji: '🌟' },
    loneliness: { icon: Moon, color: 'text-indigo-400', label: 'Loneliness', emoji: '🌙' },
};

const EmotionIcon: React.FC<EmotionIconProps> = ({
    emotion,
    size = 'medium',
    showLabel = true
}) => {
    const config = emotionConfigs[emotion] || emotionConfigs.hope;
    const Icon = config.icon;

    const sizeClasses = {
        small: 'w-4 h-4',
        medium: 'w-6 h-6',
        large: 'w-10 h-10',
    };

    return (
        <div className="flex items-center gap-3">
            <div className={cn(
                "flex items-center justify-center rounded-full bg-white/5 border border-white/10",
                size === 'small' ? 'p-1.5' : size === 'large' ? 'p-4' : 'p-2.5'
            )}>
                <Icon className={cn(sizeClasses[size], config.color)} />
            </div>
            {showLabel && (
                <div className="flex flex-col">
                    <span className="text-[10px] tracking-[0.2em] uppercase text-white/30 font-bold">Resonating With</span>
                    <span className={cn("text-xs font-black tracking-widest uppercase", config.color)}>
                        {config.label} {config.emoji}
                    </span>
                </div>
            )}
        </div>
    );
};

export default EmotionIcon;
