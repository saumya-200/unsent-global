'use client';

import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Sparkles, Send, AlertCircle } from 'lucide-react';
import { Star } from '@/lib/types';
import { useStarSubmission } from '@/lib/hooks/useStarSubmission';
import SuccessView from './SuccessView';
import PrivacyNotice from './PrivacyNotice';
import styles from './SubmitModal.module.css';

interface SubmitModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: (star: Star) => void;
    onViewStar?: (starId: string) => void;  // Navigate to star on map
}

const MAX_CHARS = 1000;

const SubmitModal: React.FC<SubmitModalProps> = ({ isOpen, onClose, onSuccess, onViewStar }) => {
    const [message, setMessage] = useState('');
    const [showConfirmClose, setShowConfirmClose] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const { submitMessage, isSubmitting, error, submittedStar, reset, validate } = useStarSubmission();

    // Auto-focus textarea
    useEffect(() => {
        if (isOpen && textareaRef.current) {
            setTimeout(() => textareaRef.current?.focus(), 100);
        }
    }, [isOpen]);

    // ESC key handler
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                if (message.trim().length > 0 && !submittedStar) {
                    setShowConfirmClose(true);
                } else {
                    handleClose();
                }
            }
        };

        if (isOpen) {
            window.addEventListener('keydown', handleEsc);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            window.removeEventListener('keydown', handleEsc);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, message, submittedStar]);

    const handleClose = () => {
        setMessage('');
        setShowConfirmClose(false);
        reset();
        onClose();
    };

    const handleSubmit = async () => {
        const validation = validate(message);
        if (!validation.valid) return;

        const star = await submitMessage(message);
        if (star && onSuccess) {
            onSuccess(star);
        }
    };

    const handleShareAnother = () => {
        setMessage('');
        reset();
        textareaRef.current?.focus();
    };

    const validation = validate(message);
    const charCount = message.length;
    const isNearLimit = charCount > 950;

    if (!isOpen) return null;

    const content = (
        <div className={styles.wrapper}>
            <div className={styles.backdrop} onClick={() => message.trim() ? setShowConfirmClose(true) : handleClose()} />

            <div className={styles.container}>
                {/* Glow Effects */}
                <div className={styles.glowOuter} />
                <div className={styles.glowInner} />

                {/* Header */}
                <div className={styles.header}>
                    <div className={styles.headerContent}>
                        <Sparkles className="w-5 h-5 text-purple-400" />
                        <div>
                            <h2 className={styles.title}>Share Your Unsent Message</h2>
                            <p className={styles.subtitle}>Anonymous. Forever. Felt by others.</p>
                        </div>
                    </div>
                    <button onClick={() => message.trim() ? setShowConfirmClose(true) : handleClose()} className={styles.closeButton}>
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                {submittedStar ? (
                    <SuccessView
                        star={submittedStar}
                        onClose={handleClose}
                        onShareAnother={handleShareAnother}
                        onViewStar={onViewStar}
                    />
                ) : (
                    <>
                        {/* Textarea */}
                        <div className={styles.textareaContainer}>
                            <textarea
                                ref={textareaRef}
                                value={message}
                                onChange={(e) => setMessage(e.target.value.slice(0, MAX_CHARS))}
                                placeholder="Write the words you never sent..."
                                className={styles.textarea}
                                aria-label="Your unsent message"
                                disabled={isSubmitting}
                            />
                            <div className={`${styles.charCount} ${isNearLimit ? styles.charCountWarning : ''}`}>
                                {charCount} / {MAX_CHARS}
                            </div>
                        </div>

                        {/* Error Display */}
                        {error && (
                            <div className={styles.error}>
                                <AlertCircle className="w-4 h-4" />
                                <span>{error.error || 'Something went wrong. Please try again.'}</span>
                            </div>
                        )}

                        {/* Privacy Notice */}
                        <PrivacyNotice />

                        {/* Submit Button */}
                        <button
                            onClick={handleSubmit}
                            disabled={!validation.valid || isSubmitting}
                            className={styles.submitButton}
                        >
                            {isSubmitting ? (
                                <>
                                    <div className={styles.spinner} />
                                    <span>Sending to the stars...</span>
                                </>
                            ) : (
                                <>
                                    <Send className="w-4 h-4" />
                                    <span>Release into the Constellation</span>
                                </>
                            )}
                        </button>
                    </>
                )}

                {/* Confirm Close Dialog */}
                {showConfirmClose && (
                    <div className={styles.confirmOverlay}>
                        <div className={styles.confirmDialog}>
                            <p>Your message hasn't been sent yet. Are you sure you want to close?</p>
                            <div className={styles.confirmButtons}>
                                <button onClick={() => setShowConfirmClose(false)} className={styles.confirmCancel}>
                                    Keep Writing
                                </button>
                                <button onClick={handleClose} className={styles.confirmDiscard}>
                                    Discard
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );

    return typeof document !== 'undefined' ? createPortal(content, document.body) : null;
};

export default SubmitModal;
