import React from 'react';
import { Emotion } from '../../lib/types';
import { EMOTION_COLORS, EMOTION_METADATA } from '../../lib/constants';
import styles from './StarMap.module.css';

interface EmotionLegendProps {
    activeEmotions: Emotion[];
    counts: Record<string, number>;
    onToggleEmotion: (emotion: Emotion) => void;
}

const EmotionLegend: React.FC<EmotionLegendProps> = ({
    activeEmotions,
    counts,
    onToggleEmotion
}) => {
    const emotions = Object.keys(EMOTION_COLORS) as Emotion[];

    return (
        <div className={styles.legend}>
            <h3 className={styles.legendTitle}>EMOTIONS</h3>
            <div className={styles.legendList}>
                {emotions.map(emotion => {
                    const isActive = activeEmotions.includes(emotion);
                    const metadata = EMOTION_METADATA[emotion];
                    const color = EMOTION_COLORS[emotion];

                    return (
                        <button
                            key={emotion}
                            className={`${styles.legendItem} ${isActive ? styles.legendItemActive : ''}`}
                            onClick={() => onToggleEmotion(emotion)}
                            title={metadata.description}
                        >
                            <span
                                className={styles.legendDot}
                                style={{ backgroundColor: color, boxShadow: `0 0 8px ${color}` }}
                            />
                            <span className={styles.legendLabel}>{metadata.label}</span>
                            <span className={styles.legendCount}>{counts[emotion] || 0}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default EmotionLegend;
