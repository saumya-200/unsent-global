'use client';

import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { Star, Emotion } from '@/lib/types';
import EmotionIcon from './EmotionIcon';
import MessageContent from './MessageContent';
import ResonanceButton from './ResonanceButton';
import SuccessAnimation from './SuccessAnimation';
import Toast from '@/components/Toast/Toast';
import { useResonance } from '@/lib/hooks/useResonance';
import styles from './StarDetailModal.module.css';

interface StarDetailModalProps {
    star: Star | null;
    isOpen: boolean;
    onClose: () => void;
    isLoading?: boolean;
    initialHasResonated?: boolean;
    isOwnStar?: boolean;  // If true, button is locked as "You resonated"
    onResonanceSuccess?: (newCount: number) => void;
}

const StarDetailModal: React.FC<StarDetailModalProps> = ({
    star,
    isOpen,
    onClose,
    isLoading = false,
    initialHasResonated = false,
    isOwnStar = false,
    onResonanceSuccess
}) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const [localResonanceCount, setLocalResonanceCount] = useState(0);
    const [hasResonated, setHasResonated] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

    const { resonate, unresonate, isResonating, successAnimation } = useResonance();

    // Sync initial state when star changes
    useEffect(() => {
        if (star) {
            setLocalResonanceCount(star.resonance_count ?? 0);
            setHasResonated(initialHasResonated);
        }
    }, [star, initialHasResonated]);

    // Handle ESC key and Body scroll lock
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };

        if (isOpen) {
            window.addEventListener('keydown', handleEsc);
            document.body.style.overflow = 'hidden';
            // Focus management
            setTimeout(() => modalRef.current?.focus(), 100);
        }

        return () => {
            window.removeEventListener('keydown', handleEsc);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    const handleToggleResonate = async () => {
        if (!star) return;

        // If it's user's own star, don't allow toggling
        if (isOwnStar) return;

        if (hasResonated) {
            // Un-resonate
            const result = await unresonate(star.id);

            if (result.success) {
                const newCount = result.newResonanceCount ?? Math.max(0, localResonanceCount - 1);
                setLocalResonanceCount(newCount);
                setHasResonated(false);
                setToast({ message: "Resonance withdrawn", type: 'info' });
                if (onResonanceSuccess) onResonanceSuccess(newCount);
            } else if (result.error) {
                setToast({ message: "Failed to withdraw resonance", type: 'error' });
            }
        } else {
            // Resonate
            const result = await resonate(star.id);

            if (result.success) {
                const newCount = result.newResonanceCount ?? (localResonanceCount + 1);
                setLocalResonanceCount(newCount);
                setHasResonated(true);
                if (onResonanceSuccess) onResonanceSuccess(newCount);
            } else if (result.alreadyResonated) {
                setToast({ message: "You've already felt this one", type: 'info' });
                setHasResonated(true);
            } else if (result.error) {
                setToast({ message: "Lost connection to the stars. Try again?", type: 'error' });
            }
        }
    };

    if (!isOpen) return null;

    const content = (
        <>
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
                    tabIndex={-1}
                >
                    {/* Success Animation Overlay */}
                    {star && <SuccessAnimation active={successAnimation} emotion={star.emotion} />}

                    {/* Glow Effects */}
                    <div className={styles.glowOuter} />
                    <div className={styles.glowInner} />

                    {/* Header */}
                    <div className={styles.header}>
                        {star && <EmotionIcon emotion={star.emotion} />}
                        {!star && <div className="w-8 h-8 rounded-full bg-white/5 animate-pulse" />}
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
                        {isLoading || !star ? (
                            <div className={styles.loadingSkeleton}>
                                <div className={styles.skeletonLine} />
                                <div className={styles.skeletonLine} />
                                <div className={styles.skeletonLineShort} />
                            </div>
                        ) : (
                            <MessageContent
                                message={star.message_text || ""}
                                language={star.language}
                                emotion={star.emotion}
                            />
                        )}
                    </div>

                    {/* Footer */}
                    <div className={styles.footer}>
                        <div className="relative">
                            {star && <SuccessAnimation active={successAnimation} emotion={star.emotion} />}
                            {star ? (
                                <ResonanceButton
                                    resonanceCount={localResonanceCount}
                                    hasResonated={hasResonated}
                                    onResonate={handleToggleResonate}
                                    isLoading={isResonating}
                                    disabled={isResonating || isOwnStar}
                                />
                            ) : (
                                <div className="h-14 w-48 rounded-full bg-white/5 animate-pulse" />
                            )}
                        </div>

                        <p className={styles.timestamp}>
                            {star ? `Manifested on ${new Date(star.created_at).toLocaleDateString()}` : 'Summoning original thought...'}
                        </p>
                    </div>
                </div>
            </div>

            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
        </>
    );

    return typeof document !== 'undefined'
        ? createPortal(content, document.body)
        : null;
};

export default StarDetailModal;
