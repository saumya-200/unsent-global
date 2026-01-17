import { Emotion } from './types';

/**
 * Color map for visual representation of emotions
 */
export const EMOTION_COLORS: Record<Emotion, string> = {
    joy: '#FFD700',        // Bright gold (warm, radiant)
    sadness: '#4A90E2',    // Deep blue (melancholic)
    anger: '#E74C3C',      // Vibrant red (intense)
    fear: '#9B59B6',       // Rich purple (ominous)
    gratitude: '#F39C12',  // Warm orange (thankful)
    regret: '#34495E',     // Cool gray-blue (somber)
    love: '#E91E63',       // Bright pink (passionate)
    hope: '#2ECC71',       // Fresh green (optimistic)
    loneliness: '#7F8C8D'  // Muted gray (isolated)
};

export const EMOTION_METADATA: Record<Emotion, { label: string, description: string, gradient: string[] }> = {
    joy: { label: 'Joy', description: 'Happiness and delight', gradient: ['#FFD700', '#FFA500'] },
    sadness: { label: 'Sadness', description: 'Grief and loss', gradient: ['#4A90E2', '#1E3C72'] },
    anger: { label: 'Anger', description: 'Rage and frustration', gradient: ['#E74C3C', '#C0392B'] },
    fear: { label: 'Fear', description: 'Anxiety and worry', gradient: ['#9B59B6', '#8E44AD'] },
    gratitude: { label: 'Gratitude', description: 'Appreciation and thanks', gradient: ['#F39C12', '#E67E22'] },
    regret: { label: 'Regret', description: "Remorse and 'what ifs'", gradient: ['#34495E', '#2C3E50'] },
    love: { label: 'Love', description: 'Affection and deep care', gradient: ['#E91E63', '#C2185B'] },
    hope: { label: 'Hope', description: 'Optimism and belief', gradient: ['#2ECC71', '#27AE60'] },
    loneliness: { label: 'Loneliness', description: 'Isolation and longing', gradient: ['#7F8C8D', '#95A5A6'] }
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
