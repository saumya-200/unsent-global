import { Star } from '../../lib/types';
import { RenderedStar } from './types';
import { getStarColor, getStarSize } from '../../lib/utils/star-mapper';

/**
 * Distributes stars evenly across the canvas using a jittered grid
 * or pseudo-random distribution that is deterministic based on ID
 */
export const calculateStarPositions = (
    stars: Star[],
    width: number,
    height: number
): RenderedStar[] => {
    const margin = 50; // Keep stars away from extreme edges
    const useableWidth = width - margin * 2;
    const useableHeight = height - margin * 2;

    return stars.map((star) => {
        // We use a simple hash of the ID to get deterministic but "random" positions
        // This ensures a star doesn't jump when the list refreshes
        const hash = star.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const idSeed = hash / 1000;

        const x = margin + (idSeed * 1337 % 1) * useableWidth;
        const y = margin + (idSeed * 7331 % 1) * useableHeight;
        const size = getStarSize(star.resonance_count);

        return {
            ...star,
            x,
            y,
            size,
            color: getStarColor(star.emotion),
            twinklePhase: Math.random() * Math.PI * 2, // Smooth start
            hitRadius: Math.max(size * 3, 15) // Easier to click than to see
        };
    });
};

/**
 * Calculates current opacity for the twinkle effect
 * Returns value between 0.6 and 1.0
 */
export const getTwinkleOpacity = (time: number, phase: number): number => {
    const speed = 0.002;
    const variation = Math.sin(time * speed + phase);
    return 0.8 + variation * 0.2;
};

/**
 * Simple circle hit detection
 */
export const isPointInStar = (
    px: number,
    py: number,
    star: RenderedStar
): boolean => {
    const dx = px - star.x;
    const dy = py - star.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance <= star.hitRadius;
};
