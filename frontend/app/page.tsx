'use client';

import React, { useState, useCallback } from 'react';
import { StarMap } from '@/components/StarMap';
import { useStars } from '@/lib/hooks/useStars';
import { Star } from '@/lib/types';
import LoadingState from '@/components/LoadingState';
import ErrorState from '@/components/ErrorState';
import EmptyState from '@/components/EmptyState';
import Header from '@/components/Header';
import FloatingStats from '@/components/FloatingStats';
import { StarDetailModal } from '@/components/StarDetailModal';
import { SubmitModal } from '@/components/SubmitModal';
import { FAB } from '@/components/FAB';
import { useStarDetail } from '@/lib/hooks/useStarDetail';
import { useSocketEvents } from '@/lib/hooks/useSocket';
import Toast from '@/components/Toast/Toast';

export default function Home() {
    const [selectedStarId, setSelectedStarId] = useState<string | null>(null);
    const [submitModalOpen, setSubmitModalOpen] = useState(false);
    const [ownStarIds, setOwnStarIds] = useState<Set<string>>(new Set()); // Track user's own submissions
    const [socketToast, setSocketToast] = useState<{ message: string; type: 'success' | 'info' } | null>(null);

    const { stars, setStars, isLoading, error, totalCount, refresh } = useStars({
        limit: 500,
        order_by: 'created_at'
    });

    const {
        star: detailStar,
        isLoading: isDetailLoading,
        hasResonated,
        fetchStarDetail,
        reset: resetStarDetail
    } = useStarDetail();

    // --- Socket.IO Integration ---
    useSocketEvents({
        onConnect: () => {
            console.log("Connected to Real-time Stream");
        },
        onNewStar: (newStar) => {
            // Optimistically add to list
            setStars((prev) => [newStar, ...prev]);
            setSocketToast({ message: "A new star just appeared!", type: 'info' });
        },
        onResonanceUpdate: ({ star_id, resonance_count }) => {
            setStars((prev) => prev.map(s =>
                s.id === star_id ? { ...s, resonance_count } : s
            ));
        }
    });

    // Trigger fetch when selection changes
    React.useEffect(() => {
        if (selectedStarId) {
            fetchStarDetail(selectedStarId);
        } else {
            resetStarDetail();
        }
    }, [selectedStarId, fetchStarDetail, resetStarDetail]);

    // Calculate top emotion
    const emotionCounts = stars.reduce((acc, star) => {
        acc[star.emotion] = (acc[star.emotion] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const topEmotion = Object.entries(emotionCounts)
        .sort(([, a], [, b]) => b - a)[0]?.[0] || 'Neutral';

    // Calculate total resonance
    const totalResonance = stars.reduce((acc, star) => acc + (star.resonance_count || 0), 0);

    // Check if selected star is user's own (should auto-resonate)
    const isOwnStar = selectedStarId ? ownStarIds.has(selectedStarId) : false;

    // Check if any modal is open
    const anyModalOpen = !!selectedStarId || submitModalOpen;

    // Handle new star submission
    const handleSubmitSuccess = (newStar: Star) => {
        // Mark this star as user's own so they can't resonate with it
        setOwnStarIds(prev => new Set(prev).add(newStar.id));
        // No need to refresh() here as SocketIO will broadcast it back to us (and everyone else)
        // Check if we already added it via socket to avoid dupe? 
        // Actually, we should probably manually add it here for immediate feedback 
        // and let the socket handler dedup or just rely on socket for simplicity.
        // For now, let's rely on the socket event which is extremely fast locally.
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
            <Header
                totalMessages={totalCount}
                onShareClick={() => setSubmitModalOpen(true)}
            />

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
                isLoading={isDetailLoading}
                initialHasResonated={hasResonated || isOwnStar}
                isOwnStar={isOwnStar}
                onResonanceSuccess={() => {
                    // No need to refresh, socket will update counts
                }}
            />

            {/* 4. Submit Message Modal */}
            <SubmitModal
                isOpen={submitModalOpen}
                onClose={() => setSubmitModalOpen(false)}
                onSuccess={handleSubmitSuccess}
                onViewStar={(starId) => setSelectedStarId(starId)}
            />

            {/* 5. Floating Action Button (Hidden when modals open) */}
            <FAB
                onClick={() => setSubmitModalOpen(true)}
                visible={!anyModalOpen}
            />

            {/* 6. Empty State Prompt */}
            {!isLoading && !error && stars.length === 0 && <EmptyState />}

            {/* 7. Socket Toast */}
            {socketToast && (
                <Toast
                    message={socketToast.message}
                    type={socketToast.type}
                    onClose={() => setSocketToast(null)}
                />
            )}

            {/* 8. Persistence Hints / Toast overlay for silent errors */}
            {error && stars.length > 0 && (
                <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[60] bg-red-900/40 border border-red-500/50 backdrop-blur-xl px-4 py-2 rounded-lg text-red-200 text-[8px] tracking-[0.3em] uppercase animate-fade-in">
                    Lost connection to some stars. Reconnecting...
                </div>
            )}
        </main>
    );
}
