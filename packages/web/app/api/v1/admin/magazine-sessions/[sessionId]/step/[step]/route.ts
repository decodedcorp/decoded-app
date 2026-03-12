/**
 * Magazine Session step API - Proxy to decoded-agent
 *
 * POST - Run step (vision, planner, writer, designer)
 * Uses no timeout - vision/planner steps can take many minutes (Gemini retries, etc.)
 */

import { Agent, fetch as undiciFetch } from "undici";
import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { checkIsAdmin } from "@/lib/supabase/admin";

const AGENT_URL = process.env.DECODED_AGENT_URL || "http://localhost:11000";

const VALID_STEPS = ["vision", "planner", "solution_search", "writer", "designer"];

const noTimeoutAgent = new Agent({
  headersTimeout: 0,
  bodyTimeout: 0,
});

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
  { params }: { params: Promise<{ sessionId: string; step: string }> }
) {
  const auth = await ensureAdmin();
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const { sessionId, step } = await params;

  if (!VALID_STEPS.includes(step)) {
    return NextResponse.json(
      { error: `Invalid step: ${step}. Must be one of: ${VALID_STEPS.join(", ")}` },
      { status: 400 }
    );
  }

  try {
    const res = await undiciFetch(
      `${AGENT_URL}/magazine-sessions/${sessionId}/step/${step}`,
      { method: "POST", dispatcher: noTimeoutAgent }
    );
    const data = await res.json();
    if (!res.ok) {
      return NextResponse.json(data, { status: res.status });
    }
    return NextResponse.json(data);
  } catch (err) {
    console.error("[magazine-session] step POST error:", err);
    return NextResponse.json(
      { error: "Failed to run step" },
      { status: 502 }
    );
  }
}
