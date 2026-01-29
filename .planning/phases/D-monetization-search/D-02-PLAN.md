---
phase: D-monetization-search
plan: 02
type: execute
wave: 1
depends_on: []
files_modified:
  - packages/web/lib/api/types.ts
  - packages/web/lib/api/settlements.ts
  - packages/web/lib/api/index.ts
  - packages/web/app/api/v1/settlements/route.ts
  - packages/web/app/api/v1/settlements/withdraw/route.ts
  - packages/web/lib/hooks/useSettlements.ts
autonomous: true

must_haves:
  truths:
    - "User can view settlement history via API"
    - "User can request withdrawal (shows 'not yet supported' message from backend)"
  artifacts:
    - path: "packages/web/lib/api/settlements.ts"
      provides: "Settlement API functions"
      exports: ["fetchSettlements", "requestWithdrawal"]
    - path: "packages/web/lib/hooks/useSettlements.ts"
      provides: "React Query hooks for settlements"
      exports: ["useSettlements", "useWithdrawal"]
    - path: "packages/web/app/api/v1/settlements/route.ts"
      provides: "API proxy for settlements list"
    - path: "packages/web/app/api/v1/settlements/withdraw/route.ts"
      provides: "API proxy for withdrawal requests"
  key_links:
    - from: "packages/web/lib/api/settlements.ts"
      to: "/api/v1/settlements"
      via: "apiClient"
      pattern: "apiClient.*path.*settlements"
    - from: "packages/web/lib/hooks/useSettlements.ts"
      to: "packages/web/lib/api/settlements.ts"
      via: "import"
      pattern: "import.*fetchSettlements.*from.*settlements"
---

<objective>
Implement settlement and withdrawal API integration.

Purpose: Enable users to view their settlement history and request withdrawals (withdrawal returns "not yet supported" from backend, but we implement the client-side flow).

Output:
- TypeScript types matching OpenAPI spec for settlements
- API client functions for settlement retrieval and withdrawal requests
- React Query hooks for data fetching and mutations
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
  <name>Task 1: Add Settlement TypeScript Types</name>
  <files>packages/web/lib/api/types.ts</files>
  <action>
Add the following types to lib/api/types.ts at the end of the file:

```typescript
// ============================================================
// Settlements API Types
// GET /api/v1/settlements
// ============================================================

export type SettlementStatus = "pending" | "processing" | "completed" | "failed";

export interface Settlement {
  id: string;
  amount: number;
  currency: string;  // e.g., "KRW"
  status: SettlementStatus;
  created_at: string;
  completed_at?: string;
}

export interface SettlementsResponse {
  data: Settlement[];
}

// ============================================================
// Withdrawal Request API Types
// POST /api/v1/settlements/withdraw
// ============================================================

export interface WithdrawRequest {
  amount: number;
  bank_code: string;
  account_number: string;
  account_holder: string;
}

export interface WithdrawResponse {
  id?: string;
  message?: string;  // Backend returns error message for unsupported operation
}
```
  </action>
  <verify>Run `yarn tsc --noEmit` to verify TypeScript compilation. Grep for SettlementsResponse and WithdrawRequest to confirm types are added.</verify>
  <done>Settlement and withdrawal types are defined in types.ts matching OpenAPI spec.</done>
</task>

<task type="auto">
  <name>Task 2: Create Settlement API Client Functions</name>
  <files>
    packages/web/lib/api/settlements.ts
    packages/web/lib/api/index.ts
  </files>
  <action>
**Create packages/web/lib/api/settlements.ts:**

```typescript
/**
 * Settlements API Functions
 * Handles settlement history and withdrawal requests
 */

import { apiClient } from "./client";
import type { SettlementsResponse, WithdrawRequest, WithdrawResponse } from "./types";

/**
 * Fetch settlements history for current user
 * GET /api/v1/settlements
 * Requires authentication
 */
export async function fetchSettlements(): Promise<SettlementsResponse> {
  return apiClient<SettlementsResponse>({
    path: "/api/v1/settlements",
    method: "GET",
    requiresAuth: true,
  });
}

/**
 * Request a withdrawal
 * POST /api/v1/settlements/withdraw
 * Requires authentication
 *
 * Note: Backend currently returns "아직 지원하지 않습니다" (not yet supported)
 */
export async function requestWithdrawal(data: WithdrawRequest): Promise<WithdrawResponse> {
  return apiClient<WithdrawResponse>({
    path: "/api/v1/settlements/withdraw",
    method: "POST",
    body: data,
    requiresAuth: true,
  });
}
```

**Update packages/web/lib/api/index.ts:**
Add exports for the settlements module:

```typescript
// Settlements API
export { fetchSettlements, requestWithdrawal } from "./settlements";
```
  </action>
  <verify>Run `yarn tsc --noEmit`. Verify exports: grep for "fetchSettlements" and "requestWithdrawal" in index.ts.</verify>
  <done>Settlement API functions are created following established apiClient pattern.</done>
</task>

<task type="auto">
  <name>Task 3: Create API Proxy Routes for Settlements</name>
  <files>
    packages/web/app/api/v1/settlements/route.ts
    packages/web/app/api/v1/settlements/withdraw/route.ts
  </files>
  <action>
Create API proxy routes following the established pattern.

**Create packages/web/app/api/v1/settlements/route.ts:**

```typescript
/**
 * Settlements List Proxy API Route
 * GET /api/v1/settlements - Fetch settlement history (auth required)
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
    const response = await fetch(`${API_BASE_URL}/api/v1/settlements`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader,
      },
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Settlements GET proxy error:", error);
    return NextResponse.json(
      { message: "Failed to fetch settlements" },
      { status: 500 }
    );
  }
}
```

**Create packages/web/app/api/v1/settlements/withdraw/route.ts:**

```typescript
/**
 * Withdrawal Request Proxy API Route
 * POST /api/v1/settlements/withdraw - Request withdrawal (auth required)
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

  const authHeader = request.headers.get("Authorization");
  if (!authHeader) {
    return NextResponse.json(
      { message: "Authentication required" },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();

    const response = await fetch(`${API_BASE_URL}/api/v1/settlements/withdraw`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Settlements/withdraw POST proxy error:", error);
    return NextResponse.json(
      { message: "Failed to request withdrawal" },
      { status: 500 }
    );
  }
}
```
  </action>
  <verify>Run `yarn tsc --noEmit`. Check that all route files exist in correct directories.</verify>
  <done>API proxy routes are created for settlement endpoints.</done>
</task>

<task type="auto">
  <name>Task 4: Create React Query Hooks for Settlements</name>
  <files>packages/web/lib/hooks/useSettlements.ts</files>
  <action>
Create packages/web/lib/hooks/useSettlements.ts following the established pattern:

```typescript
/**
 * Settlements Hooks
 * React Query hooks for settlement history and withdrawals
 */

import { useQuery, useMutation, useQueryClient, UseQueryOptions } from "@tanstack/react-query";
import { fetchSettlements, requestWithdrawal } from "@/lib/api";
import type { SettlementsResponse, WithdrawRequest, WithdrawResponse } from "@/lib/api/types";

// ============================================================
// Query Keys
// ============================================================

export const settlementsKeys = {
  all: ["settlements"] as const,
  list: () => [...settlementsKeys.all, "list"] as const,
};

// ============================================================
// useSettlements - Settlement history for current user
// ============================================================

export function useSettlements(
  options?: Omit<UseQueryOptions<SettlementsResponse, Error>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: settlementsKeys.list(),
    queryFn: fetchSettlements,
    staleTime: 1000 * 60 * 5, // 5 minutes
    ...options,
  });
}

// ============================================================
// useWithdrawal - Mutation for requesting withdrawal
// ============================================================

export function useWithdrawal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: WithdrawRequest) => requestWithdrawal(data),
    onSuccess: () => {
      // Invalidate settlements to reflect new withdrawal request
      queryClient.invalidateQueries({ queryKey: settlementsKeys.all });
    },
    onError: (error) => {
      console.error("[useWithdrawal] Failed to request withdrawal:", error);
    },
  });
}
```
  </action>
  <verify>Run `yarn tsc --noEmit`. Grep for useSettlements and useWithdrawal in the hooks file.</verify>
  <done>React Query hooks are created for settlements with proper query keys and mutation.</done>
</task>

</tasks>

<verification>
1. TypeScript compilation: `yarn tsc --noEmit` passes without errors
2. Types defined: `Settlement`, `SettlementsResponse`, `WithdrawRequest` exist in types.ts
3. API functions: `fetchSettlements`, `requestWithdrawal` exported from lib/api/index.ts
4. Proxy routes: Both settlements route files exist with correct HTTP handlers
5. Hooks: `useSettlements`, `useWithdrawal` exported from useSettlements.ts
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
After completion, create `.planning/phases/D-monetization-search/D-02-SUMMARY.md`
</output>
