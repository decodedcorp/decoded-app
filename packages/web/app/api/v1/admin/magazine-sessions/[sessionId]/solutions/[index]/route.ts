/**
 * Magazine Session - Remove solution API - Proxy to decoded-agent
 *
 * DELETE - Remove solution at index from external_solutions
 */

import { NextResponse } from "next/server";
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

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ sessionId: string; index: string }> }
) {
  const auth = await ensureAdmin();
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const { sessionId, index } = await params;
  const idx = parseInt(index, 10);
  if (Number.isNaN(idx) || idx < 0) {
    return NextResponse.json({ error: "Invalid index" }, { status: 400 });
  }

  try {
    const res = await fetch(
      `${AGENT_URL}/magazine-sessions/${sessionId}/solutions/${idx}`,
      { method: "DELETE" }
    );
    const data = await res.json();
    if (!res.ok) {
      return NextResponse.json(data, { status: res.status });
    }
    return NextResponse.json(data);
  } catch (err) {
    console.error("[magazine-session] solutions remove DELETE error:", err);
    return NextResponse.json(
      { error: "Failed to remove solution" },
      { status: 502 }
    );
  }
}
