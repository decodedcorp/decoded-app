/**
 * Rankings Hooks
 * React Query hooks for rankings data
 */

import {
  useQuery,
  useInfiniteQuery,
  UseQueryOptions,
} from "@tanstack/react-query";
import {
  fetchRankings,
  fetchMyRanking,
  fetchCategoryRankings,
} from "@/lib/api/rankings";
import {
  RankingListResponse,
  RankingsListParams,
  MyRankingDetailResponse,
  CategoryRankingResponse,
  RankingPeriod,
} from "@/lib/api/types";

// ============================================================
// Query Keys
// ============================================================

export const rankingsKeys = {
  all: ["rankings"] as const,
  list: (params?: RankingsListParams) =>
    [...rankingsKeys.all, "list", params] as const,
  me: () => [...rankingsKeys.all, "me"] as const,
  category: (categoryCode: string, params?: { page?: number; per_page?: number }) =>
    [...rankingsKeys.all, "category", categoryCode, params] as const,
};

// ============================================================
// useRankings - Global rankings leaderboard (infinite query)
// ============================================================

interface UseRankingsParams {
  period?: RankingPeriod;
  perPage?: number;
}

export function useRankings(params?: UseRankingsParams) {
  return useInfiniteQuery({
    queryKey: rankingsKeys.list(params),
    queryFn: async ({ pageParam }): Promise<RankingListResponse> => {
      const page = (pageParam as number) ?? 1;
      return fetchRankings({
        period: params?.period,
        page,
        per_page: params?.perPage ?? 20,
      });
    },
    getNextPageParam: (lastPage) =>
      lastPage.pagination.current_page < lastPage.pagination.total_pages
        ? lastPage.pagination.current_page + 1
        : undefined,
    initialPageParam: 1,
    staleTime: 1000 * 60 * 2, // 2 minutes (rankings update frequently)
  });
}

// ============================================================
// useMyRanking - Current user's detailed ranking (auth required)
// ============================================================

export function useMyRanking(
  options?: Omit<
    UseQueryOptions<MyRankingDetailResponse, Error>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: rankingsKeys.me(),
    queryFn: fetchMyRanking,
    staleTime: 1000 * 60 * 2, // 2 minutes
    ...options,
  });
}

// ============================================================
// useCategoryRankings - Category-specific rankings (infinite query)
// ============================================================

interface UseCategoryRankingsParams {
  categoryCode: string;
  perPage?: number;
}

export function useCategoryRankings(params: UseCategoryRankingsParams) {
  return useInfiniteQuery({
    queryKey: rankingsKeys.category(params.categoryCode, {
      per_page: params.perPage,
    }),
    queryFn: async ({ pageParam }): Promise<CategoryRankingResponse> => {
      const page = (pageParam as number) ?? 1;
      return fetchCategoryRankings(params.categoryCode, {
        page,
        per_page: params.perPage ?? 20,
      });
    },
    getNextPageParam: (lastPage) =>
      lastPage.pagination.current_page < lastPage.pagination.total_pages
        ? lastPage.pagination.current_page + 1
        : undefined,
    initialPageParam: 1,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}
