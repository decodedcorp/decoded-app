/**
 * Click Recording Proxy API Route
 * POST /api/v1/clicks - Record a click event (no auth required)
 */

import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.API_BASE_URL;

export async function POST(request: NextRequest) {
  if (!API_BASE_URL) {
    console.error("API_BASE_URL environment variable is not configured");
    return NextResponse.json(
      { message: "Server configuration error" },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();

    const response = await fetch(`${API_BASE_URL}/api/v1/clicks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (response.status === 201) {
      return NextResponse.json({ success: true }, { status: 201 });
    }

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Clicks POST proxy error:", error);
    return NextResponse.json(
      { message: "Failed to record click" },
      { status: 500 }
    );
  }
}
