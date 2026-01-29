/**
 * Vote Proxy API Route
 * GET /api/v1/solutions/{solutionId}/votes - Get vote stats (public)
 * POST /api/v1/solutions/{solutionId}/votes - Create vote (auth required)
 * DELETE /api/v1/solutions/{solutionId}/votes - Delete vote (auth required)
 *
 * Proxies requests to the backend API to avoid CORS issues.
 */

import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.API_BASE_URL;

/**
 * GET /api/v1/solutions/{solutionId}/votes
 * Get vote stats for a solution
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { solutionId: string } }
) {
  if (!API_BASE_URL) {
    console.error("API_BASE_URL environment variable is not configured");
    return NextResponse.json(
      { message: "Server configuration error" },
      { status: 500 }
    );
  }

  const { solutionId } = params;

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/solutions/${solutionId}/votes`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Vote stats GET proxy error:", error);
    return NextResponse.json(
      { message: "Failed to fetch vote stats" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/v1/solutions/{solutionId}/votes
 * Create a vote on a solution
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { solutionId: string } }
) {
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

  const { solutionId } = params;

  try {
    const body = await request.json();

    const response = await fetch(
      `${API_BASE_URL}/api/v1/solutions/${solutionId}/votes`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: authHeader,
        },
        body: JSON.stringify(body),
      }
    );

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Vote POST proxy error:", error);
    return NextResponse.json(
      { message: "Failed to create vote" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/v1/solutions/{solutionId}/votes
 * Delete/retract a vote
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { solutionId: string } }
) {
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

  const { solutionId } = params;

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/solutions/${solutionId}/votes`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: authHeader,
        },
      }
    );

    if (response.status === 204) {
      return new NextResponse(null, { status: 204 });
    }

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Vote DELETE proxy error:", error);
    return NextResponse.json(
      { message: "Failed to delete vote" },
      { status: 500 }
    );
  }
}
