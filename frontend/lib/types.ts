/**
 * Valid emotions supported by the platform
 */
export type Emotion =
    | 'joy'
    | 'sadness'
    | 'anger'
    | 'fear'
    | 'gratitude'
    | 'regret'
    | 'love'
    | 'hope'
    | 'loneliness';

/**
 * Core Star interface representing a message in the constellation
 */
export interface Star {
    id: string;
    emotion: Emotion;
    language: string;
    resonance_count: number;
    created_at: string;
    message_preview: string;
    message_text?: string;
    metadata?: Record<string, any>;
}

/**
 * Pagination metadata from the API
 */
export interface Pagination {
    total: number;
    limit: number;
    offset: number;
    has_more: boolean;
}

/**
 * Standard API response for star lists
 */
export interface StarsResponse {
    success: boolean;
    data: {
        stars: Star[];
        pagination: Pagination;
    };
}

/**
 * Global statistics response
 */
export interface CreateStarParams {
    message_text: string;
    emotion?: string;
}

export interface StatsResponse {
    success: boolean;
    total_stars: number;
    stars_by_emotion: Record<Emotion, number>;
    total_resonance: number;
    last_updated: string;
}

/**
 * Emotion metadata for UI selection
 */
export interface EmotionInfo {
    value: Emotion;
    label: string;
    description: string;
}

/**
 * Error structure returned by the API
 */
export interface ApiError {
    error: string;
    code: string;
    details?: any;
    status?: number;
}

/**
 * Parameters for fetching stars
 */
export interface GetStarsParams {
    limit?: number;
    offset?: number;
    emotion?: Emotion;
    order_by?: 'created_at' | 'resonance_count';
    order_direction?: 'asc' | 'desc';
    include_message?: boolean;
}
