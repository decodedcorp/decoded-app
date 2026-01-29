/**
 * Popular Search Terms Proxy API Route
 * GET /api/v1/search/popular - Fetch popular search terms (no auth required)
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

  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/search/popular`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Search/popular GET proxy error:", error);
    return NextResponse.json(
      { message: "Failed to fetch popular searches" },
      { status: 500 }
    );
  }
}
