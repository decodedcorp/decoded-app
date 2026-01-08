import { useQuery } from "@tanstack/react-query";
import {
  fetchPostWithImagesAndItems,
  type PostDetail,
} from "@/lib/supabase/queries/posts";

/**
 * React Query hook for fetching a single post with its items and images
 *
 * @param id - Post ID to fetch
 * @returns React Query result with data, loading, error states
 */
export function usePostById(id: string) {
  return useQuery<PostDetail | null>({
    queryKey: ["posts", "detail", id],
    queryFn: () => fetchPostWithImagesAndItems(id),
    enabled: !!id,
  });
}
