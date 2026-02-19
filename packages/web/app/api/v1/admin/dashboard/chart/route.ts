import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { checkIsAdmin } from "@/lib/supabase/admin";
import { fetchChartData } from "@/lib/api/admin/dashboard";

/**
 * GET /api/v1/admin/dashboard/chart?days=30
 *
 * Returns time-series chart data for the dashboard activity chart.
 * All data is deterministic mock data (no analytics tables in DB).
 * Requires admin privileges.
 *
 * Query params:
 *   days - Number of days to return (default: 30, max: 90)
 *
 * Response shape: DailyMetric[]
 */
export async function GET(request: NextRequest) {
  if (process.env.NODE_ENV === "development") {
    const { searchParams } = new URL(request.url);
    const daysParam = searchParams.get("days");
    const days = daysParam ? parseInt(daysParam, 10) : 30;
    const data = await fetchChartData(days);
    return NextResponse.json(data);
  }

  const supabase = await createSupabaseServerClient();

  const { searchParams } = new URL(request.url);
  const daysParam = searchParams.get("days");
  const days = daysParam ? parseInt(daysParam, 10) : 30;

  if (isNaN(days) || days < 1) {
    return NextResponse.json(
      { error: "Invalid days parameter. Must be a positive integer." },
      { status: 400 }
    );
  }

  const data = await fetchChartData(days);
  return NextResponse.json(data);
}
