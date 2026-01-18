import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, UserPlus } from 'lucide-react';

interface IncomingRequestToastProps {
    message: string;
    onAccept: () => void;
    onReject: () => void;
}

export const IncomingRequestToast: React.FC<IncomingRequestToastProps> = ({ message, onAccept, onReject }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 50, x: '-50%' }}
            className="fixed bottom-8 left-1/2 z-[100] w-full max-w-sm px-4"
        >
            <div className="bg-[#0a0a0f] border border-white/10 rounded-2xl p-4 shadow-2xl backdrop-blur-md flex flex-col gap-4">
                <div className="flex items-start gap-4">
                    <div className="p-3 rounded-full bg-blue-500/10 text-blue-400">
                        <UserPlus className="w-5 h-5" />
                    </div>
                    <div>
                        <h4 className="text-white font-medium text-sm">Connection Request</h4>
                        <p className="text-white/60 text-xs mt-1 leading-relaxed">
                            {message}
                        </p>
                    </div>
                </div>

                <div className="flex gap-2 w-full">
                    <button
                        onClick={onReject}
                        className="flex-1 py-2 px-4 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white text-xs font-medium transition-colors"
                    >
                        Decline
                    </button>
                    <button
                        onClick={onAccept}
                        className="flex-1 py-2 px-4 rounded-lg bg-white text-black hover:bg-white/90 text-xs font-bold uppercase tracking-wide transition-colors flex items-center justify-center gap-2"
                    >
                        <Check className="w-3 h-3" />
                        Connect
                    </button>
                </div>
            </div>
        </motion.div>
    );
};
