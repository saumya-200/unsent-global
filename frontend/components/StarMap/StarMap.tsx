'use client';

import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { Star, Emotion } from '../../lib/types';
import { EMOTION_COLORS } from '../../lib/constants';
import { StarRenderer } from './StarRenderer';
import LoadingOverlay from './LoadingOverlay';
import EmotionLegend from './EmotionLegend';
import styles from './StarMap.module.css';

interface StarMapProps {
    stars: Star[];
    onStarClick?: (star: Star) => void;
    onStarHover?: (star: Star | null) => void;
    loading?: boolean;
}

const StarMap: React.FC<StarMapProps> = ({
    stars,
    onStarClick,
    onStarHover,
    loading = false
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const rendererRef = useRef<StarRenderer | null>(null);
    const [hoveredStar, setHoveredStar] = useState<Star | null>(null);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [activeEmotions, setActiveEmotions] = useState<Emotion[]>([
        'joy', 'sadness', 'anger', 'fear', 'gratitude', 'regret', 'love', 'hope', 'loneliness'
    ]);

    // Derived: filtered stars
    const filteredStars = useMemo(() => {
        return stars.filter(s => activeEmotions.includes(s.emotion));
    }, [stars, activeEmotions]);

    // Derived: counts for legend
    const emotionCounts = useMemo(() => {
        return stars.reduce((acc, s) => {
            acc[s.emotion] = (acc[s.emotion] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);
    }, [stars]);

    // Initialize Renderer
    useEffect(() => {
        if (!canvasRef.current) return;

        const renderer = new StarRenderer();
        renderer.initialize(canvasRef.current);
        rendererRef.current = renderer;
        renderer.startAnimation();

        const handleResize = () => renderer.resize();
        window.addEventListener('resize', handleResize);

        return () => {
            renderer.stopAnimation();
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    // Update Stars
    useEffect(() => {
        if (rendererRef.current) {
            rendererRef.current.setStars(filteredStars);
        }
    }, [filteredStars]);

    // Mouse Interactions
    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        if (!rendererRef.current || !canvasRef.current) return;

        const rect = canvasRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        setMousePos({ x: e.clientX, y: e.clientY });

        const hovered = rendererRef.current.getStarAtPosition(x, y);
        setHoveredStar(hovered);
        rendererRef.current.setHoveredStar(hovered?.id || null);

        if (onStarHover) {
            onStarHover(hovered);
        }
    }, [onStarHover]);

    const handleClick = useCallback((e: React.MouseEvent) => {
        if (!rendererRef.current || !canvasRef.current) return;

        const rect = canvasRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const clicked = rendererRef.current.getStarAtPosition(x, y);
        if (clicked && onStarClick) {
            onStarClick(clicked);
        }
    }, [onStarClick]);

    const toggleEmotion = (emotion: Emotion) => {
        setActiveEmotions(prev =>
            prev.includes(emotion)
                ? prev.filter(e => e !== emotion)
                : [...prev, emotion]
        );
    };

    return (
        <div className={styles.container}>
            <canvas
                ref={canvasRef}
                className={`${styles.canvas} ${hoveredStar ? styles.clickable : ''}`}
                onMouseMove={handleMouseMove}
                onClick={handleClick}
                aria-label="Celestial map of anonymous messages"
            />

            {loading && <LoadingOverlay />}

            {!loading && (
                <EmotionLegend
                    activeEmotions={activeEmotions}
                    counts={emotionCounts}
                    onToggleEmotion={toggleEmotion}
                />
            )}

            {hoveredStar && (
                <div
                    className={styles.tooltip}
                    style={{ left: mousePos.x, top: mousePos.y }}
                >
                    <div
                        className={styles.tooltipEmotion}
                        style={{ color: EMOTION_COLORS[hoveredStar.emotion] }}
                    >
                        {hoveredStar.emotion}
                    </div>
                    <div className={styles.tooltipText}>
                        "{hoveredStar.message_preview}"
                    </div>
                    <div className={styles.tooltipHint}>
                        Resonance: {hoveredStar.resonance_count} • Click to read
                    </div>
                </div>
            )}
        </div>
    );
};

export default StarMap;
