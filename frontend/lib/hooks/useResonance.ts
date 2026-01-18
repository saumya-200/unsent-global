import { useState, useCallback } from 'react';
import { ApiError } from '@/lib/types';
import { apiClient } from '@/lib/api-client';

export function useResonance() {
    const [isResonating, setIsResonating] = useState(false);
    const [error, setError] = useState<ApiError | null>(null);
    const [successAnimation, setSuccessAnimation] = useState(false);

    const resonate = useCallback(async (starId: string) => {
        setIsResonating(true);
        setError(null);
        setSuccessAnimation(false);

        try {
            const response = await apiClient.resonate(starId);

            if (response.success) {
                setSuccessAnimation(true);
                // Reset animation after 2s
                setTimeout(() => setSuccessAnimation(false), 2000);
                return {
                    success: true,
                    newResonanceCount: response.resonance_count
                };
            }

            return { success: false, newResonanceCount: 0 };
        } catch (err: any) {
            // 409 is "Already felt this" - handle gracefully
            if (err.status === 409) {
                return { success: false, alreadyResonated: true };
            }

            setError(err);
            return { success: false, error: err };
        } finally {
            setIsResonating(false);
        }
    }, []);

    const unresonate = useCallback(async (starId: string) => {
        setIsResonating(true);
        setError(null);

        try {
            const response = await apiClient.unresonate(starId);

            if (response.success) {
                return {
                    success: true,
                    newResonanceCount: response.resonance_count
                };
            }

            return { success: false, newResonanceCount: 0 };
        } catch (err: any) {
            // 400 means they haven't resonated - nothing to remove
            if (err.status === 400) {
                return { success: false, notResonated: true };
            }

            setError(err);
            return { success: false, error: err };
        } finally {
            setIsResonating(false);
        }
    }, []);

    return {
        resonate,
        unresonate,
        isResonating,
        error,
        successAnimation
    };
}
