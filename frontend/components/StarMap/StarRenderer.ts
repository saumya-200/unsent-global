import { Star } from '../../lib/types';
import { RenderedStar } from './types';
import { calculateStarPositions, getTwinkleOpacity, isPointInStar } from './utils';

export class StarRenderer {
    private canvas: HTMLCanvasElement | null = null;
    private ctx: CanvasRenderingContext2D | null = null;
    private renderedStars: RenderedStar[] = [];
    private animationId: number | null = null;
    private dpr: number = 1;

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

    public stopAnimation(): void {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }

    private render(time: number): void {
        if (!this.ctx || !this.canvas) return;

        const width = this.canvas.width / this.dpr;
        const height = this.canvas.height / this.dpr;

        // Draw background
        this.ctx.fillStyle = '#050505';
        this.ctx.fillRect(0, 0, width, height);

        // Draw Stars
        this.renderedStars.forEach(star => {
            const opacity = getTwinkleOpacity(time, star.twinklePhase);
            this.drawStar(star, opacity);
        });
    }

    private drawStar(star: RenderedStar, opacity: number): void {
        if (!this.ctx) return;

        this.ctx.save();
        this.ctx.globalAlpha = opacity;

        // 1. Draw Glow (Outer)
        const gradient = this.ctx.createRadialGradient(
            star.x, star.y, 0,
            star.x, star.y, star.size * 4
        );
        gradient.addColorStop(0, star.color);
        gradient.addColorStop(1, 'transparent');

        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        this.ctx.arc(star.x, star.y, star.size * 4, 0, Math.PI * 2);
        this.ctx.fill();

        // 2. Draw Core (Bright Center)
        this.ctx.globalAlpha = 1.0;
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.beginPath();
        this.ctx.arc(star.x, star.y, star.size / 2, 0, Math.PI * 2);
        this.ctx.fill();

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
