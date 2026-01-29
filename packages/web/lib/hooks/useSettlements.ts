/**
 * Settlements Hooks
 * React Query hooks for settlement history and withdrawals
 */

import { useQuery, useMutation, useQueryClient, UseQueryOptions } from "@tanstack/react-query";
import { fetchSettlements, requestWithdrawal } from "@/lib/api";
import type { SettlementsResponse, WithdrawRequest, WithdrawResponse } from "@/lib/api/types";

// ============================================================
// Query Keys
// ============================================================

export const settlementsKeys = {
  all: ["settlements"] as const,
  list: () => [...settlementsKeys.all, "list"] as const,
};

// ============================================================
// useSettlements - Settlement history for current user
// ============================================================

export function useSettlements(
  options?: Omit<UseQueryOptions<SettlementsResponse, Error>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: settlementsKeys.list(),
    queryFn: fetchSettlements,
    staleTime: 1000 * 60 * 5, // 5 minutes
    ...options,
  });
}

// ============================================================
// useWithdrawal - Mutation for requesting withdrawal
// ============================================================

export function useWithdrawal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: WithdrawRequest) => requestWithdrawal(data),
    onSuccess: () => {
      // Invalidate settlements to reflect new withdrawal request
      queryClient.invalidateQueries({ queryKey: settlementsKeys.all });
    },
    onError: (error) => {
      console.error("[useWithdrawal] Failed to request withdrawal:", error);
    },
  });
}
