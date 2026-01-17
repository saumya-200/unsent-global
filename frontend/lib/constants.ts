import { Emotion } from './types';

/**
 * Color map for visual representation of emotions
 */
export const EMOTION_COLORS: Record<Emotion, string> = {
    joy: '#FFD700',        // Gold
    sadness: '#4A90E2',    // Blue
    anger: '#E74C3C',      // Red
    fear: '#9B59B6',       // Purple
    gratitude: '#F39C12',  // Orange
    regret: '#34495E',     // Dark gray/Slate
    love: '#E91E63',       // Pink
    hope: '#2ECC71',       // Green
    loneliness: '#7F8C8D'  // Gray
};

/**
 * Star rendering constraints
 */
export const VISUAL_CONSTANTS = {
    MIN_STAR_SIZE: 1.5,
    MAX_STAR_SIZE: 6.0,
    STAR_GLOW_INTENSITY: 0.6,
    FADE_IN_DURATION: 0.8,
    DENSITY_THRESHOLD: 1000
};

/**
 * Animation Speeds
 */
export const ANIMATION_SPEEDS = {
    ROTATION: 0.0005,
    TWINKLE: 0.02,
    HOVER: 0.2
};
