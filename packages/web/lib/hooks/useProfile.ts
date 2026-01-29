/**
 * Profile Hooks
 * React Query hooks for user profile data
 */

import { useQuery, useInfiniteQuery, useMutation, useQueryClient, UseQueryOptions } from "@tanstack/react-query";
import {
  fetchMe,
  updateMe,
  fetchUserStats,
  fetchUserActivities,
  fetchUserById,
} from "@/lib/api/users";
import {
  UpdateUserDto,
  UserResponse,
  UserStatsResponse,
  PaginatedActivitiesResponse,
  ActivitiesListParams,
  UserActivityType,
} from "@/lib/api/types";

// ============================================================
// Query Keys
// ============================================================

export const profileKeys = {
  all: ["profile"] as const,
  me: () => [...profileKeys.all, "me"] as const,
  stats: () => [...profileKeys.all, "stats"] as const,
  activities: (params?: ActivitiesListParams) =>
    [...profileKeys.all, "activities", params] as const,
  user: (userId: string) => [...profileKeys.all, "user", userId] as const,
};

// ============================================================
// useMe - Current user's profile
// ============================================================

export function useMe(
  options?: Omit<UseQueryOptions<UserResponse, Error>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: profileKeys.me(),
    queryFn: fetchMe,
    staleTime: 1000 * 60 * 5, // 5 minutes (profile changes less frequently)
    ...options,
  });
}

// ============================================================
// useUserStats - Current user's statistics
// ============================================================

export function useUserStats(
  options?: Omit<UseQueryOptions<UserStatsResponse, Error>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: profileKeys.stats(),
    queryFn: fetchUserStats,
    staleTime: 1000 * 60 * 2, // 2 minutes
    ...options,
  });
}

// ============================================================
// useUserActivities - Paginated activities
// ============================================================

interface UseUserActivitiesParams {
  type?: UserActivityType;
  perPage?: number;
}

export function useUserActivities(params?: UseUserActivitiesParams) {
  return useInfiniteQuery({
    queryKey: profileKeys.activities(params),
    queryFn: async ({ pageParam }): Promise<PaginatedActivitiesResponse> => {
      const page = (pageParam as number) ?? 1;
      return fetchUserActivities({
        type: params?.type,
        page,
        per_page: params?.perPage ?? 20,
      });
    },
    getNextPageParam: (lastPage) =>
      lastPage.pagination.current_page < lastPage.pagination.total_pages
        ? lastPage.pagination.current_page + 1
        : undefined,
    initialPageParam: 1,
    staleTime: 1000 * 60, // 1 minute
  });
}

// ============================================================
// useUser - Another user's public profile
// ============================================================

export function useUser(
  userId: string,
  options?: Omit<UseQueryOptions<UserResponse, Error>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: profileKeys.user(userId),
    queryFn: () => fetchUserById(userId),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5 minutes
    ...options,
  });
}

// ============================================================
// useUpdateProfile - Mutation for updating profile
// ============================================================

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateUserDto) => updateMe(data),
    onSuccess: (updatedUser) => {
      // Update React Query cache
      queryClient.setQueryData(profileKeys.me(), updatedUser);

      // Sync with profileStore for immediate UI update
      // Import store dynamically to avoid circular dependency
      import("@/lib/stores/profileStore").then(({ useProfileStore }) => {
        useProfileStore.getState().setUserFromApi(updatedUser);
      });

      // Invalidate to trigger refetch in background
      queryClient.invalidateQueries({ queryKey: profileKeys.me() });
    },
    onError: (error) => {
      console.error("[useUpdateProfile] Failed to update profile:", error);
    },
  });
}
