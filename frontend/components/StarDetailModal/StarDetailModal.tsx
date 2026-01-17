'use client';

import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { Star, Emotion } from '@/lib/types';
import EmotionIcon from './EmotionIcon';
import MessageContent from './MessageContent';
import ResonanceButton from './ResonanceButton';
import styles from './StarDetailModal.module.css';

interface StarDetailModalProps {
    star: (Star & { has_resonated: boolean }) | null;
    isOpen: boolean;
    onClose: () => void;
    onResonate: () => void;
    isResonating?: boolean;
    isLoading?: boolean;
}

const StarDetailModal: React.FC<StarDetailModalProps> = ({
    star,
    isOpen,
    onClose,
    onResonate,
    isResonating,
    isLoading
}) => {
    const modalRef = useRef<HTMLDivElement>(null);

    // Handle ESC key and Body scroll lock
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };

        if (isOpen) {
            window.addEventListener('keydown', handleEsc);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            window.removeEventListener('keydown', handleEsc);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const content = (
        <div className={styles.wrapper}>
            {/* Backdrop */}
            <div className={styles.backdrop} onClick={onClose} />

            {/* Modal Container */}
            <div
                className={`${styles.container} ${star ? styles[star.emotion] : ''}`}
                ref={modalRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-title"
            >
                {/* Glow Effects */}
                <div className={styles.glowOuter} />
                <div className={styles.glowInner} />

                {/* Header */}
                <div className={styles.header}>
                    {star && <EmotionIcon emotion={star.emotion} />}
                    <button
                        onClick={onClose}
                        className={styles.closeButton}
                        aria-label="Close modal"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content Area */}
                <div className={styles.content}>
                    {isLoading ? (
                        <div className={styles.loadingSkeleton}>
                            <div className={styles.skeletonLine} />
                            <div className={styles.skeletonLine} />
                            <div className={styles.skeletonLineShort} />
                        </div>
                    ) : star ? (
                        <MessageContent
                            message={star.message_text || ""}
                            language={star.language}
                            emotion={star.emotion}
                        />
                    ) : (
                        <div className="text-white/20 text-center py-20 uppercase tracking-[0.5em] text-[10px]">
                            Lost in space...
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className={styles.footer}>
                    {star && (
                        <ResonanceButton
                            resonanceCount={star.resonance_count}
                            hasResonated={star.has_resonated}
                            onResonate={onResonate}
                            isLoading={isResonating}
                        />
                    )}

                    <p className={styles.timestamp}>
                        Manifested on {star ? new Date(star.created_at).toLocaleDateString() : ''}
                    </p>
                </div>
            </div>
        </div>
    );

    // Render into body to avoid z-index/transform issues
    return typeof document !== 'undefined'
        ? createPortal(content, document.body)
        : null;
};

export default StarDetailModal;
