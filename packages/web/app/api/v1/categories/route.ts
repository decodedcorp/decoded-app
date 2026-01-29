/**
 * Categories Proxy API Route
 * GET /api/v1/categories
 *
 * Proxies requests to the backend API to avoid CORS issues.
 * No authentication required.
 */

import { NextResponse } from "next/server";

const API_BASE_URL = process.env.API_BASE_URL;

export async function GET() {
  // Validate server configuration
  if (!API_BASE_URL) {
    console.error("API_BASE_URL environment variable is not configured");
    return NextResponse.json(
      { message: "Server configuration error" },
      { status: 500 }
    );
  }

  try {
    // Forward the request to the backend
    const response = await fetch(`${API_BASE_URL}/api/v1/categories`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Parse response data
    const data = await response.json();

    // Return the response with the same status code
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Categories proxy error:", error);
    return NextResponse.json(
      { message: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}
