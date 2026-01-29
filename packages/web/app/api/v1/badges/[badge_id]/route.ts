/**
 * Badge Details Proxy API Route
 * GET /api/v1/badges/{badge_id} - Fetch badge details by ID
 *
 * Proxies requests to the backend API to avoid CORS issues.
 */

import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.API_BASE_URL;

/**
 * GET /api/v1/badges/{badge_id}
 * Fetch badge details by ID (no auth required)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { badge_id: string } }
) {
  if (!API_BASE_URL) {
    console.error("API_BASE_URL environment variable is not configured");
    return NextResponse.json(
      { message: "Server configuration error" },
      { status: 500 }
    );
  }

  const { badge_id } = params;

  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/badges/${badge_id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error(`Badges/${badge_id} GET proxy error:`, error);
    return NextResponse.json(
      { message: "Failed to fetch badge details" },
      { status: 500 }
    );
  }
}
