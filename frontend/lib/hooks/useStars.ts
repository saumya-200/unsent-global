import { useState, useCallback, useEffect } from 'react';
import { Star, GetStarsParams, ApiError, Emotion } from '../types';
import { apiClient } from '../api-client';

export const useStars = (initialParams: GetStarsParams = {}) => {
    const [stars, setStars] = useState<Star[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<ApiError | null>(null);
    const [pagination, setPagination] = useState({
        total: 0,
        offset: 0,
        limit: 100,
        has_more: false,
    });

    const fetchStars = useCallback(async (params: GetStarsParams = {}, append = false) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await apiClient.getStars(params);
            const newStars = response.data.stars;

            setStars(prev => {
                if (!append) return newStars;

                // Deduplicate
                const starMap = new Map();
                prev.forEach(s => starMap.set(s.id, s));
                newStars.forEach(s => starMap.set(s.id, s));

                // Maintain a reasonable limit for performance
                const merged = Array.from(starMap.values());
                return merged.slice(-1000);
            });

            setPagination(response.data.pagination);
        } catch (err: any) {
            setError(err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Load more data
    const loadMore = useCallback(() => {
        if (pagination.has_more && !isLoading) {
            const nextOffset = pagination.offset + pagination.limit;
            fetchStars({ ...initialParams, offset: nextOffset }, true);
        }
    }, [pagination, isLoading, fetchStars, initialParams]);

    // Refresh current view
    const refresh = useCallback(() => {
        fetchStars(initialParams, false);
    }, [fetchStars, initialParams]);

    // Initial fetch
    useEffect(() => {
        fetchStars(initialParams);
    }, [initialParams.emotion, initialParams.order_by]);

    // Optional Polling (every 30 seconds)
    useEffect(() => {
        const interval = setInterval(() => {
            // Only refresh if not already loading and on page 1
            if (!isLoading && pagination.offset === 0) {
                refresh();
            }
        }, 30000);

        return () => clearInterval(interval);
    }, [isLoading, pagination.offset, refresh]);

    return {
        stars,
        setStars,
        isLoading,
        error,
        hasMore: pagination.has_more,
        loadMore,
        refresh,
        totalCount: pagination.total
    };
};
