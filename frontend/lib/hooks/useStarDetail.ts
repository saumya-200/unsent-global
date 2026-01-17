import { useState, useCallback, useEffect } from 'react';
import { Star, ApiError } from '../types';
import { apiClient } from '../api-client';

export const useStarDetail = (starId: string | null) => {
    const [star, setStar] = useState<(Star & { has_resonated: boolean }) | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isResonating, setIsResonating] = useState(false);
    const [error, setError] = useState<ApiError | null>(null);

    const fetchDetail = useCallback(async (id: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await apiClient.getStarDetail(id);
            setStar(response.data);
        } catch (err: any) {
            setError(err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const resonate = useCallback(async () => {
        if (!star || star.has_resonated || isResonating) return;

        setIsResonating(true);
        try {
            const response = await apiClient.resonate(star.id);
            if (response.success) {
                setStar(prev => prev ? {
                    ...prev,
                    resonance_count: response.resonance_count,
                    has_resonated: true
                } : null);
            }
        } catch (err: any) {
            // Keep error local to resonance button if needed, or propagate
            console.error("Resonance failed:", err);
        } finally {
            setIsResonating(false);
        }
    }, [star, isResonating]);

    useEffect(() => {
        if (starId) {
            fetchDetail(starId);
        } else {
            setStar(null);
        }
    }, [starId, fetchDetail]);

    return {
        star,
        isLoading,
        isResonating,
        error,
        resonate,
        refresh: () => starId && fetchDetail(starId)
    };
};
