import { Emotion, Star } from '../types';
import { EMOTION_COLORS, VISUAL_CONSTANTS } from '../constants';

/**
 * Maps an emotion to its assigned hex color
 */
export const getStarColor = (emotion: Emotion): string => {
    return EMOTION_COLORS[emotion] || '#FFFFFF';
};

/**
 * Calculates star size based on resonance (popularity)
 * Scale: 1.5 to 6.0
 */
export const getStarSize = (resonanceCount: number): number => {
    const baseSize = VISUAL_CONSTANTS.MIN_STAR_SIZE;
    const maxSize = VISUAL_CONSTANTS.MAX_STAR_SIZE;

    // Use logarithmic scale so high resonance doesn't grow infinitely
    const growth = Math.log10(resonanceCount + 1) * 2;
    return Math.min(baseSize + growth, maxSize);
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
