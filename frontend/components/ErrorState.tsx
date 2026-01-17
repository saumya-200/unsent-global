'use client';

import React from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';

interface ErrorStateProps {
    message: string;
    onRetry: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({ message, onRetry }) => {
    return (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/90 backdrop-blur-md">
            <div className="flex flex-col items-center max-w-md text-center px-6">
                <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center mb-8">
                    <AlertTriangle className="text-red-500 w-8 h-8" />
                </div>

                <h2 className="text-white text-lg font-bold tracking-tight mb-2">
                    The stars are obscured
                </h2>

                <p className="text-white/40 text-xs leading-relaxed mb-8">
                    {message || "We're having trouble connecting to the universe. Please check your connection and try again."}
                </p>

                <button
                    onClick={onRetry}
                    className="group flex items-center gap-3 px-8 py-3 bg-white/5 border border-white/10 hover:bg-white hover:text-black rounded-full transition-all active:scale-95"
                >
                    <RefreshCcw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
                    <span className="text-[10px] font-bold tracking-[0.2em] uppercase">Retry Connection</span>
                </button>
            </div>
        </div>
    );
};

export default ErrorState;
