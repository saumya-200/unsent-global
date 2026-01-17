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
            const response = await apiClient.submitMessage(message);

            // We create a local Star object based on the response
            const newStar: Star = {
                id: response.star_id,
                emotion: response.emotion,
                language: 'en', // Backend detects this, but common default
                resonance_count: 0,
                created_at: new Date().toISOString(),
                message_preview: message.slice(0, 50) + (message.length > 50 ? '...' : ''),
                message_text: message
            };

            setSubmittedStar(newStar);
            return newStar;
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
