import { type NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { checkIsAdmin } from "@/lib/supabase/admin";
import { fetchAiCostKPI } from "@/lib/api/admin/ai-cost";

/**
 * GET /api/v1/admin/ai-cost/kpi
 *
 * Returns KPI statistics for the AI cost monitoring overview cards.
 * Requires admin privileges.
 *
 * Query params:
 *   days - Period length in days (default 30, clamped to 7–90)
 *
 * Response shape: AiCostKPI
 */
export async function GET(request: NextRequest) {
  if (process.env.NODE_ENV === "development") {
    const { searchParams } = request.nextUrl;
    const days = Math.min(
      90,
      Math.max(7, parseInt(searchParams.get("days") ?? "30", 10))
    );
    const data = await fetchAiCostKPI(days);
    return NextResponse.json(data);
  }

  const supabase = await createSupabaseServerClient();

  const { searchParams } = request.nextUrl;
  const days = Math.min(
    90,
    Math.max(7, parseInt(searchParams.get("days") ?? "30", 10))
  );

  const data = await fetchAiCostKPI(days);
  return NextResponse.json(data);
}
