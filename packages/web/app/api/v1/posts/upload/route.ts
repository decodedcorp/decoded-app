/**
 * Image Upload Proxy API Route
 * POST /api/v1/posts/upload
 *
 * Proxies multipart form data to the backend API to avoid CORS issues.
 * Requires authentication via Authorization header.
 */

import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.API_BASE_URL;

export async function POST(request: NextRequest) {
  // Validate server configuration
  if (!API_BASE_URL) {
    console.error("API_BASE_URL environment variable is not configured");
    return NextResponse.json(
      { message: "Server configuration error" },
      { status: 500 }
    );
  }

  // Validate authentication
  const authHeader = request.headers.get("Authorization");
  if (!authHeader) {
    return NextResponse.json(
      { message: "Authentication required" },
      { status: 401 }
    );
  }

  try {
    // Get the form data from the request
    const formData = await request.formData();

    // Forward the request to the backend
    const response = await fetch(`${API_BASE_URL}/api/v1/posts/upload`, {
      method: "POST",
      headers: {
        Authorization: authHeader,
      },
      body: formData,
    });

    // Parse response data
    const data = await response.json();

    // Return the response with the same status code
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Upload proxy error:", error);
    return NextResponse.json(
      { message: "Failed to upload image" },
      { status: 500 }
    );
  }
}
