---
phase: D-monetization-search
plan: 03
type: execute
wave: 1
depends_on: []
files_modified:
  - packages/web/lib/api/types.ts
  - packages/web/lib/api/search.ts
  - packages/web/lib/api/index.ts
  - packages/web/app/api/v1/search/popular/route.ts
  - packages/web/app/api/v1/search/recent/route.ts
  - packages/web/app/api/v1/search/recent/[id]/route.ts
  - packages/web/lib/hooks/useSearch.ts
autonomous: true

must_haves:
  truths:
    - "User can fetch popular search terms"
    - "User can fetch their recent search history"
    - "User can delete individual search history entries"
  artifacts:
    - path: "packages/web/lib/api/search.ts"
      provides: "Search API functions"
      exports: ["fetchPopularSearchTerms", "fetchRecentSearchTerms", "deleteRecentSearch"]
    - path: "packages/web/lib/hooks/useSearch.ts"
      provides: "React Query hooks for search suggestions"
      exports: ["usePopularSearchTerms", "useRecentSearchTerms", "useDeleteRecentSearch"]
    - path: "packages/web/app/api/v1/search/popular/route.ts"
      provides: "API proxy for popular search terms"
    - path: "packages/web/app/api/v1/search/recent/route.ts"
      provides: "API proxy for recent search terms"
    - path: "packages/web/app/api/v1/search/recent/[id]/route.ts"
      provides: "API proxy for deleting search history"
  key_links:
    - from: "packages/web/lib/api/search.ts"
      to: "/api/v1/search"
      via: "apiClient"
      pattern: "apiClient.*path.*search"
    - from: "packages/web/lib/hooks/useSearch.ts"
      to: "packages/web/lib/api/search.ts"
      via: "import"
      pattern: "import.*fetchPopularSearchTerms.*from.*search"
---

<objective>
Implement search suggestions API integration (popular and recent search terms).

Purpose: Enable users to see trending search terms and their own search history, enhancing content discovery.

Output:
- TypeScript types matching OpenAPI spec for search suggestions
- API client functions for popular and recent search terms
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

# Note: packages/shared/api/search.ts exists but uses different fetch pattern
# We'll create new functions in packages/web/lib/api/search.ts using apiClient
</context>

<tasks>

<task type="auto">
  <name>Task 1: Add Search Suggestion TypeScript Types</name>
  <files>packages/web/lib/api/types.ts</files>
  <action>
Add the following types to lib/api/types.ts at the end of the file:

```typescript
// ============================================================
// Popular Search API Types
// GET /api/v1/search/popular
// ============================================================

export interface PopularSearchTerm {
  keyword: string;
  count: number;
}

export interface PopularSearchResponse {
  data: PopularSearchTerm[];
}

// ============================================================
// Recent Search API Types
// GET /api/v1/search/recent
// DELETE /api/v1/search/recent/{id}
// ============================================================

export interface RecentSearchTerm {
  id: string;
  query: string;
  searched_at: string;
}

export interface RecentSearchResponse {
  data: RecentSearchTerm[];
}

export interface RecentSearchParams {
  limit?: number;  // max 20
}
```
  </action>
  <verify>Run `yarn tsc --noEmit` to verify TypeScript compilation. Grep for PopularSearchResponse and RecentSearchResponse to confirm types are added.</verify>
  <done>Search suggestion types are defined in types.ts matching OpenAPI spec.</done>
</task>

<task type="auto">
  <name>Task 2: Create Search API Client Functions</name>
  <files>
    packages/web/lib/api/search.ts
    packages/web/lib/api/index.ts
  </files>
  <action>
**Create packages/web/lib/api/search.ts:**

```typescript
/**
 * Search Suggestions API Functions
 * Handles popular and recent search terms
 *
 * Note: This is separate from packages/shared/api/search.ts which uses a different fetch pattern.
 * This module uses the shared apiClient for consistency with the rest of the app.
 */

import { apiClient } from "./client";
import type {
  PopularSearchResponse,
  RecentSearchResponse,
  RecentSearchParams,
} from "./types";

/**
 * Fetch popular search terms
 * GET /api/v1/search/popular
 * Does NOT require authentication
 */
export async function fetchPopularSearchTerms(): Promise<PopularSearchResponse> {
  return apiClient<PopularSearchResponse>({
    path: "/api/v1/search/popular",
    method: "GET",
    requiresAuth: false,
  });
}

/**
 * Fetch recent search terms for current user
 * GET /api/v1/search/recent
 * Requires authentication
 */
export async function fetchRecentSearchTerms(
  params?: RecentSearchParams
): Promise<RecentSearchResponse> {
  const queryParams = new URLSearchParams();
  if (params?.limit) {
    queryParams.set("limit", String(Math.min(params.limit, 20))); // max 20
  }
  const queryString = queryParams.toString();
  const path = queryString
    ? `/api/v1/search/recent?${queryString}`
    : "/api/v1/search/recent";

  return apiClient<RecentSearchResponse>({
    path,
    method: "GET",
    requiresAuth: true,
  });
}

/**
 * Delete a recent search entry
 * DELETE /api/v1/search/recent/{id}
 * Requires authentication
 */
export async function deleteRecentSearch(id: string): Promise<void> {
  await apiClient<void>({
    path: `/api/v1/search/recent/${id}`,
    method: "DELETE",
    requiresAuth: true,
  });
}
```

**Update packages/web/lib/api/index.ts:**
Add exports for the search module:

```typescript
// Search API
export { fetchPopularSearchTerms, fetchRecentSearchTerms, deleteRecentSearch } from "./search";
```
  </action>
  <verify>Run `yarn tsc --noEmit`. Verify exports: grep for "fetchPopularSearchTerms" and "fetchRecentSearchTerms" in index.ts.</verify>
  <done>Search API functions are created following established apiClient pattern.</done>
</task>

<task type="auto">
  <name>Task 3: Create API Proxy Routes for Search Suggestions</name>
  <files>
    packages/web/app/api/v1/search/popular/route.ts
    packages/web/app/api/v1/search/recent/route.ts
    packages/web/app/api/v1/search/recent/[id]/route.ts
  </files>
  <action>
Create API proxy routes following the established pattern.

**Create packages/web/app/api/v1/search/popular/route.ts:**

```typescript
/**
 * Popular Search Terms Proxy API Route
 * GET /api/v1/search/popular - Fetch popular search terms (no auth required)
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

  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/search/popular`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Search/popular GET proxy error:", error);
    return NextResponse.json(
      { message: "Failed to fetch popular searches" },
      { status: 500 }
    );
  }
}
```

**Create packages/web/app/api/v1/search/recent/route.ts:**

```typescript
/**
 * Recent Search Terms Proxy API Route
 * GET /api/v1/search/recent - Fetch recent search history (auth required)
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
    // Forward query params (limit)
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get("limit");
    const queryString = limit ? `?limit=${limit}` : "";

    const response = await fetch(`${API_BASE_URL}/api/v1/search/recent${queryString}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader,
      },
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Search/recent GET proxy error:", error);
    return NextResponse.json(
      { message: "Failed to fetch recent searches" },
      { status: 500 }
    );
  }
}
```

**Create packages/web/app/api/v1/search/recent/[id]/route.ts:**

```typescript
/**
 * Delete Recent Search Entry Proxy API Route
 * DELETE /api/v1/search/recent/{id} - Delete a search history entry (auth required)
 */

import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.API_BASE_URL;

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function DELETE(request: NextRequest, context: RouteParams) {
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
    const { id } = await context.params;

    const response = await fetch(`${API_BASE_URL}/api/v1/search/recent/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: authHeader,
      },
    });

    if (response.status === 204) {
      return new NextResponse(null, { status: 204 });
    }

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Search/recent DELETE proxy error:", error);
    return NextResponse.json(
      { message: "Failed to delete search entry" },
      { status: 500 }
    );
  }
}
```
  </action>
  <verify>Run `yarn tsc --noEmit`. Check that all route files exist in correct directories.</verify>
  <done>API proxy routes are created for search suggestion endpoints.</done>
</task>

<task type="auto">
  <name>Task 4: Create React Query Hooks for Search Suggestions</name>
  <files>packages/web/lib/hooks/useSearch.ts</files>
  <action>
Create packages/web/lib/hooks/useSearch.ts following the established pattern:

```typescript
/**
 * Search Suggestions Hooks
 * React Query hooks for popular and recent search terms
 */

import { useQuery, useMutation, useQueryClient, UseQueryOptions } from "@tanstack/react-query";
import {
  fetchPopularSearchTerms,
  fetchRecentSearchTerms,
  deleteRecentSearch,
} from "@/lib/api";
import type {
  PopularSearchResponse,
  RecentSearchResponse,
  RecentSearchParams,
} from "@/lib/api/types";

// ============================================================
// Query Keys
// ============================================================

export const searchKeys = {
  all: ["search"] as const,
  popular: () => [...searchKeys.all, "popular"] as const,
  recent: (params?: RecentSearchParams) => [...searchKeys.all, "recent", params] as const,
};

// ============================================================
// usePopularSearchTerms - Popular/trending search terms
// ============================================================

export function usePopularSearchTerms(
  options?: Omit<UseQueryOptions<PopularSearchResponse, Error>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: searchKeys.popular(),
    queryFn: fetchPopularSearchTerms,
    staleTime: 1000 * 60 * 5, // 5 minutes (popular terms don't change rapidly)
    ...options,
  });
}

// ============================================================
// useRecentSearchTerms - User's recent search history
// ============================================================

export function useRecentSearchTerms(
  params?: RecentSearchParams,
  options?: Omit<UseQueryOptions<RecentSearchResponse, Error>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: searchKeys.recent(params),
    queryFn: () => fetchRecentSearchTerms(params),
    staleTime: 1000 * 60, // 1 minute (recent searches can change more frequently)
    ...options,
  });
}

// ============================================================
// useDeleteRecentSearch - Mutation for deleting search history entry
// ============================================================

export function useDeleteRecentSearch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteRecentSearch(id),
    onSuccess: () => {
      // Invalidate recent searches to refetch after deletion
      queryClient.invalidateQueries({ queryKey: searchKeys.recent() });
    },
    onError: (error) => {
      console.error("[useDeleteRecentSearch] Failed to delete search:", error);
    },
  });
}
```
  </action>
  <verify>Run `yarn tsc --noEmit`. Grep for usePopularSearchTerms and useRecentSearchTerms in the hooks file.</verify>
  <done>React Query hooks are created for search suggestions with proper query keys and mutation.</done>
</task>

</tasks>

<verification>
1. TypeScript compilation: `yarn tsc --noEmit` passes without errors
2. Types defined: `PopularSearchResponse`, `RecentSearchResponse`, `RecentSearchTerm` exist in types.ts
3. API functions: `fetchPopularSearchTerms`, `fetchRecentSearchTerms`, `deleteRecentSearch` exported from lib/api/index.ts
4. Proxy routes: All three search route files exist with correct HTTP handlers
5. Hooks: `usePopularSearchTerms`, `useRecentSearchTerms`, `useDeleteRecentSearch` exported from useSearch.ts
</verification>

<success_criteria>
- [ ] All 4 tasks completed
- [ ] TypeScript compilation passes
- [ ] API types match OpenAPI spec
- [ ] API client functions follow established pattern
- [ ] Proxy routes handle auth (for recent) and no-auth (for popular) correctly
- [ ] React Query hooks are properly typed
</success_criteria>

<output>
After completion, create `.planning/phases/D-monetization-search/D-03-SUMMARY.md`
</output>
