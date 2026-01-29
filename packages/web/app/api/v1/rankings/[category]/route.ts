/**
 * Category Rankings Proxy API Route
 * GET /api/v1/rankings/{category} - Fetch rankings for a specific category
 *
 * Proxies requests to the backend API to avoid CORS issues.
 */

import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.API_BASE_URL;

interface RouteContext {
  params: Promise<{ category: string }>;
}

/**
 * GET /api/v1/rankings/{category}
 * Fetch rankings for a specific category
 * Supports: page, per_page query parameters
 */
export async function GET(request: NextRequest, context: RouteContext) {
  if (!API_BASE_URL) {
    console.error("API_BASE_URL environment variable is not configured");
    return NextResponse.json(
      { message: "Server configuration error" },
      { status: 500 }
    );
  }

  const { category } = await context.params;
  const { searchParams } = new URL(request.url);
  const queryString = searchParams.toString();
  const url = `${API_BASE_URL}/api/v1/rankings/${category}${queryString ? `?${queryString}` : ""}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error(`Rankings/{category} GET proxy error:`, error);
    return NextResponse.json(
      { message: "Failed to fetch category rankings" },
      { status: 500 }
    );
  }
}
