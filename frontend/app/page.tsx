'use client';

import React from 'react';
import { StarMap } from '@/components/StarMap';
import { useStars } from '@/lib/hooks/useStars';
import { Star } from '@/lib/types';
import LoadingState from '@/components/LoadingState';
import ErrorState from '@/components/ErrorState';
import EmptyState from '@/components/EmptyState';
import Header from '@/components/Header';
import FloatingStats from '@/components/FloatingStats';
import { StarDetailModal } from '@/components/StarMap/StarDetailModal';
import { KnotSession } from '@/components/knot/KnotSession';

export default function Home() {
    const { stars, isLoading, error, totalCount, refresh } = useStars({
        limit: 500,
        order_by: 'created_at'
    });

    // Calculate top emotion
    const emotionCounts = stars.reduce((acc, star) => {
        acc[star.emotion] = (acc[star.emotion] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const topEmotion = Object.entries(emotionCounts)
        .sort(([, a], [, b]) => b - a)[0]?.[0] || 'Neutral';

    // Calculate total resonance
    const totalResonance = stars.reduce((acc, star) => acc + (star.resonance_count || 0), 0);

    // State for Modal and Knot
    const [selectedStar, setSelectedStar] = React.useState<Star | null>(null);
    const [showKnotSession, setShowKnotSession] = React.useState(false);
    const [knotStarId, setKnotStarId] = React.useState<string | null>(null);

    const handleStarClick = (star: Star) => {
        setSelectedStar(star);
    };

    const handleEnterKnot = (starId: string) => {
        setKnotStarId(starId);
        setShowKnotSession(true);
        setSelectedStar(null); // Close modal
    };

    if (isLoading && stars.length === 0) {
        return <LoadingState />;
    }

    if (error && stars.length === 0) {
        return <ErrorState message={error.error} onRetry={refresh} />;
    }

    return (
        <main className="relative w-full h-screen bg-black overflow-hidden flex flex-col items-center justify-center">
            {/* 1. Fixed Layout Overlays */}
            <Header totalMessages={totalCount} />

            <FloatingStats
                totalCount={totalCount}
                totalResonance={totalResonance}
                topEmotion={topEmotion}
            />

            {/* 2. Interactive Star Map (Absolute back layer) */}
            <div className="absolute inset-0 z-0 h-full w-full">
                <StarMap
                    stars={stars}
                    loading={isLoading && stars.length === 0}
                    onStarClick={handleStarClick}
                />
            </div>

            {/* 3. Empty State Prompt */}
            {!isLoading && !error && stars.length === 0 && <EmptyState />}

            {/* 4. Persistence Hints / Toast overlay for silent errors */}
            {error && stars.length > 0 && (
                <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[60] bg-red-900/40 border border-red-500/50 backdrop-blur-xl px-4 py-2 rounded-lg text-red-200 text-[8px] tracking-[0.3em] uppercase animate-fade-in">
                    Lost connection to some stars. Reconnecting...
                </div>
            )}

            {/* 5. Modals & Overlays */}
            {selectedStar && (
                <StarDetailModal
                    star={selectedStar}
                    onClose={() => setSelectedStar(null)}
                    onEnterKnot={handleEnterKnot}
                />
            )}

            {showKnotSession && knotStarId && (
                <KnotSession
                    starId={knotStarId}
                    onExit={() => {
                        setShowKnotSession(false);
                        setKnotStarId(null);
                    }}
                />
            )}
        </main>
    );
}
