/**
 * Magazine Session revise API - Proxy to decoded-agent
 *
 * POST - Record feedback and set step_status=revising (client then re-runs the step)
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
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  const auth = await ensureAdmin();
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const { sessionId } = await params;
  let body: { feedback?: string } = {};
  try {
    body = await request.json();
  } catch {
    // empty body allowed
  }

  try {
    const res = await fetch(
      `${AGENT_URL}/magazine-sessions/${sessionId}/revise`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ feedback: body.feedback ?? "" }),
      }
    );
    const data = await res.json();
    if (!res.ok) {
      return NextResponse.json(data, { status: res.status });
    }
    return NextResponse.json(data);
  } catch (err) {
    console.error("[magazine-session] revise POST error:", err);
    return NextResponse.json(
      { error: "Failed to revise step" },
      { status: 502 }
    );
  }
}
