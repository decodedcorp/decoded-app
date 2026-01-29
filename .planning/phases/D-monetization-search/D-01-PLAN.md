---
phase: D-monetization-search
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - packages/web/lib/api/types.ts
  - packages/web/lib/api/clicks.ts
  - packages/web/lib/api/earnings.ts
  - packages/web/lib/api/index.ts
  - packages/web/app/api/v1/clicks/route.ts
  - packages/web/app/api/v1/clicks/stats/route.ts
  - packages/web/app/api/v1/earnings/route.ts
  - packages/web/lib/hooks/useEarnings.ts
autonomous: true

must_haves:
  truths:
    - "User can fetch click statistics via API"
    - "Affiliate link clicks can be recorded"
    - "User can fetch earnings summary via API"
  artifacts:
    - path: "packages/web/lib/api/clicks.ts"
      provides: "Click API functions"
      exports: ["fetchClickStats", "recordClick"]
    - path: "packages/web/lib/api/earnings.ts"
      provides: "Earnings API functions"
      exports: ["fetchEarnings"]
    - path: "packages/web/lib/hooks/useEarnings.ts"
      provides: "React Query hooks for earnings data"
      exports: ["useClickStats", "useEarnings", "useRecordClick"]
    - path: "packages/web/app/api/v1/clicks/route.ts"
      provides: "API proxy for click recording"
    - path: "packages/web/app/api/v1/clicks/stats/route.ts"
      provides: "API proxy for click stats"
    - path: "packages/web/app/api/v1/earnings/route.ts"
      provides: "API proxy for earnings"
  key_links:
    - from: "packages/web/lib/api/clicks.ts"
      to: "/api/v1/clicks"
      via: "apiClient"
      pattern: "apiClient.*path.*clicks"
    - from: "packages/web/lib/hooks/useEarnings.ts"
      to: "packages/web/lib/api/clicks.ts"
      via: "import"
      pattern: "import.*fetchClickStats.*from.*clicks"
---

<objective>
Implement click tracking and earnings API integration.

Purpose: Enable users to track affiliate link clicks and view their earnings summary, establishing the foundation for the monetization dashboard.

Output:
- TypeScript types matching OpenAPI spec for clicks, earnings
- API client functions for click tracking and earnings
- React Query hooks for data fetching
- API proxy routes to avoid CORS
</objective>

<execution_context>
@/Users/kiyeol/.claude-work/get-shit-done/workflows/execute-plan.md
@/Users/kiyeol/.claude-work/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/PROJECT.md
@.planning/ROADMAP.md
@.planning/STATE.md

# Established patterns from Phase 6
@packages/web/lib/api/client.ts
@packages/web/lib/api/types.ts
@packages/web/lib/api/users.ts
@packages/web/lib/hooks/useProfile.ts
@packages/web/app/api/v1/users/me/route.ts
</context>

<tasks>

<task type="auto">
  <name>Task 1: Add Click and Earnings TypeScript Types</name>
  <files>packages/web/lib/api/types.ts</files>
  <action>
Add the following types to lib/api/types.ts at the end of the file:

```typescript
// ============================================================
// Click Stats API Types
// GET /api/v1/clicks/stats
// ============================================================

export interface MonthlyClickStat {
  month: string;  // YYYY-MM format
  clicks: number;
  unique_clicks: number;
}

export interface ClickStatsResponse {
  total_clicks: number;
  unique_clicks: number;
  monthly_stats: MonthlyClickStat[];
}

// ============================================================
// Record Click API Types
// POST /api/v1/clicks
// ============================================================

export interface CreateClickDto {
  solution_id: string;
  referrer?: string;
}

// ============================================================
// Earnings API Types
// GET /api/v1/earnings
// ============================================================

export interface MonthlyEarning {
  month: string;  // YYYY-MM format
  earnings: number;
}

export interface EarningsResponse {
  total_earnings: number;
  available_balance: number;
  pending_settlement: number;
  monthly_earnings: MonthlyEarning[];
}
```

Follow the existing pattern in the file with clear section comments.
  </action>
  <verify>Run `yarn tsc --noEmit` to verify TypeScript compilation. Grep for ClickStatsResponse and EarningsResponse to confirm types are added.</verify>
  <done>All click and earnings types are defined in types.ts matching OpenAPI spec.</done>
</task>

<task type="auto">
  <name>Task 2: Create Click and Earnings API Client Functions</name>
  <files>
    packages/web/lib/api/clicks.ts
    packages/web/lib/api/earnings.ts
    packages/web/lib/api/index.ts
  </files>
  <action>
**Create packages/web/lib/api/clicks.ts:**

```typescript
/**
 * Click Tracking API Functions
 * Handles click recording and statistics retrieval
 */

import { apiClient } from "./client";
import type { ClickStatsResponse, CreateClickDto } from "./types";

/**
 * Fetch click statistics for current user
 * GET /api/v1/clicks/stats
 * Requires authentication
 */
export async function fetchClickStats(): Promise<ClickStatsResponse> {
  return apiClient<ClickStatsResponse>({
    path: "/api/v1/clicks/stats",
    method: "GET",
    requiresAuth: true,
  });
}

/**
 * Record a click event
 * POST /api/v1/clicks
 * Does NOT require authentication (tracking happens before login)
 */
export async function recordClick(data: CreateClickDto): Promise<void> {
  await apiClient<void>({
    path: "/api/v1/clicks",
    method: "POST",
    body: data,
    requiresAuth: false,
  });
}
```

**Create packages/web/lib/api/earnings.ts:**

```typescript
/**
 * Earnings API Functions
 * Handles earnings data retrieval
 */

import { apiClient } from "./client";
import type { EarningsResponse } from "./types";

/**
 * Fetch earnings summary for current user
 * GET /api/v1/earnings
 * Requires authentication
 */
export async function fetchEarnings(): Promise<EarningsResponse> {
  return apiClient<EarningsResponse>({
    path: "/api/v1/earnings",
    method: "GET",
    requiresAuth: true,
  });
}
```

**Update packages/web/lib/api/index.ts:**
Add exports for the new modules:

```typescript
// Clicks API
export { fetchClickStats, recordClick } from "./clicks";

// Earnings API
export { fetchEarnings } from "./earnings";
```
  </action>
  <verify>Run `yarn tsc --noEmit`. Verify exports: grep for "fetchClickStats" and "fetchEarnings" in index.ts.</verify>
  <done>Click and earnings API functions are created following established apiClient pattern.</done>
</task>

<task type="auto">
  <name>Task 3: Create API Proxy Routes for Clicks and Earnings</name>
  <files>
    packages/web/app/api/v1/clicks/route.ts
    packages/web/app/api/v1/clicks/stats/route.ts
    packages/web/app/api/v1/earnings/route.ts
  </files>
  <action>
Create API proxy routes following the pattern from users/me/route.ts.

**Create packages/web/app/api/v1/clicks/route.ts:**

```typescript
/**
 * Click Recording Proxy API Route
 * POST /api/v1/clicks - Record a click event (no auth required)
 */

import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.API_BASE_URL;

export async function POST(request: NextRequest) {
  if (!API_BASE_URL) {
    console.error("API_BASE_URL environment variable is not configured");
    return NextResponse.json(
      { message: "Server configuration error" },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();

    const response = await fetch(`${API_BASE_URL}/api/v1/clicks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (response.status === 201) {
      return NextResponse.json({ success: true }, { status: 201 });
    }

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Clicks POST proxy error:", error);
    return NextResponse.json(
      { message: "Failed to record click" },
      { status: 500 }
    );
  }
}
```

**Create packages/web/app/api/v1/clicks/stats/route.ts:**

```typescript
/**
 * Click Stats Proxy API Route
 * GET /api/v1/clicks/stats - Fetch click statistics (auth required)
 */

import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.API_BASE_URL;

export async function GET(request: NextRequest) {
  if (!API_BASE_URL) {
    console.error("API_BASE_URL environment variable is not configured");
    return NextResponse.json(
      { message: "Server configuration error" },
      { status: 500 }
    );
  }

  const authHeader = request.headers.get("Authorization");
  if (!authHeader) {
    return NextResponse.json(
      { message: "Authentication required" },
      { status: 401 }
    );
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/clicks/stats`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader,
      },
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Clicks/stats GET proxy error:", error);
    return NextResponse.json(
      { message: "Failed to fetch click statistics" },
      { status: 500 }
    );
  }
}
```

**Create packages/web/app/api/v1/earnings/route.ts:**

```typescript
/**
 * Earnings Proxy API Route
 * GET /api/v1/earnings - Fetch earnings summary (auth required)
 */

import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.API_BASE_URL;

export async function GET(request: NextRequest) {
  if (!API_BASE_URL) {
    console.error("API_BASE_URL environment variable is not configured");
    return NextResponse.json(
      { message: "Server configuration error" },
      { status: 500 }
    );
  }

  const authHeader = request.headers.get("Authorization");
  if (!authHeader) {
    return NextResponse.json(
      { message: "Authentication required" },
      { status: 401 }
    );
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/earnings`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader,
      },
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Earnings GET proxy error:", error);
    return NextResponse.json(
      { message: "Failed to fetch earnings" },
      { status: 500 }
    );
  }
}
```
  </action>
  <verify>Run `yarn tsc --noEmit`. Check that all route files exist in correct directories.</verify>
  <done>API proxy routes are created for clicks and earnings endpoints.</done>
</task>

<task type="auto">
  <name>Task 4: Create React Query Hooks for Earnings</name>
  <files>packages/web/lib/hooks/useEarnings.ts</files>
  <action>
Create packages/web/lib/hooks/useEarnings.ts following the pattern from useProfile.ts:

```typescript
/**
 * Earnings Hooks
 * React Query hooks for click tracking and earnings data
 */

import { useQuery, useMutation, UseQueryOptions } from "@tanstack/react-query";
import { fetchClickStats, recordClick, fetchEarnings } from "@/lib/api";
import type { ClickStatsResponse, EarningsResponse, CreateClickDto } from "@/lib/api/types";

// ============================================================
// Query Keys
// ============================================================

export const earningsKeys = {
  all: ["earnings"] as const,
  clicks: () => [...earningsKeys.all, "clicks"] as const,
  clickStats: () => [...earningsKeys.clicks(), "stats"] as const,
  earnings: () => [...earningsKeys.all, "summary"] as const,
};

// ============================================================
// useClickStats - Click statistics for current user
// ============================================================

export function useClickStats(
  options?: Omit<UseQueryOptions<ClickStatsResponse, Error>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: earningsKeys.clickStats(),
    queryFn: fetchClickStats,
    staleTime: 1000 * 60 * 5, // 5 minutes (stats don't change rapidly)
    ...options,
  });
}

// ============================================================
// useEarnings - Earnings summary for current user
// ============================================================

export function useEarnings(
  options?: Omit<UseQueryOptions<EarningsResponse, Error>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: earningsKeys.earnings(),
    queryFn: fetchEarnings,
    staleTime: 1000 * 60 * 5, // 5 minutes
    ...options,
  });
}

// ============================================================
// useRecordClick - Mutation for recording clicks
// ============================================================

export function useRecordClick() {
  return useMutation({
    mutationFn: (data: CreateClickDto) => recordClick(data),
    onError: (error) => {
      console.error("[useRecordClick] Failed to record click:", error);
    },
  });
}
```
  </action>
  <verify>Run `yarn tsc --noEmit`. Grep for useClickStats and useEarnings in the hooks file.</verify>
  <done>React Query hooks are created for click stats and earnings with proper query keys and stale times.</done>
</task>

</tasks>

<verification>
1. TypeScript compilation: `yarn tsc --noEmit` passes without errors
2. Types defined: `ClickStatsResponse`, `EarningsResponse`, `CreateClickDto` exist in types.ts
3. API functions: `fetchClickStats`, `recordClick`, `fetchEarnings` exported from lib/api/index.ts
4. Proxy routes: All three route files exist and have correct HTTP handlers
5. Hooks: `useClickStats`, `useEarnings`, `useRecordClick` exported from useEarnings.ts
</verification>

<success_criteria>
- [ ] All 4 tasks completed
- [ ] TypeScript compilation passes
- [ ] API types match OpenAPI spec
- [ ] API client functions follow established pattern
- [ ] Proxy routes handle auth and error cases
- [ ] React Query hooks are properly typed
</success_criteria>

<output>
After completion, create `.planning/phases/D-monetization-search/D-01-SUMMARY.md`
</output>
