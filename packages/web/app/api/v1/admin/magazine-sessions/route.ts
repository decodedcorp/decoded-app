/**
 * Magazine Sessions API - Proxy to decoded-api (CRUD)
 *
 * GET  - List sessions
 * POST - Create session
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
  return { user, accessToken: session.access_token } as const;
}

function authHeaders(accessToken: string): HeadersInit {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`,
  };
}

export async function GET() {
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

  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/admin/magazine-sessions`, {
      headers: authHeaders(auth.accessToken),
    });
    const data = await res.json();
    if (!res.ok) {
      return NextResponse.json(data, { status: res.status });
    }
    return NextResponse.json(data);
  } catch (err) {
    console.error("[magazine-sessions] GET error:", err);
    return NextResponse.json(
      { error: "Failed to fetch sessions" },
      { status: 502 }
    );
  }
}

export async function POST(request: NextRequest) {
  const auth = await ensureAdmin();
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.includes("multipart/form-data")) {
    return NextResponse.json(
      { error: "Content-Type must be multipart/form-data (topic + images)" },
      { status: 415 }
    );
  }

  if (!API_BASE_URL) {
    return NextResponse.json(
      { error: "API_BASE_URL not configured" },
      { status: 500 }
    );
  }

  try {
    const formData = await request.formData();
    const topic = (formData.get("topic") as string | null) ?? "";
    const imageFiles = formData
      .getAll("images")
      .filter((f): f is File => f instanceof File);

    const images: { b64: string; mime_type: string; filename: string }[] = [];
    for (const file of imageFiles) {
      const buf = await file.arrayBuffer();
      const b64 = Buffer.from(buf).toString("base64");
      const name = file instanceof File ? file.name : "image.png";
      const mime = file.type || "image/png";
      images.push({ b64, mime_type: mime, filename: name });
    }

    const res = await fetch(`${API_BASE_URL}/api/v1/admin/magazine-sessions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${auth.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ topic, images }),
    });
    const data = await res.json();
    if (!res.ok) {
      return NextResponse.json(data, { status: res.status });
    }
    return NextResponse.json(data);
  } catch (err) {
    console.error("[magazine-sessions] POST error:", err);
    return NextResponse.json(
      { error: "Failed to create session" },
      { status: 502 }
    );
  }
}
