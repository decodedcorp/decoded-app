/**
 * Comment Proxy API Route
 * PATCH /api/v1/comments/[commentId] - Update comment (auth required)
 * DELETE /api/v1/comments/[commentId] - Delete comment (auth required)
 */

import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.API_BASE_URL;

type RouteContext = {
  params: Promise<{ commentId: string }>;
};

export async function PATCH(request: NextRequest, context: RouteContext) {
  if (!API_BASE_URL) {
    return NextResponse.json(
      { message: "Server configuration error" },
      { status: 500 }
    );
  }

  const { commentId } = await context.params;
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
      `${API_BASE_URL}/api/v1/comments/${commentId}`,
      {
        method: "PATCH",
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
    console.error("Comment PATCH proxy error:", error);
    return NextResponse.json(
      { message: "Failed to update comment" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  if (!API_BASE_URL) {
    return NextResponse.json(
      { message: "Server configuration error" },
      { status: 500 }
    );
  }

  const { commentId } = await context.params;
  const authHeader = request.headers.get("Authorization");

  if (!authHeader) {
    return NextResponse.json(
      { message: "Authentication required" },
      { status: 401 }
    );
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/comments/${commentId}`,
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
    console.error("Comment DELETE proxy error:", error);
    return NextResponse.json(
      { message: "Failed to delete comment" },
      { status: 500 }
    );
  }
}
