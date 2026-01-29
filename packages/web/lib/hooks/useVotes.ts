/**
 * Vote and Adopt Hooks
 * React Query hooks for vote and adopt operations
 */

import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryOptions,
} from "@tanstack/react-query";
import {
  fetchVoteStats,
  createVote,
  deleteVote,
  adoptSolution,
  unadoptSolution,
} from "@/lib/api/votes";
import {
  VoteStatsResponse,
  CreateVoteDto,
  VoteResponse,
  AdoptSolutionDto,
  AdoptResponse,
} from "@/lib/api/types";

// ============================================================
// Query Keys
// ============================================================

export const voteKeys = {
  all: ["votes"] as const,
  stats: (solutionId: string) =>
    [...voteKeys.all, "stats", solutionId] as const,
};

// ============================================================
// useVoteStats - Get vote stats for a solution
// ============================================================

export function useVoteStats(
  solutionId: string,
  options?: Omit<
    UseQueryOptions<VoteStatsResponse, Error>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: voteKeys.stats(solutionId),
    queryFn: () => fetchVoteStats(solutionId),
    enabled: !!solutionId,
    staleTime: 1000 * 30, // 30 seconds (votes change frequently)
    ...options,
  });
}

// ============================================================
// useVote - Mutation for creating a vote
// ============================================================

export function useVote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      solutionId,
      data,
    }: {
      solutionId: string;
      data: CreateVoteDto;
    }) => createVote(solutionId, data),
    onSuccess: (_, variables) => {
      // Invalidate vote stats to trigger refetch
      queryClient.invalidateQueries({
        queryKey: voteKeys.stats(variables.solutionId),
      });
    },
    onError: (error) => {
      console.error("[useVote] Failed to create vote:", error);
    },
  });
}

// ============================================================
// useRetractVote - Mutation for deleting/retracting a vote
// ============================================================

export function useRetractVote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (solutionId: string) => deleteVote(solutionId),
    onSuccess: (_, solutionId) => {
      // Invalidate vote stats to trigger refetch
      queryClient.invalidateQueries({
        queryKey: voteKeys.stats(solutionId),
      });
    },
    onError: (error) => {
      console.error("[useRetractVote] Failed to retract vote:", error);
    },
  });
}

// ============================================================
// useAdoptSolution - Mutation for adopting a solution
// ============================================================

export function useAdoptSolution() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      solutionId,
      data,
    }: {
      solutionId: string;
      data: AdoptSolutionDto;
    }) => adoptSolution(solutionId, data),
    onSuccess: (_, variables) => {
      // Invalidate vote stats (adoption affects stats)
      queryClient.invalidateQueries({
        queryKey: voteKeys.stats(variables.solutionId),
      });
      // TODO: Invalidate spot/solution queries when those hooks are implemented
    },
    onError: (error) => {
      console.error("[useAdoptSolution] Failed to adopt solution:", error);
    },
  });
}

// ============================================================
// useUnadoptSolution - Mutation for unadopting a solution
// ============================================================

export function useUnadoptSolution() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (solutionId: string) => unadoptSolution(solutionId),
    onSuccess: (_, solutionId) => {
      // Invalidate vote stats (unadoption affects stats)
      queryClient.invalidateQueries({
        queryKey: voteKeys.stats(solutionId),
      });
      // TODO: Invalidate spot/solution queries when those hooks are implemented
    },
    onError: (error) => {
      console.error("[useUnadoptSolution] Failed to unadopt solution:", error);
    },
  });
}
