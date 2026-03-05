/**
 * Rankings Proxy API Route
 * GET /api/v1/rankings - 전체 랭킹 (선택적 인증)
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
    const authHeader = request.headers.get("Authorization");
    const { searchParams } = new URL(request.url);
    const queryString = searchParams.toString();
    const url = queryString
      ? `${API_BASE_URL}/api/v1/rankings?${queryString}`
      : `${API_BASE_URL}/api/v1/rankings`;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (authHeader) headers.Authorization = authHeader;

    const response = await fetch(url, { method: "GET", headers });

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
