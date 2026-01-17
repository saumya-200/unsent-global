import { Star } from '../../lib/types';

/**
 * Star metadata extended with canvas-specific rendering properties
 */
export interface RenderedStar extends Star {
    x: number;             // Calculated canvas x position
    y: number;             // Calculated canvas y position
    size: number;          // Rendered size in pixels
    color: string;         // Hex color
    twinklePhase: number;  // Random phase offset for twinkle animation
    hitRadius: number;     // Interactive hit area radius
}

/**
 * Internal state for the animation loop
 */
export interface AnimationState {
    lastTime: number;
    hoveredStarId: string | null;
}
