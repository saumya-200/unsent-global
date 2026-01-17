'use client';

import React, { useState } from 'react';
import { StarMap } from '@/components/StarMap';
import { useStars } from '@/lib/hooks/useStars';
import { Star, Emotion } from '@/lib/types';
import LoadingState from '@/components/LoadingState';
import ErrorState from '@/components/ErrorState';
import EmptyState from '@/components/EmptyState';
import Header from '@/components/Header';
import FloatingStats from '@/components/FloatingStats';
import { StarDetailModal } from '@/components/StarDetailModal';
import { useStarDetail } from '@/lib/hooks/useStarDetail';

export default function Home() {
    const [selectedStarId, setSelectedStarId] = useState<string | null>(null);
    const { stars, isLoading, error, totalCount, refresh } = useStars({
        limit: 500,
        order_by: 'created_at'
    });

    const {
        star: detailStar,
        isLoading: isDetailLoading,
        isResonating,
        resonate
    } = useStarDetail(selectedStarId);

    // Calculate top emotion
    const emotionCounts = stars.reduce((acc, star) => {
        acc[star.emotion] = (acc[star.emotion] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const topEmotion = Object.entries(emotionCounts)
        .sort(([, a], [, b]) => b - a)[0]?.[0] || 'Neutral';

    // Calculate total resonance
    const totalResonance = stars.reduce((acc, star) => acc + (star.resonance_count || 0), 0);

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
                    onStarClick={(star: Star) => {
                        setSelectedStarId(star.id);
                    }}
                />
            </div>

            {/* 3. Star Details Overlay */}
            <StarDetailModal
                star={detailStar}
                isOpen={!!selectedStarId}
                onClose={() => setSelectedStarId(null)}
                onResonate={resonate}
                isResonating={isResonating}
                isLoading={isDetailLoading}
            />

            {/* 4. Empty State Prompt */}
            {!isLoading && !error && stars.length === 0 && <EmptyState />}

            {/* 5. Persistence Hints / Toast overlay for silent errors */}
            {error && stars.length > 0 && (
                <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[60] bg-red-900/40 border border-red-500/50 backdrop-blur-xl px-4 py-2 rounded-lg text-red-200 text-[8px] tracking-[0.3em] uppercase animate-fade-in">
                    Lost connection to some stars. Reconnecting...
                </div>
            )}
        </main>
    );
}
