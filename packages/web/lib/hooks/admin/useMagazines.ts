/**
 * React Query hooks for saved magazines (magazines table).
 */

import { useQuery } from "@tanstack/react-query";

export interface MagazineSpec {
  outline?: Record<string, unknown>;
  sections?: unknown[];
  layout_spec?: Record<string, unknown>;
  writer_headline?: string;
  writer_subheadline?: string;
  writer_standfirst?: string;
}

export interface Magazine {
  id: string;
  title: string;
  keywords?: unknown;
  spec: MagazineSpec;
  status?: string;
  created_at?: string;
  updated_at?: string;
}

async function adminFetch<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    credentials: "include",
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { error?: string }).error || `API error: ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export function useMagazine(magazineId: string | null) {
  return useQuery<Magazine>({
    queryKey: ["admin", "magazines", magazineId],
    queryFn: () => adminFetch<Magazine>(`/api/v1/admin/magazines/${magazineId}`),
    enabled: !!magazineId,
    staleTime: 60_000,
  });
}

export function useMagazines() {
  return useQuery({
    queryKey: ["admin", "magazines"],
    queryFn: async () => {
      const res = await adminFetch<{ magazines: Magazine[] }>("/api/v1/admin/magazines");
      return res.magazines ?? [];
    },
    staleTime: 30_000,
  });
}
