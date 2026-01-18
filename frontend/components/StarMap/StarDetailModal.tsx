import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star } from '../../lib/types';
import { EMOTION_COLORS } from '../../lib/constants';
import { KnotButton } from '../knot/KnotButton';

interface StarDetailModalProps {
    star: Star | null;
    onClose: () => void;
    onEnterKnot: (starId: string) => void;
}

export const StarDetailModal: React.FC<StarDetailModalProps> = ({
    star,
    onClose,
    onEnterKnot
}) => {
    if (!star) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                />

                {/* Modal Content */}
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="relative w-full max-w-lg bg-[#1a1a2e] border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
                    style={{
                        boxShadow: `0 0 50px ${EMOTION_COLORS[star.emotion]}20`
                    }}
                >
                    {/* Header gradient */}
                    <div
                        className="absolute top-0 left-0 right-0 h-32 opacity-20 pointer-events-none"
                        style={{
                            background: `linear-gradient(to bottom, ${EMOTION_COLORS[star.emotion]}, transparent)`
                        }}
                    />

                    <div className="relative p-8 space-y-6">
                        {/* Close button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2 text-white/50 hover:text-white transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        {/* Content */}
                        <div className="space-y-2 text-center">
                            <span
                                className="inline-block px-3 py-1 text-xs uppercase tracking-widest rounded-full bg-white/5 border border-white/10"
                                style={{ color: EMOTION_COLORS[star.emotion] }}
                            >
                                {star.emotion}
                            </span>
                            <h2 className="text-3xl font-light text-white leading-relaxed">
                                "{star.message_text || star.message_preview}"
                            </h2>
                        </div>

                        <div className="flex justify-center py-4">
                            <div className="text-gray-400 text-sm">
                                Resonance: {star.resonance_count}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-3 pt-4 border-t border-white/10">
                            <KnotButton
                                starId={star.id}
                                onEnterKnot={onEnterKnot}
                                className="w-full justify-center"
                            />
                            <p className="text-xs text-center text-gray-500">
                                Start a 30-minute anonymous session connected to this thought
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};
