'use client';

import React from 'react';
import { MessageSquarePlus } from 'lucide-react';

interface HeaderProps {
    totalMessages: number;
}

const Header: React.FC<HeaderProps> = ({ totalMessages }) => {
    return (
        <header className="fixed top-0 left-0 w-full z-50 px-8 py-10 flex items-start justify-between pointer-events-none">
            {/* Brand Section */}
            <div className="flex flex-col gap-2 pointer-events-auto">
                <h1 className="text-white text-5xl font-black tracking-[-0.05em] leading-none font-display">
                    UNSENT
                </h1>
                <p className="text-white/40 text-[10px] tracking-[0.4em] uppercase font-medium">
                    The Anonymous Map of Unspoken Human Emotion
                </p>
            </div>

            {/* Action Section */}
            <div className="flex flex-col items-end gap-6 pointer-events-auto text-right">
                <div className="flex flex-col items-end gap-1">
                    <span className="text-white/20 text-[9px] tracking-[0.2em] uppercase font-mono">
                        Connectivity Pulse
                    </span>
                    <div className="flex items-center gap-2">
                        <span className="text-white font-mono text-xs font-bold tabular-nums">
                            {totalMessages.toLocaleString()}
                        </span>
                        <span className="text-white/40 text-[10px] tracking-widest uppercase">
                            Stars in the Sky
                        </span>
                    </div>
                </div>

                <button
                    className="group relative flex items-center gap-3 px-8 py-3.5 bg-white text-black rounded-full transition-all hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(255,255,255,0.2)] overflow-hidden"
                    onClick={() => {
                        // Future submission modal
                        console.log("Open submission modal");
                    }}
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400/0 via-blue-400/20 to-blue-400/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                    <MessageSquarePlus className="w-4 h-4" />
                    <span className="text-[10px] font-black tracking-[0.2em] uppercase">Share Your Message</span>
                </button>
            </div>
        </header>
    );
};

export default Header;
