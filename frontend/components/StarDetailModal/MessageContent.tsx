'use client';

import React from 'react';
import { Emotion } from '@/lib/types';

interface MessageContentProps {
    message: string;
    language: string;
    emotion: Emotion;
}

const emotionStyles: Record<Emotion, string> = {
    joy: 'border-yellow-500/30 bg-yellow-500/5',
    sadness: 'border-blue-500/30 bg-blue-500/5',
    anger: 'border-red-500/30 bg-red-500/5',
    fear: 'border-purple-500/30 bg-purple-500/5',
    gratitude: 'border-emerald-500/30 bg-emerald-500/5',
    regret: 'border-orange-500/30 bg-orange-500/5',
    love: 'border-pink-500/30 bg-pink-500/5',
    hope: 'border-cyan-500/30 bg-cyan-500/5',
    loneliness: 'border-indigo-500/30 bg-indigo-500/5',
};

const MessageContent: React.FC<MessageContentProps> = ({
    message,
    language,
    emotion
}) => {
    return (
        <div className={`relative w-full p-8 rounded-3xl border ${emotionStyles[emotion] || 'border-white/10 bg-white/5'} transition-colors duration-700`}>
            {/* Decorative marks */}
            <div className="absolute top-4 left-6 text-4xl text-white/10 font-serif leading-none italic select-none">“</div>

            <div className="relative z-10">
                <p className="text-white/90 text-lg md:text-xl font-light leading-relaxed tracking-wide whitespace-pre-wrap font-sans">
                    {message}
                </p>
            </div>

            <div className="absolute bottom-4 right-6 text-4xl text-white/10 font-serif leading-none italic select-none">”</div>

            {/* Language Badge */}
            <div className="absolute -bottom-3 left-8 px-3 py-1 bg-black border border-white/10 rounded-full">
                <span className="text-[8px] tracking-[0.2em] uppercase text-white/40 font-bold">
                    Captured in {language.toUpperCase()}
                </span>
            </div>
        </div>
    );
};

export default MessageContent;
