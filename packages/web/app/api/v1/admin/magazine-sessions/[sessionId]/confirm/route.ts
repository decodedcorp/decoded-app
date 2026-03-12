/**
 * Magazine Session confirm API - Proxy to decoded-agent
 *
 * POST - Confirm current step and advance to next
 */

import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { checkIsAdmin } from "@/lib/supabase/admin";

const AGENT_URL = process.env.DECODED_AGENT_URL || "http://localhost:11000";

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

  return {} as const;
}

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  const auth = await ensureAdmin();
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const { sessionId } = await params;

  try {
    const res = await fetch(
      `${AGENT_URL}/magazine-sessions/${sessionId}/confirm`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      }
    );
    const data = await res.json();
    if (!res.ok) {
      return NextResponse.json(data, { status: res.status });
    }
    return NextResponse.json(data);
  } catch (err) {
    console.error("[magazine-session] confirm POST error:", err);
    return NextResponse.json(
      { error: "Failed to confirm step" },
      { status: 502 }
    );
  }
}
