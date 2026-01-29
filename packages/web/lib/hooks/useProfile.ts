/**
 * Profile Hooks
 * React Query hooks for user profile and stats
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMe, updateMe, getMyStats } from "@/lib/api/users";
import { UpdateUserDto } from "@/lib/api/types";

// ============================================================
// Query Keys
// ============================================================

export const profileKeys = {
  all: ["profile"] as const,
  me: () => [...profileKeys.all, "me"] as const,
  stats: () => [...profileKeys.all, "stats"] as const,
};

// ============================================================
// useMe - Fetch current user profile
// ============================================================

export function useMe() {
  return useQuery({
    queryKey: profileKeys.me(),
    queryFn: getMe,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
}

// ============================================================
// useMyStats - Fetch current user stats
// ============================================================

export function useMyStats() {
  return useQuery({
    queryKey: profileKeys.stats(),
    queryFn: getMyStats,
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: 1,
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
      // Invalidate and refetch profile queries
      queryClient.invalidateQueries({ queryKey: profileKeys.me() });
      // Optionally update cache directly for instant UI update
      queryClient.setQueryData(profileKeys.me(), updatedUser);
    },
    onError: (error) => {
      console.error("[useUpdateProfile] Failed to update profile:", error);
    },
  });
}
