/**
 * Solutions Hooks
 * React Query hooks for solution CRUD and metadata operations
 */

import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryOptions,
} from "@tanstack/react-query";
import {
  fetchSolutions,
  createSolution,
  updateSolution,
  deleteSolution,
  extractSolutionMetadata,
  convertAffiliate,
} from "@/lib/api/solutions";
import type {
  Solution,
  CreateSolutionDto,
  UpdateSolutionDto,
  ExtractMetadataResponse,
  ConvertAffiliateResponse,
} from "@/lib/api/types";

// ============================================================
// Query Keys
// ============================================================

export const solutionKeys = {
  all: ["solutions"] as const,
  lists: () => [...solutionKeys.all, "list"] as const,
  list: (spotId: string) => [...solutionKeys.lists(), spotId] as const,
};

// ============================================================
// useSolutions - Fetch solutions for a spot
// ============================================================

export function useSolutions(
  spotId: string,
  options?: Omit<UseQueryOptions<Solution[], Error>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: solutionKeys.list(spotId),
    queryFn: () => fetchSolutions(spotId),
    enabled: !!spotId,
    staleTime: 1000 * 60, // 1 minute
    ...options,
  });
}

// ============================================================
// useCreateSolution - Create a new solution
// ============================================================

interface CreateSolutionVariables {
  spotId: string;
  data: CreateSolutionDto;
}

export function useCreateSolution() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ spotId, data }: CreateSolutionVariables) =>
      createSolution(spotId, data),
    onSuccess: (newSolution, { spotId }) => {
      // Add to cache
      queryClient.setQueryData<Solution[]>(
        solutionKeys.list(spotId),
        (old) => (old ? [...old, newSolution] : [newSolution])
      );
      // Invalidate to ensure fresh data
      queryClient.invalidateQueries({ queryKey: solutionKeys.list(spotId) });
    },
    onError: (error) => {
      console.error("[useCreateSolution] Failed to create solution:", error);
    },
  });
}

// ============================================================
// useUpdateSolution - Update an existing solution
// ============================================================

interface UpdateSolutionVariables {
  solutionId: string;
  spotId: string; // Needed for cache invalidation
  data: UpdateSolutionDto;
}

export function useUpdateSolution() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ solutionId, data }: UpdateSolutionVariables) =>
      updateSolution(solutionId, data),
    onSuccess: (updatedSolution, { spotId }) => {
      // Update in cache
      queryClient.setQueryData<Solution[]>(
        solutionKeys.list(spotId),
        (old) =>
          old
            ? old.map((sol) =>
                sol.id === updatedSolution.id ? updatedSolution : sol
              )
            : [updatedSolution]
      );
    },
    onError: (error) => {
      console.error("[useUpdateSolution] Failed to update solution:", error);
    },
  });
}

// ============================================================
// useDeleteSolution - Delete a solution
// ============================================================

interface DeleteSolutionVariables {
  solutionId: string;
  spotId: string; // Needed for cache invalidation
}

export function useDeleteSolution() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ solutionId }: DeleteSolutionVariables) =>
      deleteSolution(solutionId),
    onSuccess: (_, { solutionId, spotId }) => {
      // Remove from cache
      queryClient.setQueryData<Solution[]>(
        solutionKeys.list(spotId),
        (old) => (old ? old.filter((sol) => sol.id !== solutionId) : [])
      );
    },
    onError: (error) => {
      console.error("[useDeleteSolution] Failed to delete solution:", error);
    },
  });
}

// ============================================================
// useExtractMetadata - Extract metadata from URL
// ============================================================

export function useExtractMetadata() {
  return useMutation<ExtractMetadataResponse, Error, string>({
    mutationFn: (url: string) => extractSolutionMetadata(url),
    onError: (error) => {
      console.error("[useExtractMetadata] Failed to extract metadata:", error);
    },
  });
}

// ============================================================
// useConvertAffiliate - Convert URL to affiliate link
// ============================================================

export function useConvertAffiliate() {
  return useMutation<ConvertAffiliateResponse, Error, string>({
    mutationFn: (url: string) => convertAffiliate(url),
    onError: (error) => {
      console.error(
        "[useConvertAffiliate] Failed to convert affiliate:",
        error
      );
    },
  });
}
