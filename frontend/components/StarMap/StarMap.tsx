'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Star } from '../../lib/types';
import { StarRenderer } from './StarRenderer';
import LoadingOverlay from './LoadingOverlay';
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
    const [isHoveringStar, setIsHoveringStar] = useState(false);

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
            rendererRef.current.setStars(stars);
        }
    }, [stars]);

    // Mouse Interactions
    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        if (!rendererRef.current || !canvasRef.current) return;

        const rect = canvasRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const hovered = rendererRef.current.getStarAtPosition(x, y);
        setIsHoveringStar(!!hovered);

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

    return (
        <div className={styles.container}>
            <canvas
                ref={canvasRef}
                className={`${styles.canvas} ${isHoveringStar ? styles.clickable : ''}`}
                onMouseMove={handleMouseMove}
                onClick={handleClick}
                aria-label="Celestial map of anonymous messages"
            />
            {loading && <LoadingOverlay />}
        </div>
    );
};

export default StarMap;
