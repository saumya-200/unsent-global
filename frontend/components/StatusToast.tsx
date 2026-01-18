import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, CheckCircle, Info } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

interface StatusToastProps {
    message: string;
    type?: ToastType;
    onClose: () => void;
    duration?: number;
}

export const StatusToast: React.FC<StatusToastProps> = ({
    message,
    type = 'info',
    onClose,
    duration = 4000
}) => {
    useEffect(() => {
        if (duration > 0) {
            const timer = setTimeout(onClose, duration);
            return () => clearTimeout(timer);
        }
    }, [duration, onClose]);

    const getIcon = () => {
        switch (type) {
            case 'success': return <CheckCircle className="w-5 h-5 text-green-400" />;
            case 'error': return <AlertCircle className="w-5 h-5 text-red-400" />;
            default: return <Info className="w-5 h-5 text-blue-400" />;
        }
    };

    const getBorderColor = () => {
        switch (type) {
            case 'success': return 'border-green-500/20';
            case 'error': return 'border-red-500/20';
            default: return 'border-blue-500/20';
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: -20, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -20, x: '-50%' }}
            className="fixed top-24 left-1/2 z-[100] w-full max-w-sm px-4 pointer-events-none"
        >
            <div className={`
                bg-[#0a0a0f]/90 backdrop-blur-xl border ${getBorderColor()} 
                rounded-xl p-4 shadow-2xl flex items-center gap-4
                pointer-events-auto
            `}>
                <div className="shrink-0">
                    {getIcon()}
                </div>
                <div>
                    <p className="text-white font-medium text-sm leading-snug">
                        {message}
                    </p>
                </div>
                <button
                    onClick={onClose}
                    className="ml-auto text-white/20 hover:text-white transition-colors"
                >
                    <span className="sr-only">Close</span>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </motion.div>
    );
};
