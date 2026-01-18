import {
    Star,
    StarsResponse,
    StatsResponse,
    EmotionInfo,
    GetStarsParams,
    ApiError,
    Emotion,
    CreateStarParams
} from './types';


class UnsentApiClient {
    private baseUrl: string;
    private timeout: number = 10000;
    private maxRetries: number = 3;

    constructor() {
        this.baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    }

    /**
     * Enhanced fetch with timeout and error handling
     */
    private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
        const url = `${this.baseUrl}${endpoint}`;
        let retryCount = 0;

        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), this.timeout);

        const executeRequest = async (): Promise<T> => {
            try {
                const response = await fetch(url, {
                    ...options,
                    headers: {
                        'Content-Type': 'application/json',
                        ...(options.headers || {}),
                    },
                    signal: controller.signal,
                });

                clearTimeout(id);

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({})) as ApiError;
                    const error: ApiError = {
                        error: errorData.error || response.statusText,
                        code: errorData.code || 'UNKNOWN_ERROR',
                        status: response.status
                    };
                    throw error;
                }

                return await response.json() as T;
            } catch (err: any) {
                if (err.name === 'AbortError') {
                    throw { error: 'Request timed out. Please try again.', code: 'TIMEOUT', status: 408 };
                }

                // Retry logic for connectivity issues
                if (retryCount < this.maxRetries && (!err.status || err.status >= 500)) {
                    retryCount++;
                    return executeRequest();
                }

                if (!err.code) {
                    throw { error: 'Unable to connect. Please check your connection.', code: 'NETWORK_ERROR' };
                }

                throw err;
            }
        };

        return executeRequest();
    }

    /**
     * Fetch stars for the map
     */
    async getStars(params: GetStarsParams = {}): Promise<StarsResponse> {
        const query = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined) query.append(key, String(value));
        });

        const queryString = query.toString();
        return this.request<StarsResponse>(`/stars${queryString ? `?${queryString}` : ''}`);
    }

    /**
     * Create a new star
     */
    async createStar(params: CreateStarParams): Promise<{ success: boolean; data: Star }> {
        // Map frontend params to backend expectation
        const body = {
            message: params.message_text,
            emotion: params.emotion
        };

        const res = await this.request<any>('/submit', {
            method: 'POST',
            body: JSON.stringify(body),
        });

        // Backend returns: { star_id, emotion, language, ... }
        // We need to return a partial Star object so the UI can prepend it safely
        // But looking at routes.py, it returns minimal info.
        // We'll construct a mock Star object from the response + input

        return {
            success: true,
            data: {
                id: res.star_id,
                message_text: params.message_text,
                message_preview: params.message_text.substring(0, 50),
                emotion: res.emotion,
                language: 'en', // default or from response if available
                created_at: new Date().toISOString(),
                resonance_count: 0,
                // defaults
                x: 0, y: 0, z: 0, magnitude: 1.0, color: '#fff'
            } as Star
        };
    }

    /**
     * Get global statistics
     */
    async getStats(): Promise<StatsResponse> {
        return this.request<StatsResponse>('/stats');
    }

    /**
     * Get valid emotions
     */
    async getEmotions(): Promise<EmotionInfo[]> {
        const res = await this.request<{ success: boolean; emotions: EmotionInfo[] }>('/emotions');
        return res.emotions;
    }

    /**
     * Fetch a single star by ID
     */
    async getStarById(id: string): Promise<Star> {
        // Currently implementation: fetch with filter (or we could add a dedicated GET /stars/:id)
        const res = await this.getStars({ limit: 1, include_message: true });
        const star = res.data.stars.find(s => s.id === id);
        if (!star) throw { error: 'Star not found', code: 'NOT_FOUND', status: 404 };
        return star;
    }
}

export const apiClient = new UnsentApiClient();
