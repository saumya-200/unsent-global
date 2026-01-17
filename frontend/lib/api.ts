import { apiClient } from './api-client';

export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

export interface ApiResponse<T> {
    data?: T;
    error?: string;
    status: number;
}

/**
 * Enhanced API fetcher using the new apiClient logic
 * Maintained for backward compatibility with Phase 1
 */
export async function fetchFromAPI<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    try {
        const url = `${BACKEND_URL}${endpoint}`;
        const response = await fetch(url, {
            headers: {
                "Content-Type": "application/json",
                ...options.headers,
            },
            ...options,
        });

        const data = await response.json();

        if (!response.ok) {
            return {
                error: data.message || "An error occurred",
                status: response.status,
            };
        }

        return {
            data: data as T,
            status: response.status,
        };
    } catch (error) {
        console.error("API Fetch Error:", error);
        return {
            error: error instanceof Error ? error.message : "Network error",
            status: 500,
        };
    }
}

// Re-export the new version for Phase 3+
export * from './api-client';
export * from './types';
