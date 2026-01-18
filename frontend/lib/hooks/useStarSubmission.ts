import { useState, useCallback } from 'react';
import { Star, ApiError } from '@/lib/types';
import { apiClient } from '@/lib/api-client';

interface UseStarSubmissionReturn {
    submitMessage: (message: string) => Promise<Star | null>;
    isSubmitting: boolean;
    error: ApiError | null;
    submittedStar: Star | null;
    reset: () => void;
    validate: (message: string) => { valid: boolean; error?: string };
}

export function useStarSubmission(): UseStarSubmissionReturn {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<ApiError | null>(null);
    const [submittedStar, setSubmittedStar] = useState<Star | null>(null);

    const validate = useCallback((message: string): { valid: boolean; error?: string } => {
        const trimmed = message.trim();
        if (trimmed.length === 0) {
            return { valid: false, error: 'Please write your message' };
        }
        if (trimmed.length > 1000) {
            return { valid: false, error: 'Message is too long (max 1000 characters)' };
        }
        return { valid: true };
    }, []);

    const submitMessage = useCallback(async (message: string): Promise<Star | null> => {
        const validation = validate(message);
        if (!validation.valid) {
            setError({ error: validation.error || 'Invalid message', code: 'VALIDATION_ERROR' });
            return null;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            const response = await apiClient.submitMessage(message.trim());

            if (response.success) {
                // Create a star object from the response
                const newStar: Star = {
                    id: response.star_id,
                    emotion: response.emotion,
                    language: 'en', // Default, backend can enhance this
                    resonance_count: 0,
                    created_at: new Date().toISOString(),
                    message_preview: message.trim().slice(0, 100),
                    message_text: message.trim(),
                };

                setSubmittedStar(newStar);
                return newStar;
            }

            setError({ error: 'Failed to submit message', code: 'UNKNOWN_ERROR' });
            return null;
        } catch (err: any) {
            console.error('[useStarSubmission] Error:', err);
            setError(err);
            return null;
        } finally {
            setIsSubmitting(false);
        }
    }, [validate]);

    const reset = useCallback(() => {
        setError(null);
        setSubmittedStar(null);
    }, []);

    return {
        submitMessage,
        isSubmitting,
        error,
        submittedStar,
        reset,
        validate,
    };
}
