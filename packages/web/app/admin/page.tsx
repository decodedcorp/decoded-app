"use client";

import { useState } from "react";
import {
  useDashboardStats,
  useChartData,
  useTodaySummary,
} from "@/lib/hooks/admin/useDashboard";
import {
  KPICards,
  KPICardsSkeleton,
} from "@/lib/components/admin/dashboard/KPICards";
import {
  TrafficChart,
  TrafficChartSkeleton,
} from "@/lib/components/admin/dashboard/TrafficChart";
import {
  TodaySummary as TodaySummaryComponent,
  TodaySummarySkeleton,
} from "@/lib/components/admin/dashboard/TodaySummary";

/**
 * Admin Dashboard Page
 *
 * Composes KPI stat cards, traffic trend chart, and today's activity summary.
 * All data fetched client-side via React Query from admin API routes.
 * Each section has a skeleton fallback for loading and error states.
 */
export default function AdminDashboardPage() {
  const [chartPeriod, setChartPeriod] = useState(30);

  const statsQuery = useDashboardStats();
  const chartQuery = useChartData(chartPeriod);
  const todayQuery = useTodaySummary();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="font-serif text-2xl md:text-3xl lg:text-4xl font-semibold tracking-tight text-foreground">
          대시보드
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          서비스 현황 및 주요 지표
        </p>
      </div>

      {/* KPI Cards */}
      {statsQuery.isLoading ? (
        <KPICardsSkeleton />
      ) : statsQuery.data ? (
        <KPICards data={statsQuery.data} />
      ) : (
        <KPICardsSkeleton />
      )}

      {/* Traffic Chart */}
      {chartQuery.isLoading ? (
        <TrafficChartSkeleton />
      ) : chartQuery.data ? (
        <TrafficChart
          data={chartQuery.data}
          currentPeriod={chartPeriod}
          onPeriodChange={setChartPeriod}
        />
      ) : (
        <TrafficChartSkeleton />
      )}

      {/* Today Summary */}
      {todayQuery.isLoading ? (
        <TodaySummarySkeleton />
      ) : todayQuery.data ? (
        <TodaySummaryComponent data={todayQuery.data} />
      ) : (
        <TodaySummarySkeleton />
      )}
    </div>
  );
}
