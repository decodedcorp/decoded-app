import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { checkIsAdmin } from "@/lib/supabase/admin";
import { fetchDashboardStats } from "@/lib/api/admin/dashboard";

/**
 * GET /api/v1/admin/dashboard/stats
 *
 * Returns KPI statistics for the admin dashboard overview cards.
 * Requires admin privileges.
 *
 * Response shape: KPIStats
 */
export async function GET() {
  if (process.env.NODE_ENV === "development") {
    const stats = await fetchDashboardStats();
    return NextResponse.json(stats);
  }

  const supabase = await createSupabaseServerClient();

  const stats = await fetchDashboardStats();
  return NextResponse.json(stats);
}
