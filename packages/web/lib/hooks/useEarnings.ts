/**
 * Earnings Hooks
 * React Query hooks for click tracking and earnings data
 */

import { useQuery, useMutation, UseQueryOptions } from "@tanstack/react-query";
import { fetchClickStats, recordClick, fetchEarnings } from "@/lib/api";
import type { ClickStatsResponse, EarningsResponse, CreateClickDto } from "@/lib/api/types";

// ============================================================
// Query Keys
// ============================================================

export const earningsKeys = {
  all: ["earnings"] as const,
  clicks: () => [...earningsKeys.all, "clicks"] as const,
  clickStats: () => [...earningsKeys.clicks(), "stats"] as const,
  earnings: () => [...earningsKeys.all, "summary"] as const,
};

// ============================================================
// useClickStats - Click statistics for current user
// ============================================================

export function useClickStats(
  options?: Omit<UseQueryOptions<ClickStatsResponse, Error>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: earningsKeys.clickStats(),
    queryFn: fetchClickStats,
    staleTime: 1000 * 60 * 5, // 5 minutes (stats don't change rapidly)
    ...options,
  });
}

// ============================================================
// useEarnings - Earnings summary for current user
// ============================================================

export function useEarnings(
  options?: Omit<UseQueryOptions<EarningsResponse, Error>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: earningsKeys.earnings(),
    queryFn: fetchEarnings,
    staleTime: 1000 * 60 * 5, // 5 minutes
    ...options,
  });
}

// ============================================================
// useRecordClick - Mutation for recording clicks
// ============================================================

export function useRecordClick() {
  return useMutation({
    mutationFn: (data: CreateClickDto) => recordClick(data),
    onError: (error) => {
      console.error("[useRecordClick] Failed to record click:", error);
    },
  });
}
