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
import { StarCompositionModal } from '@/components/StarCompositionModal';
import { IncomingRequestToast } from '@/components/IncomingRequestToast';
import { StatusToast } from '@/components/StatusToast';
import { AnimatePresence } from 'framer-motion';
import socketService from '@/lib/services/socketService';

export default function Home() {
    const { stars, isLoading, error, totalCount, refresh, addStar } = useStars({
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
    const [knotRoomId, setKnotRoomId] = React.useState<string | null>(null);
    const [showCompose, setShowCompose] = React.useState(false);

    // Request Logic
    const [incomingRequest, setIncomingRequest] = React.useState<{ id: string, message: string } | null>(null);
    const [statusToast, setStatusToast] = React.useState<{ message: string, type: 'success' | 'error' | 'info' } | null>(null);

    // Initial Socket Setup
    // Initial Socket Setup
    React.useEffect(() => {
        const socket = socketService.connect();

        // Function to reclaim stars from local storage
        const reclaimStars = () => {
            console.log("Checking for stars to reclaim...");
            try {
                const stored = localStorage.getItem('unsent_owned_stars');
                if (stored) {
                    const starIds = JSON.parse(stored);
                    if (Array.isArray(starIds)) {
                        console.log(`Found ${starIds.length} stars to reclaim:`, starIds);
                        starIds.forEach(id => {
                            socketService.claimStar(id);
                            console.log("Re-claiming star ownership:", id);
                        });
                    }
                } else {
                    console.log("No owned stars found in localStorage.");
                }
            } catch (e) {
                console.error("Failed to reclaim stars", e);
            }
        }

        // Check if already connected (e.g. fast hydration)
        if (socketService.isConnected()) {
            reclaimStars();
        }

        // Always listen for connect (re-connects)
        socketService.onConnected(() => {
            console.log("Socket connected event fired.");
            reclaimStars();
        });

        // Listen for requests (Owner)
        socketService.onIncomingRequest((data) => {
            console.log("Received request:", data);
            setIncomingRequest({ id: data.request_id, message: "Someone resonates with your star." });
        });

        // Listen for rejection (Requester)
        socketService.onRequestRejected((data) => {
            setStatusToast({ message: data.message, type: 'error' });
        });

        // Listen for Knot Session Start (Both)
        socketService.onKnotStarted((data) => {
            console.log("Knot started:", data);
            if (data.star_id && data.room_id) {
                setKnotStarId(data.star_id);
                setKnotRoomId(data.room_id);
                setShowKnotSession(true);
                // Clear any other states
                setIncomingRequest(null);
                setSelectedStar(null);
                setStatusToast({ message: "Connection established. Entering Knot...", type: 'success' });
            }
        });

        // Listen for Errors (e.g. self-connection)
        socketService.onError((data) => {
            setStatusToast({ message: data.message, type: 'error' });
        });

        return () => {
            socketService.disconnect();
        };
    }, []);

    const handleStarClick = (star: Star) => {
        setSelectedStar(star);
    };

    // User 2: Clicks Connect on StarDetail
    const handleEnterKnot = (starId: string) => {
        // Request connection
        socketService.requestConnection(starId);
        // Show immediate feedback
        setStatusToast({
            message: "Request sent. Waiting for them to accept...",
            type: 'info'
        });
        setSelectedStar(null); // Close modal so they can see the map/toasts
    };

    // User 1: Accepts Request
    const handleAcceptRequest = () => {
        if (incomingRequest) {
            socketService.acceptRequest(incomingRequest.id);
            setIncomingRequest(null);
            // Wait for onKnotStarted to trigger transition
        }
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
                onShareClick={() => setShowCompose(true)}
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
            <AnimatePresence>
                {/* Status Toasts (Errors/Info) */}
                {statusToast && (
                    <StatusToast
                        message={statusToast.message}
                        type={statusToast.type}
                        onClose={() => setStatusToast(null)}
                    />
                )}

                {/* Request Toast */}
                {incomingRequest && (
                    <IncomingRequestToast
                        message={incomingRequest.message}
                        onAccept={handleAcceptRequest}
                        onReject={() => {
                            socketService.rejectRequest(incomingRequest.id);
                            setIncomingRequest(null);
                        }}
                    />
                )}

                {selectedStar && (
                    <StarDetailModal
                        key="detail-modal"
                        star={selectedStar}
                        onClose={() => setSelectedStar(null)}
                        onEnterKnot={handleEnterKnot}
                    />
                )}

                {showCompose && (
                    <StarCompositionModal
                        key="compose-modal"
                        onClose={() => setShowCompose(false)}
                        onSuccess={() => {
                            refresh();
                            // Important: Claim the star we just made!
                            // We don't have the ID here easily without return.
                            // Handled inside Modal? Or Modal returns data?
                        }}
                    />
                )}

                {showKnotSession && knotStarId && knotRoomId && (
                    <KnotSession
                        key="knot-session"
                        starId={knotStarId}
                        roomId={knotRoomId}
                        onExit={() => {
                            setShowKnotSession(false);
                            setKnotStarId(null);
                            setKnotRoomId(null);
                        }}
                    />
                )}
            </AnimatePresence>
        </main>
    );
}
