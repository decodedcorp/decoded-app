---
phase: C-gamification
plan: 02
type: execute
wave: 1
depends_on: []
files_modified:
  - packages/web/lib/api/types.ts
  - packages/web/lib/api/badges.ts
  - packages/web/lib/api/index.ts
  - packages/web/lib/hooks/useBadges.ts
  - packages/web/app/api/v1/badges/route.ts
  - packages/web/app/api/v1/badges/me/route.ts
  - packages/web/app/api/v1/badges/[badge_id]/route.ts
autonomous: true

must_haves:
  truths:
    - "User can view all available badges with their criteria and rarity"
    - "Authenticated user can see their earned badges with timestamps"
    - "User can see badge progress for in-progress badges"
    - "User can view detailed information for any badge"
  artifacts:
    - path: "packages/web/lib/api/badges.ts"
      provides: "Badges API functions"
      exports: ["fetchBadges", "fetchMyBadges", "fetchBadgeById"]
    - path: "packages/web/lib/hooks/useBadges.ts"
      provides: "React Query hooks for badges"
      exports: ["useBadges", "useMyBadges", "useBadge", "badgesKeys"]
    - path: "packages/web/app/api/v1/badges/route.ts"
      provides: "API proxy for badges endpoint"
      exports: ["GET"]
  key_links:
    - from: "packages/web/lib/hooks/useBadges.ts"
      to: "packages/web/lib/api/badges.ts"
      via: "React Query queryFn calls"
      pattern: "fetch(Badges|MyBadges|BadgeById)"
    - from: "packages/web/lib/api/badges.ts"
      to: "packages/web/lib/api/client.ts"
      via: "apiClient import"
      pattern: "apiClient"
---

<objective>
Implement Badges API integration with TypeScript types, API functions, React Query hooks, and proxy routes.

Purpose: Enable users to view all available badges, their earned badges with progress, and detailed badge information. This covers requirements BDGE-01, BDGE-02, and BDGE-03.

Output:
- Updated `types.ts`: Badge-related TypeScript interfaces matching OpenAPI spec
- `badges.ts`: API functions for badge endpoints
- `useBadges.ts`: React Query hooks for badge data
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
  <name>Task 1: Add Badge TypeScript types to types.ts</name>
  <files>packages/web/lib/api/types.ts</files>
  <action>
Append Badge-related TypeScript interfaces to the existing types.ts file. Match the backend OpenAPI spec exactly.

Add these types:

```typescript
// ============================================================
// Badges API Types
// GET /api/v1/badges, GET /api/v1/badges/me, GET /api/v1/badges/{badge_id}
// ============================================================

export type BadgeType =
  | 'specialist'
  | 'category'
  | 'achievement'
  | 'milestone'
  | 'explorer'
  | 'shopper';

export type BadgeRarity = 'common' | 'rare' | 'epic' | 'legendary';

export interface BadgeCriteria {
  type: string;
  threshold: number;
  category_code?: string;
  description?: string;
}

export interface BadgeResponse {
  id: string;
  type: BadgeType;
  name: string;
  criteria: BadgeCriteria;
  rarity: BadgeRarity;
  description?: string;
  icon_url?: string;
  created_at: string;
}

// GET /api/v1/badges response
export interface BadgeListResponse {
  data: BadgeResponse[];
}

// GET /api/v1/badges/me response - earned badges
export interface EarnedBadgeItem {
  id: string;
  badge: BadgeResponse;
  earned_at: string;
}

// GET /api/v1/badges/me response - available/in-progress badges
export interface BadgeProgress {
  current: number;
  target: number;
  percentage: number;
}

export interface AvailableBadgeItem {
  badge: BadgeResponse;
  progress: BadgeProgress;
}

export interface MyBadgesResponse {
  data: EarnedBadgeItem[];
  available_badges: AvailableBadgeItem[];
}
```
  </action>
  <verify>
Check types exist:
`grep -E "interface (BadgeResponse|BadgeListResponse|MyBadgesResponse|EarnedBadgeItem)" packages/web/lib/api/types.ts`
  </verify>
  <done>
types.ts contains all Badge-related interfaces (BadgeResponse, BadgeListResponse, MyBadgesResponse, EarnedBadgeItem, AvailableBadgeItem)
  </done>
</task>

<task type="auto">
  <name>Task 2: Create Badges API functions and proxy routes</name>
  <files>packages/web/lib/api/badges.ts, packages/web/lib/api/index.ts, packages/web/app/api/v1/badges/route.ts, packages/web/app/api/v1/badges/me/route.ts, packages/web/app/api/v1/badges/[badge_id]/route.ts</files>
  <action>
1. Create `badges.ts` with API functions using the apiClient pattern:

```typescript
/**
 * Badges API Functions
 * - All badges list
 * - User's earned badges
 * - Badge details
 */

import { apiClient } from "./client";
import {
  BadgeListResponse,
  MyBadgesResponse,
  BadgeResponse,
} from "./types";

// ============================================================
// GET /api/v1/badges
// Fetch all available badges (public)
// ============================================================

export async function fetchBadges(): Promise<BadgeListResponse> {
  return apiClient<BadgeListResponse>({
    path: "/api/v1/badges",
    method: "GET",
    requiresAuth: false,
  });
}

// ============================================================
// GET /api/v1/badges/me
// Fetch user's badges and progress (auth required)
// ============================================================

export async function fetchMyBadges(): Promise<MyBadgesResponse> {
  return apiClient<MyBadgesResponse>({
    path: "/api/v1/badges/me",
    method: "GET",
    requiresAuth: true,
  });
}

// ============================================================
// GET /api/v1/badges/{badge_id}
// Fetch single badge details (public)
// ============================================================

export async function fetchBadgeById(badgeId: string): Promise<BadgeResponse> {
  return apiClient<BadgeResponse>({
    path: `/api/v1/badges/${encodeURIComponent(badgeId)}`,
    method: "GET",
    requiresAuth: false,
  });
}
```

2. Update `index.ts` to export badges functions (append to existing exports):
```typescript
// Badges APIs
export {
  fetchBadges,
  fetchMyBadges,
  fetchBadgeById,
} from "./badges";
```

3. Create API proxy routes (following Phase 6 pattern):

`app/api/v1/badges/route.ts`:
```typescript
import { NextResponse } from 'next/server';

const API_BASE = process.env.API_BASE_URL || 'https://dev.decoded.style';

export async function GET() {
  const response = await fetch(`${API_BASE}/api/v1/badges`);
  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}
```

`app/api/v1/badges/me/route.ts`:
```typescript
import { NextRequest, NextResponse } from 'next/server';

const API_BASE = process.env.API_BASE_URL || 'https://dev.decoded.style';

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');

  if (!authHeader) {
    return NextResponse.json({ message: '로그인이 필요합니다.' }, { status: 401 });
  }

  const response = await fetch(`${API_BASE}/api/v1/badges/me`, {
    headers: { 'Authorization': authHeader },
  });

  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}
```

`app/api/v1/badges/[badge_id]/route.ts`:
```typescript
import { NextRequest, NextResponse } from 'next/server';

const API_BASE = process.env.API_BASE_URL || 'https://dev.decoded.style';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ badge_id: string }> }
) {
  const { badge_id } = await params;

  const response = await fetch(
    `${API_BASE}/api/v1/badges/${encodeURIComponent(badge_id)}`
  );

  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}
```
  </action>
  <verify>
Check badges.ts exports:
`grep -E "export async function (fetchBadges|fetchMyBadges|fetchBadgeById)" packages/web/lib/api/badges.ts`
Check index.ts exports:
`grep "fetchBadges" packages/web/lib/api/index.ts`
Check proxy routes exist:
`ls packages/web/app/api/v1/badges/`
  </verify>
  <done>
badges.ts exports fetchBadges, fetchMyBadges, fetchBadgeById; proxy routes created for all three endpoints
  </done>
</task>

<task type="auto">
  <name>Task 3: Create React Query hooks for badges</name>
  <files>packages/web/lib/hooks/useBadges.ts</files>
  <action>
Create `useBadges.ts` with React Query hooks following the useProfile.ts pattern.

```typescript
/**
 * Badges Hooks
 * React Query hooks for badge data
 */

import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import {
  fetchBadges,
  fetchMyBadges,
  fetchBadgeById,
} from "@/lib/api/badges";
import {
  BadgeListResponse,
  MyBadgesResponse,
  BadgeResponse,
} from "@/lib/api/types";

// ============================================================
// Query Keys
// ============================================================

export const badgesKeys = {
  all: ["badges"] as const,
  list: () => [...badgesKeys.all, "list"] as const,
  my: () => [...badgesKeys.all, "my"] as const,
  detail: (badgeId: string) => [...badgesKeys.all, "detail", badgeId] as const,
};

// ============================================================
// useBadges - All available badges
// ============================================================

export function useBadges(
  options?: Omit<UseQueryOptions<BadgeListResponse, Error>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: badgesKeys.list(),
    queryFn: fetchBadges,
    staleTime: 1000 * 60 * 30, // 30 minutes (badges rarely change)
    ...options,
  });
}

// ============================================================
// useMyBadges - User's earned and in-progress badges
// ============================================================

export function useMyBadges(
  options?: Omit<UseQueryOptions<MyBadgesResponse, Error>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: badgesKeys.my(),
    queryFn: fetchMyBadges,
    staleTime: 1000 * 60 * 5, // 5 minutes
    ...options,
  });
}

// ============================================================
// useBadge - Single badge details
// ============================================================

export function useBadge(
  badgeId: string,
  options?: Omit<UseQueryOptions<BadgeResponse, Error>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: badgesKeys.detail(badgeId),
    queryFn: () => fetchBadgeById(badgeId),
    enabled: !!badgeId,
    staleTime: 1000 * 60 * 30, // 30 minutes
    ...options,
  });
}

// ============================================================
// Helper types for UI components
// ============================================================

/**
 * Combines earned and available badges into a unified view
 * Useful for profile badge display sections
 */
export interface UnifiedBadgeView {
  badge: BadgeResponse;
  isEarned: boolean;
  earnedAt?: string;
  progress?: {
    current: number;
    target: number;
    percentage: number;
  };
}

/**
 * Transform MyBadgesResponse into unified view for easier UI rendering
 */
export function transformToUnifiedBadges(data: MyBadgesResponse): UnifiedBadgeView[] {
  const earned: UnifiedBadgeView[] = data.data.map((item) => ({
    badge: item.badge,
    isEarned: true,
    earnedAt: item.earned_at,
  }));

  const available: UnifiedBadgeView[] = data.available_badges.map((item) => ({
    badge: item.badge,
    isEarned: false,
    progress: item.progress,
  }));

  return [...earned, ...available];
}
```
  </action>
  <verify>
Check hook exports:
`grep -E "export function (useBadges|useMyBadges|useBadge)" packages/web/lib/hooks/useBadges.ts`
Check query keys export:
`grep "export const badgesKeys" packages/web/lib/hooks/useBadges.ts`
Check helper function:
`grep "export function transformToUnifiedBadges" packages/web/lib/hooks/useBadges.ts`
  </verify>
  <done>
useBadges.ts exports useBadges, useMyBadges, useBadge hooks, badgesKeys, and transformToUnifiedBadges helper
  </done>
</task>

</tasks>

<verification>
1. TypeScript compiles without errors:
   `cd packages/web && yarn tsc --noEmit`

2. All badge types exist:
   `grep -E "interface (BadgeResponse|BadgeListResponse|MyBadgesResponse)" packages/web/lib/api/types.ts`

3. All API functions are exported:
   `grep -E "export async function fetch(Badges|MyBadges|BadgeById)" packages/web/lib/api/badges.ts`

4. All hooks are exported:
   `grep -E "export function (useBadges|useMyBadges|useBadge)" packages/web/lib/hooks/useBadges.ts`

5. Proxy routes exist:
   `ls -la packages/web/app/api/v1/badges/`
</verification>

<success_criteria>
- Badge TypeScript types match backend OpenAPI spec (BDGE-01, BDGE-02, BDGE-03)
- API functions fetchBadges, fetchMyBadges, fetchBadgeById work correctly
- React Query hooks provide typed access to badge data
- Helper function transformToUnifiedBadges simplifies UI rendering
- API proxy routes forward requests to backend without CORS issues
- TypeScript compiles successfully
</success_criteria>

<output>
After completion, create `.planning/phases/C-gamification/C-02-SUMMARY.md`
</output>
