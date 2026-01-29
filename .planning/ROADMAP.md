# Roadmap: decoded-app

## Milestones

- [x] **v1.0 Documentation Optimization** - Phases 1-5 (shipped 2026-01-29)
- [ ] **v1.1 Full API Integration** - Phase 6 + Tracks A-D (in progress)

## Overview

v1.1 connects all backend APIs to the frontend. **Parallel execution via git worktrees:**

1. **Phase 6 (Foundation)** - API 클라이언트 패턴 확립 (순차, 먼저 완료)
2. **Tracks A-D** - 4개 워크트리에서 병렬 실행

```
main (Phase 6 완료)
    ├── worktree: decoded-track-a (Content CRUD)
    ├── worktree: decoded-track-b (Engagement)
    ├── worktree: decoded-track-c (Gamification)
    └── worktree: decoded-track-d (Monetization)
```

## Phases

<details>
<summary>v1.0 Documentation Optimization (Phases 1-5) - SHIPPED 2026-01-29</summary>

See archived roadmap for v1.0 phase details.

</details>

### v1.1 Full API Integration (In Progress)

**Milestone Goal:** Connect all backend APIs to frontend for complete user experience

#### Sequential (Main Branch)
- [ ] **Phase 6: API Foundation & Profile** - API client patterns + Profile APIs

#### Parallel Tracks (Git Worktrees) - After Phase 6
- [ ] **Track A: Content CRUD** - Posts, Spots, Solutions (worktree: `decoded-track-a`)
- [ ] **Track B: Engagement** - Votes, Comments (worktree: `decoded-track-b`)
- [ ] **Track C: Gamification** - Rankings, Badges (worktree: `decoded-track-c`)
- [ ] **Track D: Monetization & Search** - Earnings, Search (worktree: `decoded-track-d`)

## Phase Details

---

### Phase 6: API Foundation & Profile (Main Branch)
**Goal**: Establish API client patterns and implement profile features
**Depends on**: v1.0 completion
**Requirements**: PROF-01, PROF-02, PROF-03, PROF-04, PROF-05
**Branch**: `main` or `feature/phase-6-foundation`
**Success Criteria** (what must be TRUE):
  1. Shared API client with auth token injection established
  2. React Query hooks pattern for mutations established
  3. User can view their own profile page with real data
  4. User can edit their profile and see changes persist
  5. User can view activity history and stats
  6. User can view other users' public profiles

Plans:
- [ ] 06-01: API client foundation (fetch wrapper, auth, error handling)
- [ ] 06-02: Profile read APIs (me, stats, activities, public profile)
- [ ] 06-03: Profile write APIs (update profile)

**After Phase 6 completes:** Create 4 worktrees for parallel execution

---

### Track A: Content CRUD (Parallel)
**Goal**: Users can fully manage their posts, spots, and solutions
**Depends on**: Phase 6 (API client patterns)
**Requirements**: POST-01, POST-02, SPOT-01, SPOT-02, SPOT-03, SPOT-04, SOLN-01, SOLN-02, SOLN-03, SOLN-04, SOLN-05, SOLN-06
**Worktree**: `../decoded-track-a`
**Branch**: `feature/track-a-content`
**Success Criteria** (what must be TRUE):
  1. User can edit their own posts
  2. User can delete their own posts
  3. User can add/edit/delete spots on posts
  4. User can submit solutions with auto-extracted metadata
  5. User can edit/delete their solutions

Plans:
- [ ] A-01: Post edit/delete operations
- [ ] A-02: Spot CRUD operations
- [ ] A-03: Solution CRUD with metadata extraction

---

### Track B: Engagement (Parallel)
**Goal**: Users can vote on solutions and engage through comments
**Depends on**: Phase 6 (API client patterns)
**Requirements**: VOTE-01, VOTE-02, VOTE-03, VOTE-04, VOTE-05, CMNT-01, CMNT-02, CMNT-03, CMNT-04
**Worktree**: `../decoded-track-b`
**Branch**: `feature/track-b-engagement`
**Success Criteria** (what must be TRUE):
  1. User can see vote counts on solutions
  2. User can vote (accurate/different) with immediate UI update
  3. User can retract their vote
  4. Post owner can adopt a solution
  5. User can view/write/edit/delete comments

Plans:
- [ ] B-01: Vote system (vote, retract, adopt)
- [ ] B-02: Comment CRUD operations

---

### Track C: Gamification (Parallel)
**Goal**: Users can see their standing and achievements
**Depends on**: Phase 6 (API client patterns)
**Requirements**: RANK-01, RANK-02, RANK-03, BDGE-01, BDGE-02, BDGE-03
**Worktree**: `../decoded-track-c`
**Branch**: `feature/track-c-gamification`
**Success Criteria** (what must be TRUE):
  1. User can view global rankings leaderboard
  2. User can see their own rank position
  3. User can browse rankings by category
  4. User can view all available badges
  5. User can see their earned badges on profile

Plans:
- [ ] C-01: Rankings display (global, personal, category)
- [ ] C-02: Badge system integration

---

### Track D: Monetization & Search (Parallel)
**Goal**: Users can track earnings and discover content
**Depends on**: Phase 6 (API client patterns)
**Requirements**: EARN-01, EARN-02, EARN-03, EARN-04, EARN-05, SRCH-01, SRCH-02
**Worktree**: `../decoded-track-d`
**Branch**: `feature/track-d-monetization`
**Success Criteria** (what must be TRUE):
  1. User can view click statistics on solutions
  2. Affiliate link clicks are tracked
  3. User can see earnings summary and history
  4. User can view settlements and request withdrawals
  5. User can see popular/recent search terms

Plans:
- [ ] D-01: Click tracking and earnings dashboard
- [ ] D-02: Settlement and withdrawal flow
- [ ] D-03: Search suggestions (popular/recent)

## Progress

**Execution Order:**
1. Phase 6 (Foundation) - Sequential on main
2. Tracks A-D - Parallel via worktrees
3. Merge all tracks to main

### Sequential Phase (Main)

| Phase | Plans | Status | Completed |
|-------|-------|--------|-----------|
| 1-5. Documentation (v1.0) | 5/5 | Complete | 2026-01-29 |
| 6. API Foundation & Profile | 0/3 | Not started | - |

### Parallel Tracks (Worktrees)

| Track | Worktree | Branch | Plans | Status |
|-------|----------|--------|-------|--------|
| A. Content CRUD | `../decoded-track-a` | `feature/track-a-content` | 0/3 | Blocked (Phase 6) |
| B. Engagement | `../decoded-track-b` | `feature/track-b-engagement` | 0/2 | Blocked (Phase 6) |
| C. Gamification | `../decoded-track-c` | `feature/track-c-gamification` | 0/2 | Blocked (Phase 6) |
| D. Monetization | `../decoded-track-d` | `feature/track-d-monetization` | 0/3 | Blocked (Phase 6) |

## Worktree Setup (After Phase 6)

```bash
# Phase 6 완료 후 실행
git worktree add ../decoded-track-a -b feature/track-a-content
git worktree add ../decoded-track-b -b feature/track-b-engagement
git worktree add ../decoded-track-c -b feature/track-c-gamification
git worktree add ../decoded-track-d -b feature/track-d-monetization

# 각 워크트리에서 Claude Code 실행
cd ../decoded-track-a && claude  # /gsd:plan-phase A
cd ../decoded-track-b && claude  # /gsd:plan-phase B
cd ../decoded-track-c && claude  # /gsd:plan-phase C
cd ../decoded-track-d && claude  # /gsd:plan-phase D
```

## Merge Strategy

```bash
# 모든 트랙 완료 후
git checkout main
git merge feature/track-a-content
git merge feature/track-b-engagement
git merge feature/track-c-gamification
git merge feature/track-d-monetization
```

---

*Roadmap created: 2026-01-29*
*Last updated: 2026-01-29*
