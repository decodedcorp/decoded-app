/**
 * DEBUG ONLY: React Query hook for fetching latest posts
 *
 * This hook is for debugging/reference purposes only.
 * Production code should use image-based queries instead.
 *
 * This hook wraps the Supabase query function with React Query,
 * providing caching, refetching, and loading/error states.
 *
 * @param limit - Maximum number of posts to fetch (default: 10)
 * @returns React Query result with data, loading, error states
 *
 * @example
 * ```tsx
 * function PostsList() {
 *   const { data: posts, isLoading, error } = useLatestPosts(20);
 *
 *   if (isLoading) return <div>Loading...</div>;
 *   if (error) return <div>Error: {error.message}</div>;
 *
 *   return (
 *     <ul>
 *       {posts?.map(post => <li key={post.id}>{post.account}</li>)}
 *     </ul>
 *   );
 * }
 * ```
 */

import { useQuery } from "@tanstack/react-query";
import { fetchLatestPosts } from "@/lib/supabase/queries/debug/posts";
import type { Database } from "@/lib/supabase/types";

type PostRow = Database["public"]["Tables"]["post"]["Row"];

export function useLatestPosts(limit = 10) {
  return useQuery<PostRow[]>({
    queryKey: ["posts", "latest", limit],
    queryFn: () => fetchLatestPosts(limit),
  });
}
