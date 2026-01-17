import { Star } from '../../lib/types';
import { RenderedStar } from './types';
import { calculateStarPositions, getTwinkleOpacity, isPointInStar } from './utils';
import { getResonanceSize } from '../../lib/utils/star-mapper';

export class StarRenderer {
    private canvas: HTMLCanvasElement | null = null;
    private ctx: CanvasRenderingContext2D | null = null;
    private renderedStars: RenderedStar[] = [];
    private animationId: number | null = null;
    private dpr: number = 1;
    private hoveredStarId: string | null = null;

    constructor() {
        if (typeof window !== 'undefined') {
            this.dpr = window.devicePixelRatio || 1;
        }
    }

    public initialize(canvas: HTMLCanvasElement): void {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d', { alpha: false }); // Performance boost: no alpha for background
        this.resize();
    }

    public setStars(stars: Star[]): void {
        if (!this.canvas) return;
        this.renderedStars = calculateStarPositions(
            stars,
            this.canvas.width / this.dpr,
            this.canvas.height / this.dpr
        );
    }

    public resize(): void {
        if (!this.canvas || !this.ctx) return;

        const width = window.innerWidth;
        const height = window.innerHeight;

        // Scale canvas for high DPI
        this.canvas.width = width * this.dpr;
        this.canvas.height = height * this.dpr;
        this.canvas.style.width = `${width}px`;
        this.canvas.style.height = `${height}px`;

        this.ctx.scale(this.dpr, this.dpr);

        // Recalculate star positions with new dimensions
        if (this.renderedStars.length > 0) {
            this.renderedStars = calculateStarPositions(this.renderedStars, width, height);
        }
    }

    public startAnimation(): void {
        const animate = (time: number) => {
            this.render(time);
            this.animationId = requestAnimationFrame(animate);
        };
        this.animationId = requestAnimationFrame(animate);
    }

    public setHoveredStar(id: string | null): void {
        this.hoveredStarId = id;
    }

    public stopAnimation(): void {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }

    private render(time: number): void {
        if (!this.ctx || !this.canvas) return;

        const width = this.canvas.width / this.dpr;
        const height = this.canvas.height / this.dpr;

        // 1. Draw Background Depth
        this.drawBackground(width, height);

        // 2. Draw Stars
        this.renderedStars.forEach(star => {
            const isHovered = star.id === this.hoveredStarId;
            const opacity = getTwinkleOpacity(time, star.twinklePhase);
            this.drawStar(star, opacity, isHovered);
        });
    }

    private drawBackground(width: number, height: number): void {
        if (!this.ctx) return;

        // Create subtle radial gradient from center
        const bgGrad = this.ctx.createRadialGradient(
            width / 2, height / 2, 0,
            width / 2, height / 2, Math.max(width, height)
        );
        bgGrad.addColorStop(0, '#0a0a14'); // Very dark blue at center
        bgGrad.addColorStop(1, '#050505'); // Deep black at edges

        this.ctx.fillStyle = bgGrad;
        this.ctx.fillRect(0, 0, width, height);

        // Subtle noise for texture (every 4th frame for perf)
        if (Math.random() > 0.9) {
            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.015)';
            for (let i = 0; i < 100; i++) {
                this.ctx.fillRect(Math.random() * width, Math.random() * height, 1, 1);
            }
        }
    }

    private drawStar(star: RenderedStar, opacity: number, isHovered: boolean = false): void {
        if (!this.ctx) return;

        const { core, glow } = getResonanceSize(star.resonance_count);
        const starOpacity = isHovered ? 1.0 : opacity;
        const finalGlow = isHovered ? glow * 1.5 : glow;

        this.ctx.save();

        // 1. Outer Bloom (Large, very faint)
        this.ctx.globalAlpha = starOpacity * 0.15;
        const outerGlow = this.ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, finalGlow * 2);
        outerGlow.addColorStop(0, star.color);
        outerGlow.addColorStop(1, 'transparent');
        this.ctx.fillStyle = outerGlow;
        this.ctx.beginPath();
        this.ctx.arc(star.x, star.y, finalGlow * 2, 0, Math.PI * 2);
        this.ctx.fill();

        // 2. Mid Glow (Standard glow)
        this.ctx.globalAlpha = starOpacity * 0.4;
        const midGlow = this.ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, finalGlow);
        midGlow.addColorStop(0, star.color);
        midGlow.addColorStop(0.5, star.color + '88'); // Hex with alpha
        midGlow.addColorStop(1, 'transparent');
        this.ctx.fillStyle = midGlow;
        this.ctx.beginPath();
        this.ctx.arc(star.x, star.y, finalGlow, 0, Math.PI * 2);
        this.ctx.fill();

        // 3. Core Pulse (Brighter center)
        this.ctx.globalAlpha = starOpacity;
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.beginPath();
        this.ctx.arc(star.x, star.y, core, 0, Math.PI * 2);
        this.ctx.fill();

        // 4. Inner Glow (Small, bright color fringe)
        this.ctx.globalAlpha = 0.5;
        this.ctx.strokeStyle = star.color;
        this.ctx.lineWidth = 0.5;
        this.ctx.stroke();

        this.ctx.restore();
    }

    public getStarAtPosition(x: number, y: number): RenderedStar | null {
        // Check backwards to hit top-most stars first if overlapping
        for (let i = this.renderedStars.length - 1; i >= 0; i--) {
            if (isPointInStar(x, y, this.renderedStars[i])) {
                return this.renderedStars[i];
            }
        }
        return null;
    }
}
