/**
 * Adopt Proxy API Route
 * POST /api/v1/solutions/{solutionId}/adopt - Adopt solution (auth required)
 * DELETE /api/v1/solutions/{solutionId}/adopt - Unadopt solution (auth required)
 *
 * Proxies requests to the backend API to avoid CORS issues.
 */

import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.API_BASE_URL;

/**
 * POST /api/v1/solutions/{solutionId}/adopt
 * Adopt a solution (spot owner only)
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
      `${API_BASE_URL}/api/v1/solutions/${solutionId}/adopt`,
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
    console.error("Adopt POST proxy error:", error);
    return NextResponse.json(
      { message: "Failed to adopt solution" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/v1/solutions/{solutionId}/adopt
 * Unadopt a solution (spot owner only)
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
      `${API_BASE_URL}/api/v1/solutions/${solutionId}/adopt`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: authHeader,
        },
      }
    );

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Adopt DELETE proxy error:", error);
    return NextResponse.json(
      { message: "Failed to unadopt solution" },
      { status: 500 }
    );
  }
}
