import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface WarningToastProps {
    message: string;
    visible: boolean;
    onDismiss: () => void;
    type?: 'warning' | 'info' | 'error';
}

export const WarningToast: React.FC<WarningToastProps> = ({
    message,
    visible,
    onDismiss,
    type = 'warning',
}) => {
    useEffect(() => {
        if (visible) {
            const timer = setTimeout(onDismiss, 3000);
            return () => clearTimeout(timer);
        }
    }, [visible, onDismiss]);

    const getColors = () => {
        switch (type) {
            case 'warning':
                return 'bg-yellow-500/90 text-yellow-50';
            case 'error':
                return 'bg-red-500/90 text-red-50';
            default:
                return 'bg-blue-500/90 text-blue-50';
        }
    };

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    initial={{ opacity: 0, y: -50, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -50, scale: 0.9 }}
                    className="fixed top-20 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
                >
                    <div className={`
            px-6 py-3 rounded-full shadow-lg backdrop-blur-md
            flex items-center gap-2 ${getColors()}
          `}>
                        {type === 'warning' && (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        )}
                        {type === 'error' && (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        )}
                        {type === 'info' && (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        )}

                        <span className="font-medium">{message}</span>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
