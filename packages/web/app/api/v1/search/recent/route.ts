/**
 * Recent Search Terms Proxy API Route
 * GET /api/v1/search/recent - Fetch recent search history (auth required)
 */

import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.API_BASE_URL;

export async function GET(request: NextRequest) {
  if (!API_BASE_URL) {
    console.error("API_BASE_URL environment variable is not configured");
    return NextResponse.json(
      { message: "Server configuration error" },
      { status: 500 }
    );
  }

  const authHeader = request.headers.get("Authorization");
  if (!authHeader) {
    return NextResponse.json(
      { message: "Authentication required" },
      { status: 401 }
    );
  }

  try {
    // Forward query params (limit)
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get("limit");
    const queryString = limit ? `?limit=${limit}` : "";

    const response = await fetch(`${API_BASE_URL}/api/v1/search/recent${queryString}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader,
      },
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Search/recent GET proxy error:", error);
    return NextResponse.json(
      { message: "Failed to fetch recent searches" },
      { status: 500 }
    );
  }
}
