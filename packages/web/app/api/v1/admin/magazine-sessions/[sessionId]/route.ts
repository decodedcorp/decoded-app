/**
 * Magazine Session detail API - Proxy to decoded-api (CRUD)
 *
 * GET    - Get session state
 * DELETE - Delete session
 */

import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { checkIsAdmin } from "@/lib/supabase/admin";

const API_BASE_URL = process.env.API_BASE_URL || "";

async function ensureAdmin() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized", status: 401 } as const;
  }

  const isAdmin = await checkIsAdmin(supabase, user.id);
  if (!isAdmin) {
    return { error: "Forbidden", status: 403 } as const;
  }

  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session?.access_token) {
    return { error: "Unauthorized", status: 401 } as const;
  }
  return { accessToken: session.access_token } as const;
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  const auth = await ensureAdmin();
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  if (!API_BASE_URL) {
    return NextResponse.json(
      { error: "API_BASE_URL not configured" },
      { status: 500 }
    );
  }

  const { sessionId } = await params;

  try {
    const res = await fetch(
      `${API_BASE_URL}/api/v1/admin/magazine-sessions/${sessionId}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.accessToken}`,
        },
      }
    );
    const data = await res.json();
    if (!res.ok) {
      return NextResponse.json(data, { status: res.status });
    }
    return NextResponse.json(data);
  } catch (err) {
    console.error("[magazine-session] GET error:", err);
    return NextResponse.json(
      { error: "Failed to fetch session" },
      { status: 502 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  const auth = await ensureAdmin();
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  if (!API_BASE_URL) {
    return NextResponse.json(
      { error: "API_BASE_URL not configured" },
      { status: 500 }
    );
  }

  const { sessionId } = await params;

  try {
    const res = await fetch(
      `${API_BASE_URL}/api/v1/admin/magazine-sessions/${sessionId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${auth.accessToken}`,
        },
      }
    );
    const data = await res.json();
    if (!res.ok) {
      return NextResponse.json(data, { status: res.status });
    }
    return NextResponse.json(data);
  } catch (err) {
    console.error("[magazine-session] DELETE error:", err);
    return NextResponse.json(
      { error: "Failed to delete session" },
      { status: 502 }
    );
  }
}
