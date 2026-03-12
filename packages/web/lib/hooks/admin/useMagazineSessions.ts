/**
 * React Query hooks for magazine sessions (Magazine Editor Pipeline).
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { supabaseBrowserClient } from "@/lib/supabase/client";

export interface MagazineSession {
  id: string;
  thread_id: string;
  magazine_id?: string | null;
  topic: string;
  image_urls: string[];
  image_count?: number;
  current_step: string;
  step_status: string;
  step_error?: string | null;
  writer_headline?: string | null;
  writer_subheadline?: string | null;
  writer_standfirst?: string | null;
  images_json: unknown[];
  outline: Record<string, unknown>;
  outline_prev?: Record<string, unknown> | null;
  sections: unknown[];
  layout_spec: Record<string, unknown>;
  revision_history: unknown[];
  external_solutions?: { brand?: string; title?: string; url?: string; image_url?: string; category?: string }[];
}

export interface CreateSessionParams {
  topic: string;
  images: File[];
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

export function useMagazineSessions() {
  return useQuery({
    queryKey: ["admin", "magazine-sessions"],
    queryFn: async () => {
      const res = await adminFetch<{ sessions: MagazineSession[] }>(
        "/api/v1/admin/magazine-sessions"
      );
      return res.sessions ?? [];
    },
    staleTime: 30_000,
  });
}

export function useMagazineSession(sessionId: string | null) {
  return useQuery<MagazineSession>({
    queryKey: ["admin", "magazine-sessions", sessionId],
    queryFn: () =>
      adminFetch<MagazineSession>(`/api/v1/admin/magazine-sessions/${sessionId}`),
    enabled: !!sessionId,
    staleTime: 10_000,
  });
}

export function useCreateMagazineSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: CreateSessionParams) => {
      const formData = new FormData();
      formData.append("topic", params.topic);
      for (const file of params.images) {
        formData.append("images", file);
      }
      const res = await fetch("/api/v1/admin/magazine-sessions", {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error((err as { error?: string }).error || `API error: ${res.status}`);
      }
      return res.json() as Promise<{ session_id: string; thread_id: string }>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "magazine-sessions"] });
    },
  });
}

export function useRunMagazineStep(sessionId: string) {
  return useMutation({
    mutationFn: async (step: string) => {
      const res = await adminFetch<{ step: string; status: string }>(
        `/api/v1/admin/magazine-sessions/${sessionId}/step/${step}`,
        { method: "POST" }
      );
      return res;
    },
  });
}

export function useRunVisionStep(sessionId: string) {
  const m = useRunMagazineStep(sessionId);
  return { ...m, mutate: () => m.mutate("vision") };
}

export function useRunPlannerStep(sessionId: string) {
  const m = useRunMagazineStep(sessionId);
  return { ...m, mutate: () => m.mutate("planner") };
}

export function useConfirmMagazineStep(sessionId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const res = await adminFetch<{
        step: string;
        status: string;
        current_step: string;
        previous_step: string;
        saved_post_count?: number;
        saved_post_ids?: string[];
        saved_spot_ids?: string[];
        saved_solution_ids?: string[];
      }>(`/api/v1/admin/magazine-sessions/${sessionId}/confirm`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin", "magazine-sessions", sessionId],
      });
      queryClient.invalidateQueries({ queryKey: ["admin", "magazine-sessions"] });
    },
  });
}

export function useReviseMagazineStep(sessionId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: { feedback: string }) => {
      const res = await adminFetch<{
        step: string;
        status: string;
        current_step: string;
        message?: string;
      }>(`/api/v1/admin/magazine-sessions/${sessionId}/revise`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ feedback: params.feedback ?? "" }),
      });
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin", "magazine-sessions", sessionId],
      });
      queryClient.invalidateQueries({ queryKey: ["admin", "magazine-sessions"] });
    },
  });
}

export function useRemoveSolution(sessionId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (index: number) => {
      const res = await adminFetch<{ ok: boolean; remaining: number }>(
        `/api/v1/admin/magazine-sessions/${sessionId}/solutions/${index}`,
        { method: "DELETE" }
      );
      return res;
    },
    onMutate: async (index: number) => {
      await queryClient.cancelQueries({ queryKey: ["admin", "magazine-sessions", sessionId] });
      const previousSession = queryClient.getQueryData<MagazineSession>([
        "admin",
        "magazine-sessions",
        sessionId,
      ]);
      if (previousSession?.external_solutions && index >= 0 && index < previousSession.external_solutions.length) {
        const next = [...previousSession.external_solutions];
        next.splice(index, 1);
        queryClient.setQueryData<MagazineSession>(
          ["admin", "magazine-sessions", sessionId],
          { ...previousSession, external_solutions: next }
        );
      }
      return { previousSession };
    },
    onError: (_err, _index, context) => {
      if (context?.previousSession != null) {
        queryClient.setQueryData(
          ["admin", "magazine-sessions", sessionId],
          context.previousSession
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin", "magazine-sessions", sessionId],
      });
      queryClient.invalidateQueries({ queryKey: ["admin", "magazine-sessions"] });
    },
  });
}

export function useDeleteMagazineSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (sessionId: string) => {
      await adminFetch(`/api/v1/admin/magazine-sessions/${sessionId}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "magazine-sessions"] });
    },
  });
}

/** Supabase Realtime으로 agent_sessions 변경 감지 → React Query 자동 갱신 */
export function useMagazineSessionRealtime(sessionId: string) {
  const queryClient = useQueryClient();
  useEffect(() => {
    const channel = supabaseBrowserClient
      .channel(`session-${sessionId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "agent_sessions",
          filter: `id=eq.${sessionId}`,
        },
        () => {
          queryClient.invalidateQueries({
            queryKey: ["admin", "magazine-sessions", sessionId],
          });
          queryClient.invalidateQueries({
            queryKey: ["admin", "magazine-sessions"],
          });
        }
      )
      .subscribe();
    return () => {
      supabaseBrowserClient.removeChannel(channel);
    };
  }, [sessionId, queryClient]);
}

/** step 실행 중 경과 시간 (초). active=false 시 0으로 리셋. visibilitychange 보정 포함. */
export function useStepTimer(active: boolean): number {
  const startedAt = useRef<number | null>(null);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!active) {
      startedAt.current = null;
      setElapsed(0);
      return;
    }
    startedAt.current = Date.now();
    const tick = () => {
      if (startedAt.current !== null) {
        setElapsed(Math.floor((Date.now() - startedAt.current) / 1000));
      }
    };
    tick();
    let id = setInterval(tick, 1000);
    const onVisibility = () => {
      clearInterval(id);
      tick();
      id = setInterval(tick, 1000);
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      clearInterval(id);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [active]);

  return elapsed;
}
