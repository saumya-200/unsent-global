import { Emotion, Star } from '../types';
import { EMOTION_COLORS, VISUAL_CONSTANTS } from '../constants';

/**
 * Maps an emotion to its assigned hex color
 */
export const getStarColor = (emotion: Emotion): string => {
    return EMOTION_COLORS[emotion] || '#FFFFFF';
};

/**
 * Calculates star core and glow size based on resonance (popularity)
 */
export const getResonanceSize = (resonanceCount: number): { core: number, glow: number } => {
    if (resonanceCount <= 5) return { core: 1.5, glow: 12 };
    if (resonanceCount <= 10) return { core: 2.0, glow: 16 };
    if (resonanceCount <= 20) return { core: 2.5, glow: 20 };
    return { core: 3.0, glow: 24 };
};

/**
 * Calculates star size based on resonance (popularity)
 * Scale: 1.5 to 6.0 (legacy)
 */
export const getStarSize = (resonanceCount: number): number => {
    const { core } = getResonanceSize(resonanceCount);
    return core;
};

/**
 * Returns gradient colors for an emotion
 */
export const getEmotionGradient = (emotion: Emotion): string[] => {
    const { EMOTION_METADATA } = require('../constants');
    return EMOTION_METADATA[emotion]?.gradient || ['#FFFFFF', '#CCCCCC'];
};

/**
 * Calculates brightness based on resonance
 */
export const getStarBrightness = (resonanceCount: number): number => {
    return Math.min(0.3 + (resonanceCount / 100), 1.0);
};

/**
 * Generates semi-random 3D positions in a spherical or organic field
 */
export const calculateStarPosition = (index: number, total: number) => {
    // Using a Fibonacci sphere or similar distribution for even spread
    // For simplicity, we'll use a scattered volume for the "Galaxy" feel

    const phi = Math.acos(-1 + (2 * index) / total);
    const theta = Math.sqrt(total * Math.PI) * phi;

    // Add randomness to distance from center to give depth
    const radius = 50 + Math.random() * 100;

    return {
        x: radius * Math.cos(theta) * Math.sin(phi),
        y: radius * Math.sin(theta) * Math.sin(phi),
        z: radius * Math.cos(phi)
    };
};
