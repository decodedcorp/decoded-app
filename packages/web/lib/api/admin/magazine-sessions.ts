/**
 * Magazine sessions API - proxies to decoded-agent.
 *
 * Requires DECODED_AGENT_URL (default http://localhost:11000).
 */

const AGENT_URL =
  process.env.DECODED_AGENT_URL || "http://localhost:11000";

export interface MagazineSession {
  id: string;
  thread_id: string;
  topic: string;
  image_urls: string[];
  current_step: string;
  step_status: string;
  images_json: unknown[];
  outline: Record<string, unknown>;
  sections: unknown[];
  layout_spec: Record<string, unknown>;
  revision_history: unknown[];
}

export interface MagazineSessionListItem {
  id: string;
  thread_id: string;
  topic: string;
  current_step: string;
  created_at: string | null;
}

export interface CreateSessionParams {
  user_id: string;
  topic?: string;
  image_urls?: string[];
}

async function agentFetch<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const url = `${AGENT_URL}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`decoded-agent error ${res.status}: ${text}`);
  }
  return res.json() as Promise<T>;
}

export async function listMagazineSessions(): Promise<{
  sessions: MagazineSessionListItem[];
}> {
  return agentFetch("/magazine-sessions");
}

export async function getMagazineSession(
  sessionId: string
): Promise<MagazineSession> {
  return agentFetch(`/magazine-sessions/${sessionId}`);
}

export async function createMagazineSession(
  params: CreateSessionParams
): Promise<{ session_id: string; thread_id: string }> {
  return agentFetch("/magazine-sessions", {
    method: "POST",
    body: JSON.stringify({
      user_id: params.user_id,
      topic: params.topic ?? "",
      image_urls: params.image_urls ?? [],
    }),
  });
}

export async function runVisionStep(sessionId: string): Promise<{
  step: string;
  status: string;
  images_json?: unknown[];
}> {
  return agentFetch(`/magazine-sessions/${sessionId}/step/vision`, {
    method: "POST",
  });
}

export async function runPlannerStep(sessionId: string): Promise<{
  step: string;
  status: string;
  outline?: Record<string, unknown>;
}> {
  return agentFetch(`/magazine-sessions/${sessionId}/step/planner`, {
    method: "POST",
  });
}
