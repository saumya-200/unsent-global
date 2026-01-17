import { NextResponse } from "next/server";
import { fetchFromAPI } from "@/lib/api";

export async function GET() {
    // Check backend health
    const backendHealth = await fetchFromAPI("/health");

    return NextResponse.json({
        service: "frontend",
        status: "healthy",
        timestamp: new Date().toISOString(),
        backend_connection: backendHealth.status === 200 ? "connected" : "failed",
        backend_details: backendHealth.data || backendHealth.error
    });
}
