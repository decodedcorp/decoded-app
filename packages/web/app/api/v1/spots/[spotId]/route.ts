/**
 * Individual Spot Proxy API Route
 * PATCH /api/v1/spots/[spotId] - Update spot (auth required)
 * DELETE /api/v1/spots/[spotId] - Delete spot (auth required)
 *
 * Proxies requests to the backend API to avoid CORS issues.
 */

import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.API_BASE_URL;

type RouteParams = {
  params: Promise<{ spotId: string }>;
};

/**
 * PATCH /api/v1/spots/[spotId]
 * Update a spot
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
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

  const { spotId } = await params;

  try {
    const body = await request.json();

    const response = await fetch(`${API_BASE_URL}/api/v1/spots/${spotId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Spot PATCH proxy error:", error);
    return NextResponse.json(
      { message: "Failed to update spot" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/v1/spots/[spotId]
 * Delete a spot
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
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

  const { spotId } = await params;

  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/spots/${spotId}`, {
      method: "DELETE",
      headers: {
        Authorization: authHeader,
      },
    });

    if (response.status === 204) {
      return new NextResponse(null, { status: 204 });
    }

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Spot DELETE proxy error:", error);
    return NextResponse.json(
      { message: "Failed to delete spot" },
      { status: 500 }
    );
  }
}
