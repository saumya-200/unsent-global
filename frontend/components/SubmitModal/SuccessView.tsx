'use client';

import React from 'react';
import { Star, Emotion } from '@/lib/types';
import { CheckCircle, MapPin, PenLine } from 'lucide-react';
import styles from './SuccessView.module.css';

interface SuccessViewProps {
    star: Star;
    onClose: () => void;
    onShareAnother: () => void;
    onViewStar?: (starId: string) => void;
}

const emotionEmojis: Record<Emotion, string> = {
    joy: '😊',
    sadness: '😢',
    anger: '😠',
    fear: '😨',
    gratitude: '🙏',
    regret: '😔',
    love: '❤️',
    hope: '🌟',
    loneliness: '🌙',
};

const SuccessView: React.FC<SuccessViewProps> = ({ star, onClose, onShareAnother, onViewStar }) => {
    const handleViewOnMap = () => {
        if (onViewStar) {
            onViewStar(star.id);
        }
        onClose();
    };
    return (
        <div className={styles.container}>
            {/* Success Icon */}
            <div className={styles.iconWrapper}>
                <CheckCircle className="w-10 h-10 text-emerald-400" />
            </div>

            {/* Message */}
            <h3 className={styles.title}>Your star has been added to the constellation</h3>

            {/* Emotion Badge */}
            <div className={styles.emotionBadge}>
                <span className={styles.emoji}>{emotionEmojis[star.emotion]}</span>
                <div>
                    <span className={styles.emotionLabel}>Detected Frequency</span>
                    <span className={styles.emotionValue}>{star.emotion}</span>
                </div>
            </div>

            {/* Resonance Info */}
            <p className={styles.resonanceInfo}>
                0 others have felt this <span className={styles.highlight}>(so far)</span>
            </p>

            {/* Action Buttons */}
            <div className={styles.actions}>
                <button onClick={handleViewOnMap} className={styles.viewButton}>
                    <MapPin className="w-4 h-4" />
                    <span>View on Map</span>
                </button>
                <button onClick={onShareAnother} className={styles.shareButton}>
                    <PenLine className="w-4 h-4" />
                    <span>Share Another</span>
                </button>
            </div>
        </div>
    );
};

export default SuccessView;
