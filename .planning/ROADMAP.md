# Roadmap: decoded-app

## Milestones

- [x] **v1.0 Documentation Optimization** - Phases 1-5 (shipped 2026-01-29)
- [ ] **v1.1 Full API Integration** - Phases 6-10 (in progress)

## Overview

v1.1 connects all backend APIs to the frontend, transforming decoded-app from a partially-functional prototype into a production-ready service. The 37 requirements are grouped into 5 phases, progressing from foundational profile APIs through interactive features (CRUD, voting, comments) to engagement systems (rankings, badges, earnings).

## Phases

<details>
<summary>v1.0 Documentation Optimization (Phases 1-5) - SHIPPED 2026-01-29</summary>

See archived roadmap for v1.0 phase details.

</details>

### v1.1 Full API Integration (In Progress)

**Milestone Goal:** Connect all backend APIs to frontend for complete user experience

- [ ] **Phase 6: Profile & API Foundation** - User profile APIs and shared API client patterns
- [ ] **Phase 7: Content CRUD** - Posts, Spots, Solutions create/update/delete operations
- [ ] **Phase 8: Interaction Systems** - Voting and commenting functionality
- [ ] **Phase 9: Gamification** - Rankings and badges display
- [ ] **Phase 10: Monetization & Search** - Earnings dashboard and search enhancements

## Phase Details

### Phase 6: Profile & API Foundation
**Goal**: Users can view and edit their profiles with real data from the API
**Depends on**: v1.0 completion
**Requirements**: PROF-01, PROF-02, PROF-03, PROF-04, PROF-05
**Success Criteria** (what must be TRUE):
  1. User can view their own profile page with real data (bio, avatar, display_name)
  2. User can edit their profile and see changes persist after refresh
  3. User can view their activity history (posts, solutions, votes)
  4. User can see their stats (total posts, solutions, adoption rate)
  5. User can view other users' public profiles
**Plans**: TBD

Plans:
- [ ] 06-01: API client setup and profile data fetching
- [ ] 06-02: Profile edit form and mutation hooks
- [ ] 06-03: Activity feed and stats components

### Phase 7: Content CRUD
**Goal**: Users can fully manage their posts, spots, and solutions
**Depends on**: Phase 6
**Requirements**: POST-01, POST-02, SPOT-01, SPOT-02, SPOT-03, SPOT-04, SOLN-01, SOLN-02, SOLN-03, SOLN-04, SOLN-05, SOLN-06
**Success Criteria** (what must be TRUE):
  1. User can edit their own posts (title, description, tags)
  2. User can delete their own posts
  3. User can add/edit/delete spots on their posts
  4. User can submit solutions to spots with product links
  5. User can edit/delete their submitted solutions
  6. Product metadata is auto-extracted when submitting solution URLs
**Plans**: TBD

Plans:
- [ ] 07-01: Post edit/delete operations
- [ ] 07-02: Spot CRUD operations
- [ ] 07-03: Solution CRUD with metadata extraction

### Phase 8: Interaction Systems
**Goal**: Users can vote on solutions and engage through comments
**Depends on**: Phase 7
**Requirements**: VOTE-01, VOTE-02, VOTE-03, VOTE-04, VOTE-05, CMNT-01, CMNT-02, CMNT-03, CMNT-04
**Success Criteria** (what must be TRUE):
  1. User can see vote counts on solutions
  2. User can vote (accurate/different) on solutions and see immediate UI update
  3. User can retract their vote
  4. Post owner can adopt a solution as the correct answer
  5. User can view comments on posts
  6. User can write, edit, and delete their own comments
**Plans**: TBD

Plans:
- [ ] 08-01: Vote system (vote, retract, adopt)
- [ ] 08-02: Comment CRUD operations

### Phase 9: Gamification
**Goal**: Users can see their standing and achievements in the community
**Depends on**: Phase 8
**Requirements**: RANK-01, RANK-02, RANK-03, BDGE-01, BDGE-02, BDGE-03
**Success Criteria** (what must be TRUE):
  1. User can view global rankings leaderboard
  2. User can see their own rank position
  3. User can browse rankings by category
  4. User can view all available badges and their requirements
  5. User can see their earned badges on profile
**Plans**: TBD

Plans:
- [ ] 09-01: Rankings display (global, personal, category)
- [ ] 09-02: Badge system integration

### Phase 10: Monetization & Search
**Goal**: Users can track earnings and discover content efficiently
**Depends on**: Phase 9
**Requirements**: EARN-01, EARN-02, EARN-03, EARN-04, EARN-05, SRCH-01, SRCH-02
**Success Criteria** (what must be TRUE):
  1. User can view click statistics on their solutions
  2. Affiliate link clicks are tracked automatically
  3. User can see earnings summary and history
  4. User can view settlement history and request withdrawals
  5. User can see popular search terms for discovery
  6. User can view their recent search history
**Plans**: TBD

Plans:
- [ ] 10-01: Click tracking and earnings dashboard
- [ ] 10-02: Settlement and withdrawal flow
- [ ] 10-03: Search suggestions (popular/recent)

## Progress

**Execution Order:** Phases execute in numeric order: 6 -> 7 -> 8 -> 9 -> 10

| Phase | Milestone | Plans Complete | Status | Completed |
|-------|-----------|----------------|--------|-----------|
| 1-5. Documentation | v1.0 | 5/5 | Complete | 2026-01-29 |
| 6. Profile & API | v1.1 | 0/3 | Not started | - |
| 7. Content CRUD | v1.1 | 0/3 | Not started | - |
| 8. Interaction | v1.1 | 0/2 | Not started | - |
| 9. Gamification | v1.1 | 0/2 | Not started | - |
| 10. Monetization | v1.1 | 0/3 | Not started | - |

---

*Roadmap created: 2026-01-29*
*Last updated: 2026-01-29*
