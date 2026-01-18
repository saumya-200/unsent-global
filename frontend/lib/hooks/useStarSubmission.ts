import { useState, useCallback } from 'react';
import { Star, ApiError } from '../types';
import { apiClient } from '../api-client';

export const useStarSubmission = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<ApiError | null>(null);
    const [submittedStar, setSubmittedStar] = useState<Star | null>(null);

    const submitMessage = useCallback(async (message: string): Promise<Star | null> => {
        setIsSubmitting(true);
        setError(null);
        setSubmittedStar(null);

        try {
            const response = await apiClient.createStar({ message_text: message });

            if (response.success && response.data) {
                const newStar = response.data;
                setSubmittedStar(newStar);
                return newStar;
            }
            return null;
        } catch (err: any) {
            setError(err);
            return null;
        } finally {
            setIsSubmitting(false);
        }
    }, []);

    const reset = useCallback(() => {
        setSubmittedStar(null);
        setError(null);
    }, []);

    return {
        submitMessage,
        isSubmitting,
        error,
        submittedStar,
        reset
    };
};
