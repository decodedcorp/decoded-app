---
phase: C-gamification
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - packages/web/lib/api/types.ts
  - packages/web/lib/api/rankings.ts
  - packages/web/lib/api/index.ts
  - packages/web/lib/hooks/useRankings.ts
  - packages/web/app/api/v1/rankings/route.ts
  - packages/web/app/api/v1/rankings/me/route.ts
  - packages/web/app/api/v1/rankings/[category]/route.ts
autonomous: true

must_haves:
  truths:
    - "User can view global rankings leaderboard with paginated data"
    - "Authenticated user can see their own rank position in the list"
    - "User can browse rankings filtered by category"
    - "Rankings display points, solution counts, and user info"
  artifacts:
    - path: "packages/web/lib/api/rankings.ts"
      provides: "Rankings API functions"
      exports: ["fetchRankings", "fetchMyRanking", "fetchCategoryRankings"]
    - path: "packages/web/lib/hooks/useRankings.ts"
      provides: "React Query hooks for rankings"
      exports: ["useRankings", "useMyRanking", "useCategoryRankings", "rankingsKeys"]
    - path: "packages/web/app/api/v1/rankings/route.ts"
      provides: "API proxy for rankings endpoint"
      exports: ["GET"]
  key_links:
    - from: "packages/web/lib/hooks/useRankings.ts"
      to: "packages/web/lib/api/rankings.ts"
      via: "React Query queryFn calls"
      pattern: "fetch(Rankings|MyRanking|CategoryRankings)"
    - from: "packages/web/lib/api/rankings.ts"
      to: "packages/web/lib/api/client.ts"
      via: "apiClient import"
      pattern: "apiClient"
---

<objective>
Implement Rankings API integration with TypeScript types, API functions, React Query hooks, and proxy routes.

Purpose: Enable users to view global rankings, their personal rank, and category-specific rankings. This covers requirements RANK-01, RANK-02, and RANK-03.

Output:
- Updated `types.ts`: Rankings-related TypeScript interfaces matching OpenAPI spec
- `rankings.ts`: API functions for rankings endpoints
- `useRankings.ts`: React Query hooks for rankings data
- API proxy routes for CORS-free backend access
</objective>

<execution_context>
@/Users/kiyeol/.claude-work/get-shit-done/workflows/execute-plan.md
@/Users/kiyeol/.claude-work/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/PROJECT.md
@.planning/ROADMAP.md
@.planning/codebase/CONVENTIONS.md

Reference Phase 6 patterns:
@packages/web/lib/api/client.ts
@packages/web/lib/api/types.ts
@packages/web/lib/api/users.ts
@packages/web/lib/hooks/useProfile.ts
@packages/web/app/api/v1/users/me/route.ts
</context>

<tasks>

<task type="auto">
  <name>Task 1: Add Rankings TypeScript types to types.ts</name>
  <files>packages/web/lib/api/types.ts</files>
  <action>
Append Rankings-related TypeScript interfaces to the existing types.ts file. Match the backend OpenAPI spec exactly.

Add these types:

```typescript
// ============================================================
// Rankings API Types
// GET /api/v1/rankings, GET /api/v1/rankings/me, GET /api/v1/rankings/{category}
// ============================================================

export type RankingPeriod = 'weekly' | 'monthly' | 'all_time';

export interface RankingUser {
  id: string;
  username: string;
  rank: string | null;
  avatar_url: string | null;
}

export interface RankingItem {
  rank: number;
  user: RankingUser;
  total_points: number;
  weekly_points: number;
  solution_count: number;
  adopted_count: number;
  verified_count: number;
}

export interface MyRanking {
  overall_rank: number;
  total_points: number;
  weekly_points: number;
}

export interface PaginationMeta {
  current_page: number;
  per_page: number;
  total_items: number;
  total_pages: number;
}

// GET /api/v1/rankings response
export interface RankingListResponse {
  data: RankingItem[];
  my_ranking?: MyRanking;  // Only present for authenticated users
  pagination: PaginationMeta;
}

export interface RankingsListParams {
  period?: RankingPeriod;
  page?: number;
  per_page?: number;
}

// GET /api/v1/rankings/me response
export interface SolutionStats {
  total: number;
  adopted: number;
  verified: number;
}

export interface CategoryRank {
  category_code: string;
  rank: number;
  points: number;
}

export interface MyRankingDetailResponse {
  overall_rank: number;
  total_points: number;
  weekly_points: number;
  monthly_points: number;
  solution_stats: SolutionStats;
  category_rankings: CategoryRank[];
}

// GET /api/v1/rankings/{category} response
export interface CategoryRankingItem {
  rank: number;
  user: RankingUser;
  points: number;
  solution_count: number;
}

export interface CategoryRankingResponse {
  category_code: string;
  data: CategoryRankingItem[];
  pagination: PaginationMeta;
}

export interface CategoryRankingsParams {
  page?: number;
  per_page?: number;
}
```
  </action>
  <verify>
Check types exist:
`grep -E "interface (RankingListResponse|MyRankingDetailResponse|CategoryRankingResponse)" packages/web/lib/api/types.ts`
  </verify>
  <done>
types.ts contains all Rankings-related interfaces (RankingItem, RankingListResponse, MyRankingDetailResponse, CategoryRankingResponse)
  </done>
</task>

<task type="auto">
  <name>Task 2: Create Rankings API functions and proxy routes</name>
  <files>packages/web/lib/api/rankings.ts, packages/web/lib/api/index.ts, packages/web/app/api/v1/rankings/route.ts, packages/web/app/api/v1/rankings/me/route.ts, packages/web/app/api/v1/rankings/[category]/route.ts</files>
  <action>
1. Create `rankings.ts` with API functions using the apiClient pattern:

```typescript
/**
 * Rankings API Functions
 * - Global rankings
 * - Personal ranking details
 * - Category rankings
 */

import { apiClient } from "./client";
import {
  RankingListResponse,
  RankingsListParams,
  MyRankingDetailResponse,
  CategoryRankingResponse,
  CategoryRankingsParams,
} from "./types";

// ============================================================
// GET /api/v1/rankings
// Fetch global rankings (optional auth for my_ranking field)
// ============================================================

function buildRankingsQueryString(params?: RankingsListParams): string {
  if (!params) return "";

  const searchParams = new URLSearchParams();
  if (params.period) searchParams.set("period", params.period);
  if (params.page !== undefined) searchParams.set("page", String(params.page));
  if (params.per_page !== undefined) searchParams.set("per_page", String(params.per_page));

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : "";
}

export async function fetchRankings(
  params?: RankingsListParams,
  includeMyRanking = false
): Promise<RankingListResponse> {
  const queryString = buildRankingsQueryString(params);

  return apiClient<RankingListResponse>({
    path: `/api/v1/rankings${queryString}`,
    method: "GET",
    requiresAuth: includeMyRanking,  // Auth optional, but needed for my_ranking
  });
}

// ============================================================
// GET /api/v1/rankings/me
// Fetch detailed ranking info for current user (auth required)
// ============================================================

export async function fetchMyRanking(): Promise<MyRankingDetailResponse> {
  return apiClient<MyRankingDetailResponse>({
    path: "/api/v1/rankings/me",
    method: "GET",
    requiresAuth: true,
  });
}

// ============================================================
// GET /api/v1/rankings/{category}
// Fetch rankings for a specific category (public)
// ============================================================

function buildCategoryRankingsQueryString(params?: CategoryRankingsParams): string {
  if (!params) return "";

  const searchParams = new URLSearchParams();
  if (params.page !== undefined) searchParams.set("page", String(params.page));
  if (params.per_page !== undefined) searchParams.set("per_page", String(params.per_page));

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : "";
}

export async function fetchCategoryRankings(
  category: string,
  params?: CategoryRankingsParams
): Promise<CategoryRankingResponse> {
  const queryString = buildCategoryRankingsQueryString(params);

  return apiClient<CategoryRankingResponse>({
    path: `/api/v1/rankings/${encodeURIComponent(category)}${queryString}`,
    method: "GET",
    requiresAuth: false,
  });
}
```

2. Update `index.ts` to export rankings functions:
```typescript
// Rankings APIs
export {
  fetchRankings,
  fetchMyRanking,
  fetchCategoryRankings,
} from "./rankings";
```

3. Create API proxy routes (following Phase 6 pattern from users routes):

`app/api/v1/rankings/route.ts`:
```typescript
import { NextRequest, NextResponse } from 'next/server';

const API_BASE = process.env.API_BASE_URL || 'https://dev.decoded.style';

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const searchParams = request.nextUrl.searchParams.toString();
  const queryString = searchParams ? `?${searchParams}` : '';

  const response = await fetch(`${API_BASE}/api/v1/rankings${queryString}`, {
    headers: authHeader ? { 'Authorization': authHeader } : {},
  });

  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}
```

`app/api/v1/rankings/me/route.ts`:
```typescript
import { NextRequest, NextResponse } from 'next/server';

const API_BASE = process.env.API_BASE_URL || 'https://dev.decoded.style';

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');

  if (!authHeader) {
    return NextResponse.json({ message: '로그인이 필요합니다.' }, { status: 401 });
  }

  const response = await fetch(`${API_BASE}/api/v1/rankings/me`, {
    headers: { 'Authorization': authHeader },
  });

  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}
```

`app/api/v1/rankings/[category]/route.ts`:
```typescript
import { NextRequest, NextResponse } from 'next/server';

const API_BASE = process.env.API_BASE_URL || 'https://dev.decoded.style';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ category: string }> }
) {
  const { category } = await params;
  const searchParams = request.nextUrl.searchParams.toString();
  const queryString = searchParams ? `?${searchParams}` : '';

  const response = await fetch(
    `${API_BASE}/api/v1/rankings/${encodeURIComponent(category)}${queryString}`
  );

  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}
```
  </action>
  <verify>
Check rankings.ts exports:
`grep -E "export async function (fetchRankings|fetchMyRanking|fetchCategoryRankings)" packages/web/lib/api/rankings.ts`
Check index.ts exports:
`grep "fetchRankings" packages/web/lib/api/index.ts`
Check proxy routes exist:
`ls packages/web/app/api/v1/rankings/`
  </verify>
  <done>
rankings.ts exports fetchRankings, fetchMyRanking, fetchCategoryRankings; proxy routes created for all three endpoints
  </done>
</task>

<task type="auto">
  <name>Task 3: Create React Query hooks for rankings</name>
  <files>packages/web/lib/hooks/useRankings.ts</files>
  <action>
Create `useRankings.ts` with React Query hooks following the useProfile.ts pattern.

```typescript
/**
 * Rankings Hooks
 * React Query hooks for rankings data
 */

import { useQuery, useInfiniteQuery, UseQueryOptions } from "@tanstack/react-query";
import {
  fetchRankings,
  fetchMyRanking,
  fetchCategoryRankings,
} from "@/lib/api/rankings";
import {
  RankingListResponse,
  RankingsListParams,
  RankingPeriod,
  MyRankingDetailResponse,
  CategoryRankingResponse,
  CategoryRankingsParams,
} from "@/lib/api/types";

// ============================================================
// Query Keys
// ============================================================

export const rankingsKeys = {
  all: ["rankings"] as const,
  list: (params?: RankingsListParams) => [...rankingsKeys.all, "list", params] as const,
  me: () => [...rankingsKeys.all, "me"] as const,
  category: (category: string, params?: CategoryRankingsParams) =>
    [...rankingsKeys.all, "category", category, params] as const,
};

// ============================================================
// useRankings - Global rankings with pagination
// ============================================================

export interface UseRankingsParams {
  period?: RankingPeriod;
  perPage?: number;
  includeMyRanking?: boolean;
}

export interface RankingsPage {
  items: RankingListResponse['data'];
  myRanking?: RankingListResponse['my_ranking'];
  currentPage: number;
  totalPages: number;
  hasMore: boolean;
}

export function useRankings(params?: UseRankingsParams) {
  const { period, perPage = 20, includeMyRanking = false } = params ?? {};

  return useInfiniteQuery<RankingsPage>({
    queryKey: rankingsKeys.list({ period, per_page: perPage }),
    queryFn: async ({ pageParam }): Promise<RankingsPage> => {
      const page = (pageParam as number) ?? 1;
      const response = await fetchRankings(
        { period, page, per_page: perPage },
        includeMyRanking
      );

      return {
        items: response.data,
        myRanking: response.my_ranking,
        currentPage: response.pagination.current_page,
        totalPages: response.pagination.total_pages,
        hasMore: response.pagination.current_page < response.pagination.total_pages,
      };
    },
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.currentPage + 1 : undefined,
    initialPageParam: 1,
    staleTime: 1000 * 60 * 2, // 2 minutes (rankings change moderately)
  });
}

// ============================================================
// useMyRanking - Detailed ranking for current user
// ============================================================

export function useMyRanking(
  options?: Omit<UseQueryOptions<MyRankingDetailResponse, Error>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: rankingsKeys.me(),
    queryFn: fetchMyRanking,
    staleTime: 1000 * 60 * 5, // 5 minutes
    ...options,
  });
}

// ============================================================
// useCategoryRankings - Rankings for specific category
// ============================================================

export interface UseCategoryRankingsParams {
  perPage?: number;
}

export interface CategoryRankingsPage {
  categoryCode: string;
  items: CategoryRankingResponse['data'];
  currentPage: number;
  totalPages: number;
  hasMore: boolean;
}

export function useCategoryRankings(
  category: string,
  params?: UseCategoryRankingsParams
) {
  const { perPage = 20 } = params ?? {};

  return useInfiniteQuery<CategoryRankingsPage>({
    queryKey: rankingsKeys.category(category, { per_page: perPage }),
    queryFn: async ({ pageParam }): Promise<CategoryRankingsPage> => {
      const page = (pageParam as number) ?? 1;
      const response = await fetchCategoryRankings(category, {
        page,
        per_page: perPage,
      });

      return {
        categoryCode: response.category_code,
        items: response.data,
        currentPage: response.pagination.current_page,
        totalPages: response.pagination.total_pages,
        hasMore: response.pagination.current_page < response.pagination.total_pages,
      };
    },
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.currentPage + 1 : undefined,
    initialPageParam: 1,
    enabled: !!category,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}
```
  </action>
  <verify>
Check hook exports:
`grep -E "export function (useRankings|useMyRanking|useCategoryRankings)" packages/web/lib/hooks/useRankings.ts`
Check query keys export:
`grep "export const rankingsKeys" packages/web/lib/hooks/useRankings.ts`
  </verify>
  <done>
useRankings.ts exports useRankings, useMyRanking, useCategoryRankings hooks and rankingsKeys
  </done>
</task>

</tasks>

<verification>
1. TypeScript compiles without errors:
   `cd packages/web && yarn tsc --noEmit`

2. All rankings types exist:
   `grep -E "interface (RankingItem|RankingListResponse|MyRankingDetailResponse)" packages/web/lib/api/types.ts`

3. All API functions are exported:
   `grep -E "export async function fetch(Rankings|MyRanking|CategoryRankings)" packages/web/lib/api/rankings.ts`

4. All hooks are exported:
   `grep -E "export function use(Rankings|MyRanking|CategoryRankings)" packages/web/lib/hooks/useRankings.ts`

5. Proxy routes exist:
   `ls -la packages/web/app/api/v1/rankings/`
</verification>

<success_criteria>
- Rankings TypeScript types match backend OpenAPI spec (RANK-01, RANK-02, RANK-03)
- API functions fetchRankings, fetchMyRanking, fetchCategoryRankings work correctly
- React Query hooks provide typed access with infinite pagination
- API proxy routes forward requests to backend without CORS issues
- TypeScript compiles successfully
</success_criteria>

<output>
After completion, create `.planning/phases/C-gamification/C-01-SUMMARY.md`
</output>
