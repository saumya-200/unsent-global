import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Sparkles } from 'lucide-react';
import { useStars } from '@/lib/hooks/useStars';

interface StarCompositionModalProps {
    onClose: () => void;
    onSuccess?: () => void;
}

export const StarCompositionModal: React.FC<StarCompositionModalProps> = ({ onClose, onSuccess }) => {
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { addStar } = useStars();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim()) return;

        setIsSubmitting(true);
        setError(null);

        try {
            // Emotion is automatically detected by the backend NLP
            const newStar = await addStar({
                message_text: message,
            });

            // Claim ownership immediately so we can receive requests
            if (newStar) {
                // We need to import socketService or pass it in. 
                // Let's assume useStars returns it or we import it.
                // Better: return the star from addStar, then use globally imported socketService here.
                const { socketService } = require('@/lib/services/socketService');
                socketService.claimStar(newStar.id);
                console.log("Claimed star:", newStar.id);

                // Save to localStorage for persistence
                try {
                    const stored = localStorage.getItem('unsent_owned_stars');
                    const stars = stored ? JSON.parse(stored) : [];
                    if (!stars.includes(newStar.id)) {
                        stars.push(newStar.id);
                        localStorage.setItem('unsent_owned_stars', JSON.stringify(stars));
                    }
                } catch (e) {
                    console.error("Failed to save star ownership", e);
                }
            }

            onSuccess?.();
            onClose();
        } catch (error: any) {
            console.error('Failed to create star:', error);
            setError("The stars aren't aligning right now. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md"
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring", duration: 0.5 }}
                className="relative w-full max-w-2xl p-8 md:p-12 mx-4"
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-0 right-0 p-4 text-white/30 hover:text-white transition-colors"
                >
                    <X className="w-6 h-6" />
                </button>

                <div className="flex flex-col items-center space-y-8">
                    {/* Header */}
                    <div className="text-center space-y-2">
                        <motion.div
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            <Sparkles className="w-8 h-8 text-yellow-100/50 mx-auto mb-4" />
                        </motion.div>
                        <h2 className="text-3xl md:text-4xl font-light text-white tracking-widest font-display uppercase">
                            Cast Your Star
                        </h2>
                        <p className="text-white/40 font-mono text-xs tracking-[0.2em] uppercase">
                            What remains unsaid?
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="w-full space-y-8">
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500 blur-lg" />
                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Type your message to the universe..."
                                className="relative w-full h-48 bg-white/5 border border-white/10 rounded-xl p-6 text-xl md:text-2xl text-white placeholder-white/20 focus:outline-none focus:border-white/30 transition-all resize-none font-light leading-relaxed custom-scrollbar text-center"
                                maxLength={500}
                                required
                                autoFocus
                            />
                            <div className="absolute bottom-4 right-4 text-xs font-mono text-white/20">
                                {message.length}/500
                            </div>
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-red-400 text-xs text-center font-mono tracking-widest uppercase"
                            >
                                {error}
                            </motion.div>
                        )}

                        <div className="flex justify-center">
                            <button
                                type="submit"
                                disabled={isSubmitting || !message.trim()}
                                className="group relative px-12 py-4 bg-white text-black rounded-full overflow-hidden transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/80 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
                                <span className="relative flex items-center gap-3 font-bold text-sm tracking-[0.3em] uppercase">
                                    {isSubmitting ? 'Casting...' : 'Release'}
                                    <Send className="w-3 h-3" />
                                </span>
                            </button>
                        </div>
                    </form>
                </div>
            </motion.div>
        </motion.div>
    );
};
