/**
 * Rankings Proxy API Route
 * GET /api/v1/rankings - Fetch global rankings leaderboard
 *
 * Proxies requests to the backend API to avoid CORS issues.
 */

import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.API_BASE_URL;

/**
 * GET /api/v1/rankings
 * Fetch global rankings with optional filters
 * Supports: period (weekly/monthly/all_time), page, per_page
 */
export async function GET(request: NextRequest) {
  if (!API_BASE_URL) {
    console.error("API_BASE_URL environment variable is not configured");
    return NextResponse.json(
      { message: "Server configuration error" },
      { status: 500 }
    );
  }

  const { searchParams } = new URL(request.url);
  const queryString = searchParams.toString();
  const url = `${API_BASE_URL}/api/v1/rankings${queryString ? `?${queryString}` : ""}`;

  try {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    // Include auth header if present (for my_ranking in response)
    const authHeader = request.headers.get("Authorization");
    if (authHeader) {
      headers.Authorization = authHeader;
    }

    const response = await fetch(url, {
      method: "GET",
      headers,
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Rankings GET proxy error:", error);
    return NextResponse.json(
      { message: "Failed to fetch rankings" },
      { status: 500 }
    );
  }
}
