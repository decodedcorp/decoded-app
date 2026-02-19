# Roadmap: decoded-app

## Milestones

- [x] **v1.0 Documentation Optimization** - Phases 1-5 (shipped 2026-01-29)
- [x] **v1.1 Full API Integration** - Phase 6 + Tracks A-D (shipped 2026-01-29)
- [x] **v2.0 Design Overhaul** - v2-Phases 1-9 (shipped 2026-02-05)
- [x] **v2.1 Design System Expansion** - v2.1-Phases 1-6 (shipped 2026-02-06)
- [x] **v3.0 Admin Panel — AI Management** — v3-Phases 01-06 (shipped 2026-02-19)
- [ ] **v4.0 Spec Overhaul — AI-Ready Documentation** - v4-Phases 01-09 (in progress)

## Phases

<details>
<summary>v1.0 Documentation Optimization (Phases 1-5) - SHIPPED 2026-01-29</summary>

See archived roadmap: `.planning/milestones/v1.0-ROADMAP.md`

</details>

<details>
<summary>v1.1 Full API Integration (Phase 6 + Tracks A-D) - SHIPPED 2026-01-29</summary>

See archived roadmap: `.planning/milestones/v1.1-ROADMAP.md`

</details>

<details>
<summary>v2.0 Design Overhaul (v2-Phases 1-9) - SHIPPED 2026-02-05</summary>

See archived roadmap: `.planning/milestones/v2.0-ROADMAP.md`

</details>

<details>
<summary>v2.1 Design System Expansion (v2.1-Phases 1-6) - SHIPPED 2026-02-06</summary>

- [x] Phase v2.1-01: Core Interactive (2/2 plans) - Tag, ActionButton, StepIndicator, Hotspot
- [x] Phase v2.1-02: Navigation (2/2 plans) - NavBar, NavItem, SectionHeader, Tabs
- [x] Phase v2.1-03: Cards (2/2 plans) - ArtistCard, StatCard, SpotCard, ShopCarouselCard
- [x] Phase v2.1-04: Profile/Detail (2/2 plans) - Badge, LeaderItem, RankingItem, SpotDetail
- [x] Phase v2.1-05: Login/State (3/3 plans) - OAuthButton, GuestButton, Divider, LoginCard, LoadingSpinner, SkeletonCard, BottomSheet
- [x] Phase v2.1-06: Visual QA (3/3 plans) - Playwright tests, screenshots, CI pipeline

See archived roadmap: `.planning/milestones/v2.1-ROADMAP.md`

</details>

---

<details>
<summary>v3.0 Admin Panel — AI Management (v3-Phases 01-06) — SHIPPED 2026-02-19</summary>

See archived roadmap: `.planning/milestones/v3.0-ROADMAP.md`

</details>

---

## v4.0 Spec Overhaul — AI-Ready Documentation

**Goal:** 사용자 화면 중심의 spec/docs를 현재 코드베이스 기준으로 재작성하고, AI 에이전트 컨텍스트 주입에 최적화된 포맷으로 고도화
**Approach:** Documentation-only — no code changes. Archive first, build shared foundation, then write per-screen specs.
**Requirements:** 29 total (ARCH-01~04, SHRD-01~05, FLOW-01~05, DETL-01~04, DISC-01~04, CREA-01~03, USER-01~03, NEXT-01~04, CLEN-01)
**Note:** FLOW-05 and NEXT-01~04 are DRAFT status (pending approval). v3.0 runs in parallel on branch `gsd/v3.0-admin-panel`.

---

### Phase v4-01: Archive & Foundation

**Goal:** 현재 spec 시스템이 완전히 보존되고, 새로운 spec 구조와 템플릿이 정의되어 이후 모든 작성 작업의 기준이 된다

**Dependencies:** None (first phase)

**Requirements:** ARCH-01, ARCH-02, ARCH-03, ARCH-04

**Success Criteria:**
1. `specs/_archive/v2.1.0/` 에 현재 specs/ 전체가 복사되어 있으며 원본 파일은 그대로 유지된다
2. 새 화면 spec 템플릿(EARS 구문, 모바일 퍼스트, 200라인 제한, AI 컨텍스트 최적화)이 문서화되어 참조 가능하다
3. 새 플로우 spec 템플릿(FLW-* 형식, 상태 전이, 데이터 흐름)이 문서화되어 참조 가능하다
4. `specs/README.md` 가 새 구조(\_shared/, flows/, screens/), ID 체계, injection 가이드 포함으로 재작성되어 있다

**Plans:** 2 plans

Plans:
- [x] v4-01-01-PLAN.md — Archive existing specs to `specs/_archive/v2.1.0/` + audit stale file paths
- [x] v4-01-02-PLAN.md — Design screen/flow spec templates + rewrite `specs/README.md`

**Status:** [x] Complete (2026-02-19)

---

### Phase v4-02: Shared Foundation

**Goal:** 모든 화면 spec이 공통으로 참조하는 기반 문서가 완성되어 있으며, AI 에이전트가 임의 파일을 추측하지 않고 올바른 컴포넌트/스토어/API를 참조할 수 있다

**Dependencies:** v4-01 (templates and new README structure required)

**Requirements:** SHRD-01, SHRD-02, SHRD-03, SHRD-04, SHRD-05

**Success Criteria:**
1. `specs/_shared/component-registry.md` 에 35+ 디자인 시스템 컴포넌트의 props, variants, 파일경로, 사용 예시가 기록되어 있다
2. `specs/_shared/data-models.md` 가 현재 코드베이스 TypeScript 타입 기준으로 동기화되어 있다
3. `specs/_shared/api-contracts.md` 가 현재 구현된 API routes 기준으로 동기화되어 있다
4. `specs/_shared/store-map.md` 에 6개 Zustand 스토어의 파일경로, 핵심 필드, 사용 화면이 기록되어 있다
5. `specs/_shared/injection-guide.md` 에 작업 유형별 어떤 spec 파일을 로드해야 하는지 프로토콜이 정의되어 있다

**Plans:** 2 plans

Plans:
- [x] v4-02-01-PLAN.md — Component registry (35+ components), data models, API contracts
- [x] v4-02-02-PLAN.md — Store map (6 Zustand stores), injection guide, CMN shared component specs

**Status:** [x] Complete (2026-02-19)

---

### Phase v4-03: Flow Documents

**Goal:** 주요 사용자 여정이 화면 간 네비게이션 계약으로 문서화되어 있으며, 이후 화면 spec들이 참조할 플로우 파일이 존재한다

**Dependencies:** v4-02 (shared foundation files required before flows reference them)

**Requirements:** FLOW-01, FLOW-02, FLOW-03, FLOW-04, FLOW-05

**Success Criteria:**
1. `specs/flows/FLW-01-discovery.md` 에 홈→검색/필터→피드→상세 여정의 화면 전환, 상태 전이, 데이터 흐름이 기록되어 있다
2. `specs/flows/FLW-02-detail.md` 에 포스트/이미지 상세→스팟→아이템→쇼핑 여정의 인터랙션 계약이 기록되어 있다
3. `specs/flows/FLW-03-creation.md` 에 업로드→AI 감지→스팟 생성→솔루션 입력 여정이 단계별로 기록되어 있다
4. `specs/flows/FLW-04-user.md` 에 로그인→프로필→활동→수익 여정의 인증 상태 전이가 기록되어 있다
5. FLOW-05(VTON 플로우)는 DRAFT 상태로 표시되어 별도 파일에 초안이 존재하며, 승인 전까지 참조 파일로만 사용된다

**Plans:** 1 plan

Plans:
- [x] v4-03-01-PLAN.md — Write FLW-01~05 flow documents (4 finalized + 1 DRAFT VTON)

**Status:** [x] Complete (2026-02-19)

---

### Phase v4-04: Screen Specs — Detail View

**Goal:** Detail View 번들의 모든 화면이 현재 코드 기준으로 재작성된 spec 파일을 가지며, AI 에이전트가 해당 화면을 수정할 때 파일경로 오류 없이 올바른 컴포넌트를 참조할 수 있다

**Dependencies:** v4-02 (shared foundation), v4-03 (flow files for cross-referencing)

**Requirements:** DETL-01, DETL-02, DETL-03, DETL-04

**Success Criteria:**
1. `specs/screens/detail/SCR-VIEW-01-post-detail.md` 에 현재 포스트 상세 화면의 컴포넌트 매핑(검증된 파일경로 포함), EARS 요구사항, 모바일 퍼스트 와이어프레임이 200라인 이내로 기록되어 있다
2. `specs/screens/detail/SCR-VIEW-02-spot-hotspot.md` 에 Hotspot 컴포넌트 인터랙션, transitionStore FLIP 애니메이션 트리거, 스팟 선택 상태 전이가 기록되어 있다
3. `specs/screens/detail/SCR-VIEW-03-item-solution.md` 에 아이템/솔루션 상세 및 쇼핑 연결 흐름이 기록되어 있다
4. `specs/screens/detail/SCR-VIEW-04-related-content.md` 에 관련 콘텐츠 추천 UI와 데이터 요구사항이 기록되어 있다

**Plans:** 2 plans

Plans:
- [x] v4-04-01-PLAN.md — SCR-VIEW-01 (post detail) + SCR-VIEW-02 (spot/hotspot) with transitionStore verification
- [x] v4-04-02-PLAN.md — SCR-VIEW-03 (item/solution) + SCR-VIEW-04 (related content)

**Status:** [x] Complete (2026-02-19)

---

### Phase v4-05: Screen Specs — Discovery

**Goal:** Discovery 번들의 모든 화면이 현재 v2.0 디자인 기준으로 재작성된 spec 파일을 가지며, 기존에 확인된 stale 파일경로(HomeClient, GlobalHeader)가 수정된 현재 경로로 교체된다

**Dependencies:** v4-02 (shared foundation), v4-03 (flow files)

**Requirements:** DISC-01, DISC-02, DISC-03, DISC-04

**Success Criteria:**
1. `specs/screens/discovery/SCR-DISC-01-home.md` 에 현재 홈 화면의 컴포넌트 매핑이 실제 파일경로(app/ 하위)로 검증되어 있으며 Hero, trending, best sections, celebrity grid가 기록되어 있다
2. `specs/screens/discovery/SCR-DISC-02-search.md` 에 풀스크린 오버레이 검색, searchStore 상태 전이, 멀티탭 결과 레이아웃이 기록되어 있다
3. `specs/screens/discovery/SCR-DISC-03-feed.md` 에 소셜 피드 타임라인, FeedCardBase 컴포넌트 사용, 인피니트 스크롤 데이터 흐름이 기록되어 있다
4. `specs/screens/discovery/SCR-DISC-04-explore.md` 에 카테고리 필터 그리드, filterStore 연동, 반응형 컬럼 전환이 기록되어 있다

**Plans:** 2 plans

Plans:
- [x] v4-05-01-PLAN.md — SCR-DISC-01 (home) + SCR-DISC-02 (search) with stale path fixes
- [x] v4-05-02-PLAN.md — SCR-DISC-03 (feed) + SCR-DISC-04 (explore)

**Status:** [x] Complete (2026-02-19)

---

### Phase v4-06: Screen Specs — Creation-AI

**Goal:** Creation-AI 번들의 모든 화면이 현재 구현을 기반으로 처음 작성된 spec 파일을 가지며, requestStore 단계 enum과 AI 감지 API 응답 형태가 spec에 정확하게 반영된다

**Dependencies:** v4-02 (shared foundation), v4-03 (flow files)

**Requirements:** CREA-01, CREA-02, CREA-03

**Success Criteria:**
1. `specs/screens/creation/SCR-CREA-01-upload.md` 에 DropZone 컴포넌트, 이미지 압축 플로우, requestStore 초기 상태가 기록되어 있다
2. `specs/screens/creation/SCR-CREA-02-ai-detect.md` 에 AI 감지 결과 화면의 아이템 스팟팅 UI, `POST /api/v1/posts/analyze` 응답 형태 참조, 감지 상태(로딩/성공/실패)가 기록되어 있다
3. `specs/screens/creation/SCR-CREA-03-edit-solution.md` 에 편집 화면의 스팟 생성 인터랙션, 솔루션 입력 폼, 제출 플로우가 기록되어 있다

**Plans:** 1 plan

Plans:
- [x] v4-06-01-PLAN.md — SCR-CREA-01~03 (upload, AI detect, edit/solution) with requestStore + API verification

**Status:** [x] Complete (2026-02-19)

---

### Phase v4-07: Screen Specs — User System

**Goal:** User System 번들의 모든 화면이 현재 authStore 상태 기준으로 재작성된 spec 파일을 가지며, 인증 조건부 렌더링 패턴이 정확하게 문서화된다

**Dependencies:** v4-02 (shared foundation with authStore shape documented), v4-03 (flow files)

**Requirements:** USER-01, USER-02, USER-03

**Success Criteria:**
1. `specs/screens/user/SCR-USER-01-login.md` 에 OAuth 로그인 플로우(Kakao, Google, Apple), authStore 상태 전이(unauthenticated → authenticated), 로그인 후 리다이렉트 동작이 기록되어 있다
2. `specs/screens/user/SCR-USER-02-profile.md` 에 프로필 화면의 활동 탭, 뱃지 시스템, 스탯 카드, authStore 기반 조건부 렌더링이 기록되어 있다
3. `specs/screens/user/SCR-USER-03-earnings.md` 에 수익 대시보드의 클릭 추적, 정산 플로우, 기간별 데이터 표시가 기록되어 있다

**Plans:** 1 plan

Plans:
- [ ] 07-01-PLAN.md — SCR-USER-01~03 (login, profile, earnings) with authStore state verification

**Status:** [ ] Planned — ready for execution

---

### Phase v4-08: Next Version Draft

**Goal:** 새로운 서비스 방향(VTON, 동적 UI, 커머스 브릿지)에 대한 초안 문서가 존재하며, DRAFT 상태로 명확히 표시되어 현재 구현 spec과 혼동되지 않는다

**Dependencies:** v4-07 (all current-state specs complete before adding future-state drafts)

**Requirements:** NEXT-01, NEXT-02, NEXT-03, NEXT-04

**Note:** All NEXT-* requirements are DRAFT status — pending service direction approval.

**Success Criteria:**
1. `specs/_next/NEXT-01-service-identity.md` 에 새 서비스 아이덴티티 PRD 요약, 타겟 전략, 톤앤매너가 DRAFT 상태로 기록되어 있다
2. `specs/_next/NEXT-02-vton-spec.md` 에 VTON 기능 Phase 1~3 기술 아키텍처 초안이 DRAFT 상태로 기록되어 있다
3. `specs/_next/NEXT-03-dynamic-ui.md` 에 5단계 동적 UI 인터랙션 시나리오 초안이 DRAFT 상태로 기록되어 있다
4. `specs/_next/NEXT-04-commerce-bridge.md` 에 Visual Search + 제휴 쇼핑몰 연동 아키텍처 초안이 DRAFT 상태로 기록되어 있다
5. 모든 NEXT-* 파일이 파일 상단에 `> STATUS: DRAFT — not approved for implementation` 경고를 포함한다

**Plans:** 1 plan

Plans:
- [ ] v4-08-01-PLAN.md — Write all NEXT-01~04 draft documents in `specs/_next/`

**Status:** [ ] Not started

---

### Phase v4-09: Cleanup

**Goal:** 구 번들 spec.md 파일이 retire되어 AI 에이전트가 stale 모놀리스 파일을 로드할 위험이 없으며, 새 spec 구조로의 전환이 완료된다

**Dependencies:** v4-01~v4-08 (all phases must be complete before retiring old files)

**Requirements:** CLEN-01

**Success Criteria:**
1. 기존 번들별 `spec.md` 파일들이 삭제되거나 `_archive/v2.1.0/` 로 이동되어 있으며 현재 `specs/` 경로에는 존재하지 않는다
2. `specs/README.md` 가 새 구조만 가리키며 구 번들 파일에 대한 참조가 없다
3. `specs/` 루트의 파일 목록이 `_archive/`, `_shared/`, `_next/`, `flows/`, `screens/`, `README.md` 만으로 구성된다

**Plans:** 1 plan

Plans:
- [ ] v4-09-01-PLAN.md — Retire old bundle spec.md files, verify new structure, update all indexes

**Status:** [ ] Not started

---

## Progress

| Milestone | Phases | Plans | Status | Completed |
|-----------|--------|-------|--------|-----------|
| v1.0 Documentation | 1-5 | 5/5 | Shipped | 2026-01-29 |
| v1.1 API Integration | 6 + A-D | 13/13 | Shipped | 2026-01-29 |
| v2.0 Design Overhaul | v2-1~9 | 26/26 | Shipped | 2026-02-05 |
| v2.1 Design System | v2.1-1~6 | 14/14 | Shipped | 2026-02-06 |
| **v3.0 Admin Panel** | **v3-01~06** | **12/12** | **Shipped** | 2026-02-19 |
| **v4.0 Spec Overhaul** | **v4-01~09** | **10/13** | **In progress** | - |
| **Total** | **6 milestones** | **77/83** | **Ongoing** | - |

### v4.0 Phase Progress

| Phase | Goal | Requirements | Plans | Status |
|-------|------|--------------|-------|--------|
| v4-01 | Archive & Foundation — snapshot, templates, README | ARCH-01~04 | 2/2 | Complete (2026-02-19) |
| v4-02 | Shared Foundation — component registry, data models, API contracts, stores, injection guide | SHRD-01~05 | 2/2 | Complete (2026-02-19) |
| v4-03 | Flow Documents — 4 user journey flows + VTON draft | FLOW-01~05 | 1/1 | Complete (2026-02-19) |
| v4-04 | Screen Specs: Detail View — post detail, spot, item, related | DETL-01~04 | 2/2 | Complete (2026-02-19) |
| v4-05 | Screen Specs: Discovery — home, search, feed, explore | DISC-01~04 | 2/2 | Complete (2026-02-19) |
| v4-06 | Screen Specs: Creation-AI — upload, detect, edit/solution | CREA-01~03 | 1/1 | Complete (2026-02-19) |
| v4-07 | Screen Specs: User System — login, profile, earnings | USER-01~03 | 0/1 | Planned |
| v4-08 | Next Version Draft — service identity, VTON, dynamic UI, commerce | NEXT-01~04 | 0/1 | Not started |
| v4-09 | Cleanup — retire old bundle files, verify new structure | CLEN-01 | 0/1 | Not started |

**v4.0 Coverage:** 29/29 requirements mapped (100%)

---

*Roadmap created: 2026-01-29*
*Last updated: 2026-02-19 (v4-06 complete — 3 Creation-AI screen specs written; SCR-CREA-01~03)*
