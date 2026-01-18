import {
    Star,
    StarsResponse,
    StatsResponse,
    EmotionInfo,
    GetStarsParams,
    ApiError,
    Emotion
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
     * Fetch a single star's details by ID
     */
    async getStarDetail(starId: string): Promise<{ data: Star & { has_resonated: boolean } }> {
        return this.request<{ data: Star & { has_resonated: boolean } }>(`/stars/${starId}`);
    }

    /**
     * Resonate with a star
     */
    async resonate(starId: string): Promise<{ success: boolean; resonance_count: number }> {
        return this.request<{ success: boolean; resonance_count: number }>('/resonate', {
            method: 'POST',
            body: JSON.stringify({ star_id: starId }),
        });
    }

    /**
     * Unresonate with a star (toggle off)
     */
    async unresonate(starId: string): Promise<{ success: boolean; resonance_count: number }> {
        return this.request<{ success: boolean; resonance_count: number }>('/resonate', {
            method: 'DELETE',
            body: JSON.stringify({ star_id: starId }),
        });
    }

    /**
     * Submit a new message
     */
    async submitMessage(message: string): Promise<{ success: boolean; star_id: string; emotion: Emotion }> {
        return this.request<{ success: boolean; star_id: string; emotion: Emotion }>('/submit', {
            method: 'POST',
            body: JSON.stringify({ message }),
        });
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
     * Fetch a single star by ID with resonance status
     */
    async getStarById(starId: string): Promise<{ star: Star, has_resonated: boolean }> {
        const res = await this.request<{ data: Star & { has_resonated: boolean } }>(`/stars/${starId}`);
        return {
            star: res.data,
            has_resonated: res.data.has_resonated
        };
    }
}

export const apiClient = new UnsentApiClient();
