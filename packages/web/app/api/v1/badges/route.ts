/**
 * Badges Proxy API Route
 * GET /api/v1/badges - 전체 뱃지 목록 (공개)
 *
 * Proxies requests to the backend API.
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
    const { searchParams } = new URL(request.url);
    const queryString = searchParams.toString();
    const url = queryString
      ? `${API_BASE_URL}/api/v1/badges?${queryString}`
      : `${API_BASE_URL}/api/v1/badges`;

    const response = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Badges GET proxy error:", error);
    return NextResponse.json(
      { message: "Failed to fetch badges" },
      { status: 500 }
    );
  }
}
