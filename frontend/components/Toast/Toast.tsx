'use client';

import React, { useEffect, useState } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export interface ToastProps {
    message: string;
    type: 'success' | 'error' | 'info';
    onClose: () => void;
    duration?: number;
}

const Toast: React.FC<ToastProps> = ({
    message,
    type,
    onClose,
    duration = 3000
}) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(onClose, 300); // Wait for fade animation
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const icons = {
        success: <CheckCircle className="w-4 h-4 text-emerald-400" />,
        error: <AlertCircle className="w-4 h-4 text-red-400" />,
        info: <Info className="w-4 h-4 text-blue-400" />,
    };

    const bgColors = {
        success: 'bg-emerald-500/10 border-emerald-500/20',
        error: 'bg-red-500/10 border-red-500/20',
        info: 'bg-blue-500/10 border-blue-500/20',
    };

    return (
        <div className={cn(
            "fixed bottom-8 left-1/2 -translate-x-1/2 z-[10000] flex items-center gap-3 px-4 py-3 rounded-2xl border backdrop-blur-xl transition-all duration-300",
            bgColors[type],
            isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
        )}>
            {icons[type]}
            <span className="text-xs font-medium text-white/90 tracking-wide">{message}</span>
            <button
                onClick={() => { setIsVisible(false); setTimeout(onClose, 300); }}
                className="ml-2 text-white/20 hover:text-white/40 transition-colors"
            >
                <X className="w-4 h-4" />
            </button>
        </div>
    );
};

export default Toast;
