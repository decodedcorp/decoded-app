/**
 * Comments Proxy API Route
 * GET /api/v1/posts/[postId]/comments - Fetch comments for a post
 * POST /api/v1/posts/[postId]/comments - Create comment (auth required)
 */

import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.API_BASE_URL;

type RouteContext = {
  params: Promise<{ postId: string }>;
};

export async function GET(request: NextRequest, context: RouteContext) {
  if (!API_BASE_URL) {
    return NextResponse.json(
      { message: "Server configuration error" },
      { status: 500 }
    );
  }

  const { postId } = await context.params;

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/posts/${postId}/comments`,
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
    console.error("Comments GET proxy error:", error);
    return NextResponse.json(
      { message: "Failed to fetch comments" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest, context: RouteContext) {
  if (!API_BASE_URL) {
    return NextResponse.json(
      { message: "Server configuration error" },
      { status: 500 }
    );
  }

  const { postId } = await context.params;
  const authHeader = request.headers.get("Authorization");

  if (!authHeader) {
    return NextResponse.json(
      { message: "Authentication required" },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();

    const response = await fetch(
      `${API_BASE_URL}/api/v1/posts/${postId}/comments`,
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
    console.error("Comments POST proxy error:", error);
    return NextResponse.json(
      { message: "Failed to create comment" },
      { status: 500 }
    );
  }
}
