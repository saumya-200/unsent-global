const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

export interface ApiResponse<T> {
    data?: T;
    error?: string;
    status: number;
}

export async function fetchFromAPI<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    try {
        const response = await fetch(`${BACKEND_URL}${endpoint}`, {
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
