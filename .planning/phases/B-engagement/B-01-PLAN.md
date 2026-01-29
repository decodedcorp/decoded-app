---
phase: B-engagement
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - packages/web/lib/api/types.ts
  - packages/web/lib/api/votes.ts
  - packages/web/lib/api/index.ts
  - packages/web/lib/hooks/useVotes.ts
  - packages/web/app/api/v1/solutions/[solutionId]/votes/route.ts
  - packages/web/app/api/v1/solutions/[solutionId]/adopt/route.ts
autonomous: true

must_haves:
  truths:
    - "User can see vote counts (accurate/different) on a solution"
    - "User can vote on a solution with immediate UI feedback"
    - "User can retract their vote"
    - "Post owner can adopt a solution"
  artifacts:
    - path: "packages/web/lib/api/types.ts"
      provides: "Vote and Adopt TypeScript types matching OpenAPI spec"
      contains: "VoteStatsResponse"
    - path: "packages/web/lib/api/votes.ts"
      provides: "Vote API client functions"
      exports: ["fetchVoteStats", "createVote", "deleteVote", "adoptSolution", "unadoptSolution"]
    - path: "packages/web/lib/hooks/useVotes.ts"
      provides: "React Query hooks for votes"
      exports: ["useVoteStats", "useVote", "useRetractVote", "useAdoptSolution"]
    - path: "packages/web/app/api/v1/solutions/[solutionId]/votes/route.ts"
      provides: "API proxy for vote endpoints"
      exports: ["GET", "POST", "DELETE"]
  key_links:
    - from: "packages/web/lib/api/votes.ts"
      to: "/api/v1/solutions/{solutionId}/votes"
      via: "apiClient"
      pattern: "apiClient.*solutions.*votes"
    - from: "packages/web/lib/hooks/useVotes.ts"
      to: "packages/web/lib/api/votes.ts"
      via: "React Query mutation/query"
      pattern: "useMutation.*createVote|useQuery.*fetchVoteStats"
---

<objective>
Implement vote system API integration for solutions

Purpose: Enable users to vote (accurate/different) on solutions, see vote counts, retract votes, and allow post owners to adopt solutions.

Output:
- Vote types in types.ts
- API client functions in votes.ts
- React Query hooks in useVotes.ts
- API proxy routes for vote endpoints
</objective>

<execution_context>
@/Users/kiyeol/.claude-work/get-shit-done/workflows/execute-plan.md
@/Users/kiyeol/.claude-work/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/PROJECT.md
@.planning/ROADMAP.md
@.planning/STATE.md
@.planning/phases/06-api-foundation-profile/06-01-SUMMARY.md
@packages/web/lib/api/client.ts
@packages/web/lib/api/types.ts
@packages/web/lib/hooks/useProfile.ts
@packages/web/app/api/v1/users/me/route.ts
</context>

<tasks>

<task type="auto">
  <name>Task 1: Add Vote and Adopt types to types.ts</name>
  <files>packages/web/lib/api/types.ts</files>
  <action>
Add the following types at the end of types.ts, following the OpenAPI spec pattern:

```typescript
// ============================================================
// Vote API Types
// GET /api/v1/solutions/{solution_id}/votes
// POST /api/v1/solutions/{solution_id}/votes
// DELETE /api/v1/solutions/{solution_id}/votes
// ============================================================

export type VoteType = 'accurate' | 'different';

export interface VoteStatsResponse {
  solution_id: string;
  accurate_count: number;
  different_count: number;
  total_count: number;
  accuracy_rate: number;
  user_vote: VoteType | null;
}

export interface CreateVoteDto {
  vote_type: VoteType;
}

export interface VoteResponse {
  id: string;
  solution_id: string;
  user_id: string;
  vote_type: VoteType;
  created_at: string;
}

// ============================================================
// Adopt Solution API Types
// POST /api/v1/solutions/{solution_id}/adopt
// DELETE /api/v1/solutions/{solution_id}/adopt
// ============================================================

export type MatchType = 'perfect' | 'close';

export interface AdoptSolutionDto {
  match_type: MatchType;
}

export interface AdoptResponse {
  solution_id: string;
  is_adopted: boolean;
  match_type: MatchType;
  adopted_at: string;
  updated_spot: unknown; // Spot object, define if needed
}
```
  </action>
  <verify>yarn tsc --noEmit passes without errors</verify>
  <done>Vote types (VoteStatsResponse, CreateVoteDto, VoteResponse, AdoptSolutionDto, AdoptResponse) added to types.ts</done>
</task>

<task type="auto">
  <name>Task 2: Create vote API functions and proxy routes</name>
  <files>
    packages/web/lib/api/votes.ts
    packages/web/lib/api/index.ts
    packages/web/app/api/v1/solutions/[solutionId]/votes/route.ts
    packages/web/app/api/v1/solutions/[solutionId]/adopt/route.ts
  </files>
  <action>
**Create packages/web/lib/api/votes.ts:**

```typescript
/**
 * Vote API Functions
 * Client functions for solution voting and adoption
 */

import { apiClient } from "./client";
import {
  VoteStatsResponse,
  CreateVoteDto,
  VoteResponse,
  AdoptSolutionDto,
  AdoptResponse,
} from "./types";

/**
 * Fetch vote stats for a solution
 * GET /api/v1/solutions/{solution_id}/votes
 */
export async function fetchVoteStats(solutionId: string): Promise<VoteStatsResponse> {
  return apiClient<VoteStatsResponse>({
    path: `/api/v1/solutions/${solutionId}/votes`,
    method: "GET",
    requiresAuth: false, // Can view stats without auth, but user_vote requires auth
  });
}

/**
 * Vote on a solution
 * POST /api/v1/solutions/{solution_id}/votes
 */
export async function createVote(
  solutionId: string,
  data: CreateVoteDto
): Promise<VoteResponse> {
  return apiClient<VoteResponse>({
    path: `/api/v1/solutions/${solutionId}/votes`,
    method: "POST",
    body: data,
    requiresAuth: true,
  });
}

/**
 * Retract vote from a solution
 * DELETE /api/v1/solutions/{solution_id}/votes
 */
export async function deleteVote(solutionId: string): Promise<void> {
  await apiClient<void>({
    path: `/api/v1/solutions/${solutionId}/votes`,
    method: "DELETE",
    requiresAuth: true,
  });
}

/**
 * Adopt a solution (post owner only)
 * POST /api/v1/solutions/{solution_id}/adopt
 */
export async function adoptSolution(
  solutionId: string,
  data: AdoptSolutionDto
): Promise<AdoptResponse> {
  return apiClient<AdoptResponse>({
    path: `/api/v1/solutions/${solutionId}/adopt`,
    method: "POST",
    body: data,
    requiresAuth: true,
  });
}

/**
 * Unadopt a solution (post owner only)
 * DELETE /api/v1/solutions/{solution_id}/adopt
 */
export async function unadoptSolution(solutionId: string): Promise<void> {
  await apiClient<void>({
    path: `/api/v1/solutions/${solutionId}/adopt`,
    method: "DELETE",
    requiresAuth: true,
  });
}
```

**Update packages/web/lib/api/index.ts** - Add vote exports:

```typescript
export * from "./votes";
```

**Create packages/web/app/api/v1/solutions/[solutionId]/votes/route.ts:**

```typescript
/**
 * Vote Proxy API Route
 * GET /api/v1/solutions/[solutionId]/votes - Fetch vote stats
 * POST /api/v1/solutions/[solutionId]/votes - Create vote (auth required)
 * DELETE /api/v1/solutions/[solutionId]/votes - Delete vote (auth required)
 */

import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.API_BASE_URL;

type RouteContext = {
  params: Promise<{ solutionId: string }>;
};

export async function GET(request: NextRequest, context: RouteContext) {
  if (!API_BASE_URL) {
    return NextResponse.json(
      { message: "Server configuration error" },
      { status: 500 }
    );
  }

  const { solutionId } = await context.params;
  const authHeader = request.headers.get("Authorization");

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/solutions/${solutionId}/votes`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(authHeader && { Authorization: authHeader }),
        },
      }
    );

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Votes GET proxy error:", error);
    return NextResponse.json(
      { message: "Failed to fetch vote stats" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest, context: RouteContext) {
  if (!API_BASE_URL) {
    return NextResponse.json(
      { message: "Server configuration error" },
      { status: 500 }
    );
  }

  const { solutionId } = await context.params;
  const authHeader = request.headers.get("Authorization");

  if (!authHeader) {
    return NextResponse.json(
      { message: "Authentication required" },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();

    const response = await fetch(
      `${API_BASE_URL}/api/v1/solutions/${solutionId}/votes`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: authHeader,
        },
        body: JSON.stringify(body),
      }
    );

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Votes POST proxy error:", error);
    return NextResponse.json(
      { message: "Failed to create vote" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  if (!API_BASE_URL) {
    return NextResponse.json(
      { message: "Server configuration error" },
      { status: 500 }
    );
  }

  const { solutionId } = await context.params;
  const authHeader = request.headers.get("Authorization");

  if (!authHeader) {
    return NextResponse.json(
      { message: "Authentication required" },
      { status: 401 }
    );
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/solutions/${solutionId}/votes`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: authHeader,
        },
      }
    );

    if (response.status === 204) {
      return new NextResponse(null, { status: 204 });
    }

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Votes DELETE proxy error:", error);
    return NextResponse.json(
      { message: "Failed to delete vote" },
      { status: 500 }
    );
  }
}
```

**Create packages/web/app/api/v1/solutions/[solutionId]/adopt/route.ts:**

```typescript
/**
 * Adopt Solution Proxy API Route
 * POST /api/v1/solutions/[solutionId]/adopt - Adopt solution (auth required, spotter only)
 * DELETE /api/v1/solutions/[solutionId]/adopt - Unadopt solution (auth required)
 */

import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.API_BASE_URL;

type RouteContext = {
  params: Promise<{ solutionId: string }>;
};

export async function POST(request: NextRequest, context: RouteContext) {
  if (!API_BASE_URL) {
    return NextResponse.json(
      { message: "Server configuration error" },
      { status: 500 }
    );
  }

  const { solutionId } = await context.params;
  const authHeader = request.headers.get("Authorization");

  if (!authHeader) {
    return NextResponse.json(
      { message: "Authentication required" },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();

    const response = await fetch(
      `${API_BASE_URL}/api/v1/solutions/${solutionId}/adopt`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: authHeader,
        },
        body: JSON.stringify(body),
      }
    );

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Adopt POST proxy error:", error);
    return NextResponse.json(
      { message: "Failed to adopt solution" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  if (!API_BASE_URL) {
    return NextResponse.json(
      { message: "Server configuration error" },
      { status: 500 }
    );
  }

  const { solutionId } = await context.params;
  const authHeader = request.headers.get("Authorization");

  if (!authHeader) {
    return NextResponse.json(
      { message: "Authentication required" },
      { status: 401 }
    );
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/solutions/${solutionId}/adopt`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: authHeader,
        },
      }
    );

    if (response.status === 204) {
      return new NextResponse(null, { status: 204 });
    }

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Adopt DELETE proxy error:", error);
    return NextResponse.json(
      { message: "Failed to unadopt solution" },
      { status: 500 }
    );
  }
}
```
  </action>
  <verify>
- yarn tsc --noEmit passes
- Files exist: votes.ts, votes/route.ts, adopt/route.ts
- index.ts exports vote functions
  </verify>
  <done>
- votes.ts with fetchVoteStats, createVote, deleteVote, adoptSolution, unadoptSolution
- Proxy routes for /solutions/[solutionId]/votes and /solutions/[solutionId]/adopt
- index.ts updated with vote exports
  </done>
</task>

<task type="auto">
  <name>Task 3: Create React Query hooks for votes</name>
  <files>packages/web/lib/hooks/useVotes.ts</files>
  <action>
Create packages/web/lib/hooks/useVotes.ts following the useProfile.ts pattern:

```typescript
/**
 * Vote Hooks
 * React Query hooks for solution voting and adoption
 */

import { useQuery, useMutation, useQueryClient, UseQueryOptions } from "@tanstack/react-query";
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
  AdoptSolutionDto,
  VoteType,
} from "@/lib/api/types";

// ============================================================
// Query Keys
// ============================================================

export const voteKeys = {
  all: ["votes"] as const,
  stats: (solutionId: string) => [...voteKeys.all, "stats", solutionId] as const,
};

// ============================================================
// useVoteStats - Fetch vote statistics for a solution
// ============================================================

export function useVoteStats(
  solutionId: string,
  options?: Omit<UseQueryOptions<VoteStatsResponse, Error>, "queryKey" | "queryFn">
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
// useVote - Create a vote on a solution
// ============================================================

export function useVote(solutionId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (voteType: VoteType) => createVote(solutionId, { vote_type: voteType }),
    onMutate: async (voteType) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: voteKeys.stats(solutionId) });

      // Snapshot previous value
      const previousStats = queryClient.getQueryData<VoteStatsResponse>(
        voteKeys.stats(solutionId)
      );

      // Optimistically update
      if (previousStats) {
        const newStats: VoteStatsResponse = {
          ...previousStats,
          user_vote: voteType,
          accurate_count: voteType === 'accurate'
            ? previousStats.accurate_count + 1
            : previousStats.accurate_count - (previousStats.user_vote === 'accurate' ? 1 : 0),
          different_count: voteType === 'different'
            ? previousStats.different_count + 1
            : previousStats.different_count - (previousStats.user_vote === 'different' ? 1 : 0),
          total_count: previousStats.total_count + (previousStats.user_vote ? 0 : 1),
        };
        // Recalculate accuracy rate
        newStats.accuracy_rate = newStats.total_count > 0
          ? (newStats.accurate_count / newStats.total_count) * 100
          : 0;

        queryClient.setQueryData(voteKeys.stats(solutionId), newStats);
      }

      return { previousStats };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousStats) {
        queryClient.setQueryData(voteKeys.stats(solutionId), context.previousStats);
      }
    },
    onSettled: () => {
      // Refetch to ensure consistency
      queryClient.invalidateQueries({ queryKey: voteKeys.stats(solutionId) });
    },
  });
}

// ============================================================
// useRetractVote - Remove vote from a solution
// ============================================================

export function useRetractVote(solutionId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => deleteVote(solutionId),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: voteKeys.stats(solutionId) });

      const previousStats = queryClient.getQueryData<VoteStatsResponse>(
        voteKeys.stats(solutionId)
      );

      if (previousStats && previousStats.user_vote) {
        const newStats: VoteStatsResponse = {
          ...previousStats,
          user_vote: null,
          accurate_count: previousStats.user_vote === 'accurate'
            ? previousStats.accurate_count - 1
            : previousStats.accurate_count,
          different_count: previousStats.user_vote === 'different'
            ? previousStats.different_count - 1
            : previousStats.different_count,
          total_count: previousStats.total_count - 1,
        };
        newStats.accuracy_rate = newStats.total_count > 0
          ? (newStats.accurate_count / newStats.total_count) * 100
          : 0;

        queryClient.setQueryData(voteKeys.stats(solutionId), newStats);
      }

      return { previousStats };
    },
    onError: (err, variables, context) => {
      if (context?.previousStats) {
        queryClient.setQueryData(voteKeys.stats(solutionId), context.previousStats);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: voteKeys.stats(solutionId) });
    },
  });
}

// ============================================================
// useAdoptSolution - Adopt a solution (post owner only)
// ============================================================

export function useAdoptSolution(solutionId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AdoptSolutionDto) => adoptSolution(solutionId, data),
    onSuccess: () => {
      // Invalidate related queries to reflect adoption status
      queryClient.invalidateQueries({ queryKey: voteKeys.stats(solutionId) });
      // TODO: Invalidate solution queries when Track A implements them
    },
  });
}

// ============================================================
// useUnadoptSolution - Remove adoption (post owner only)
// ============================================================

export function useUnadoptSolution(solutionId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => unadoptSolution(solutionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: voteKeys.stats(solutionId) });
    },
  });
}
```
  </action>
  <verify>
- yarn tsc --noEmit passes
- Exports: useVoteStats, useVote, useRetractVote, useAdoptSolution, useUnadoptSolution
  </verify>
  <done>
React Query hooks created:
- useVoteStats: Query for vote statistics
- useVote: Mutation with optimistic update
- useRetractVote: Mutation with optimistic update
- useAdoptSolution: Mutation for adoption
- useUnadoptSolution: Mutation for unadoption
  </done>
</task>

</tasks>

<verification>
After all tasks complete:

1. **Type check**: `yarn tsc --noEmit` passes
2. **Files exist**:
   - packages/web/lib/api/votes.ts
   - packages/web/lib/hooks/useVotes.ts
   - packages/web/app/api/v1/solutions/[solutionId]/votes/route.ts
   - packages/web/app/api/v1/solutions/[solutionId]/adopt/route.ts
3. **Exports verified**:
   - types.ts exports VoteStatsResponse, VoteType, etc.
   - votes.ts exports fetchVoteStats, createVote, deleteVote, adoptSolution, unadoptSolution
   - useVotes.ts exports useVoteStats, useVote, useRetractVote, useAdoptSolution, useUnadoptSolution
</verification>

<success_criteria>
- All vote types match OpenAPI spec
- API functions follow established pattern (apiClient with path, method, requiresAuth)
- Proxy routes forward requests to backend correctly
- React Query hooks provide optimistic updates for immediate UI feedback
- TypeScript compilation succeeds
</success_criteria>

<output>
After completion, create `.planning/phases/B-engagement/B-01-SUMMARY.md`
</output>
