/**
 * POST /api/v1/posts/extract-metadata
 * AI metadata extraction endpoint
 * Proxies request to backend API
 */

import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { description } = body;

    if (!description || typeof description !== "string") {
      return NextResponse.json(
        { message: "Description is required" },
        { status: 400 }
      );
    }

    // Proxy to backend
    const response = await fetch(
      `${API_BASE_URL}/api/v1/posts/extract-metadata`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ description }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        message: `Backend error: ${response.status}`,
      }));
      return NextResponse.json(
        { message: errorData.message || "Metadata extraction failed" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("[extract-metadata] Error:", error);
    return NextResponse.json(
      {
        message: error instanceof Error ? error.message : "Failed to extract metadata",
      },
      { status: 500 }
    );
  }
}
