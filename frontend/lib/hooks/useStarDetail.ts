import { useState, useCallback } from 'react';
import { Star, ApiError } from '@/lib/types';
import { apiClient } from '@/lib/api-client';

export function useStarDetail() {
    const [star, setStar] = useState<Star | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<ApiError | null>(null);
    const [hasResonated, setHasResonated] = useState(false);

    const fetchStarDetail = useCallback(async (starId: string) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await apiClient.getStarById(starId);
            setStar(response.star);
            setHasResonated(response.has_resonated || false);
        } catch (err: any) {
            setError(err);
            setStar(null);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const reset = useCallback(() => {
        setStar(null);
        setError(null);
        setHasResonated(false);
    }, []);

    return {
        star,
        isLoading,
        error,
        hasResonated,
        fetchStarDetail,
        reset
    };
}
