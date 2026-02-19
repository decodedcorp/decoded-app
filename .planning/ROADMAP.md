# Roadmap: decoded-app

## Milestones

- [x] **v1.0 Documentation Optimization** - Phases 1-5 (shipped 2026-01-29)
- [x] **v1.1 Full API Integration** - Phase 6 + Tracks A-D (shipped 2026-01-29)
- [x] **v2.0 Design Overhaul** - v2-Phases 1-9 (shipped 2026-02-05)
- [x] **v2.1 Design System Expansion** - v2.1-Phases 1-6 (shipped 2026-02-06)
- [x] **v3.0 Admin Panel — AI Management** - v3-Phases 01-06 (shipped 2026-02-19)
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

## v3.0 Admin Panel — AI Management

**Goal:** AI 분석 파이프라인을 모니터링하고 결과를 감사할 수 있는 관리자 패널 구축
**Approach:** Mock data first — AI audit, pipeline, server log features use mock data; dashboard uses existing admin APIs
**Requirements:** 18 total (AAUTH-01~03, DASH-01~03, AUDIT-01~04, COST-01~03, PIPE-01~03, SLOG-01~03)

---

### Phase v3-01: Admin Foundation

**Goal:** 관리자 사용자만 `/admin` 경로에 접근할 수 있으며, 일관된 관리자 전용 UI 레이아웃이 제공된다

**Dependencies:** None (first phase)

**Requirements:** AAUTH-01, AAUTH-02, AAUTH-03

**Success Criteria:**
1. 비관리자가 `/admin` 하위 어떤 경로로 접근해도 즉시 리다이렉트되어 접근이 차단된다
2. 관리자가 로그인하면 사이드바 네비게이션이 있는 관리자 전용 레이아웃이 렌더링된다
3. 사이드바 네비게이션 링크가 대시보드, AI 감사, AI 비용, 파이프라인 로그, 서버 로그 섹션으로 이동한다
4. `is_admin` 체크 로직이 미들웨어 레벨에서 동작하며 클라이언트 사이드 우회가 불가능하다

**Plans:** 2 plans

Plans:
- [x] 01-01-PLAN.md — Middleware + admin auth infrastructure (is_admin check, route protection)
- [x] 01-02-PLAN.md — Admin layout, sidebar, placeholder pages, header admin link

**Status:** [x] Complete (2026-02-19)

---

### Phase v3-02: Dashboard

**Goal:** 관리자가 서비스 핵심 지표를 한눈에 파악하고 트래픽 추이를 차트로 확인할 수 있다

**Dependencies:** v3-01 (admin layout required)

**Requirements:** DASH-01, DASH-02, DASH-03

**Success Criteria:**
1. 대시보드에 DAU, MAU, 총 유저 수, 총 포스트 수, 총 솔루션 수가 KPI 카드로 표시된다
2. 일별 DAU, 검색 수, 클릭 수 추이가 라인/바 차트로 시각화된다
3. 오늘의 요약 섹션에 당일 신규 포스트, 솔루션, 클릭 수가 표시된다
4. 대시보드 데이터가 기존 admin API 또는 mock 데이터로 로딩되며 빈 화면 없이 표시된다

Plans:
- [x] 02-01-PLAN.md — Dashboard API routes, mock data generators, Recharts install
- [x] 02-02-PLAN.md — Dashboard UI (KPI cards, traffic chart, today summary, skeletons)

**Status:** [x] Complete (2026-02-19)

---

### Phase v3-03: AI Audit

**Goal:** 관리자가 AI 분석 요청 목록을 검토하고 개별 결과를 수정할 수 있다

**Dependencies:** v3-01 (admin layout required)

**Requirements:** AUDIT-01, AUDIT-02, AUDIT-03, AUDIT-04

**Success Criteria:**
1. AI 분석 요청 목록에서 이미지 썸네일, 분석 상태, 결과 요약(감지된 아이템 수 등)이 표시된다
2. 상태 필터(대기/완료/오류/수정됨)를 선택하면 해당 상태의 요청만 목록에 표시된다
3. 목록에서 항목을 선택하면 감지된 아이템과 신뢰도 점수가 포함된 상세 뷰가 열린다
4. 상세 뷰에서 아이템 추가, 삭제, 수정 작업을 수행하면 결과가 즉시 UI에 반영된다 (mock)
5. 수정된 분석 결과는 상태가 "수정됨"으로 표시되어 원본 AI 결과와 구분된다

Plans:
- [x] 03-01-PLAN.md — Audit mock data generators, types, 2 API routes
- [x] 03-02-PLAN.md — Audit UI (table, filters, pagination, detail modal, inline editor)

**Status:** [x] Complete (2026-02-19)

---

### Phase v3-04: AI Cost Monitoring

**Goal:** 관리자가 AI API 호출 수, 토큰 사용량, 비용 추정을 기간별로 모니터링할 수 있다

**Dependencies:** v3-01 (admin layout required)

**Requirements:** COST-01, COST-02, COST-03

**Success Criteria:**
1. 일별/월별 AI API 호출 수가 차트로 표시되며 기간 전환이 동작한다
2. 입력 토큰과 출력 토큰 사용량이 누적 차트 또는 분리된 차트로 시각화된다
3. 모델별(예: GPT-4o, Claude 3.5) 비용 추정이 기간 선택에 따라 계산되어 표시된다
4. 모든 비용/사용량 데이터는 mock 데이터로 동작하며 현실적인 수치 범위를 제공한다

**Plans:** 2 plans

Plans:
- [x] 04-01-PLAN.md — AI cost mock data generators, types, data layer, 2 API routes
- [x] 04-02-PLAN.md — AI cost UI (KPI cards, token usage chart, API calls chart, model cost table, page assembly)

**Status:** [x] Complete (2026-02-19)

---

### Phase v3-05: Pipeline & Server Logs

**Goal:** 관리자가 요청 파이프라인 실행 현황과 서버 API 로그를 조회하고 에러를 추적할 수 있다

**Dependencies:** v3-01 (admin layout required)

**Requirements:** PIPE-01, PIPE-02, PIPE-03, SLOG-01, SLOG-02, SLOG-03

**Success Criteria:**
1. 파이프라인 목록에서 업로드→분석→감지 각 단계의 실행 상태와 소요 시간이 표시된다
2. 파이프라인 항목을 클릭하면 단계별 상세 로그와 각 단계 결과가 펼쳐진다
3. 에러 파이프라인 필터를 적용하면 실패한 파이프라인만 표시되고 재시도 버튼이 활성화된다 (mock)
4. API 요청 로그 뷰어에서 엔드포인트, HTTP 상태코드, 응답시간이 표 형태로 표시된다
5. 에러 로그 필터(레벨, 기간, 검색어)를 적용하면 해당 조건의 로그만 필터링된다
6. 실시간 로그 스트리밍 UI가 `tail -f` 스타일로 새 로그를 아래에 추가하며 표시된다 (mock polling)

**Plans:** 3 plans

Plans:
- [x] 05-01-PLAN.md — Pipeline + server log mock data, types, data layer, 4 API routes
- [x] 05-02-PLAN.md — Pipeline Logs UI (table, accordion detail, status filter, retry, pagination)
- [x] 05-03-PLAN.md — Server Logs UI (log table, filters, terminal-style streaming console)

**Status:** [x] Complete (2026-02-19)

---

### Phase v3-06: Pipeline Bug Fix + Auth Consistency

**Goal:** Pipeline accordion detail이 정상 동작하고 retry UI에 접근 가능하며, 전체 admin API route의 인증 패턴이 일관된다

**Dependencies:** v3-05 (pipeline code exists)

**Requirements:** PIPE-02 (fix), PIPE-03 (unblock)

**Gap Closure:** Closes all gaps from v3.0-MILESTONE-AUDIT.md

**Success Criteria:**
1. Pipeline 목록에서 항목 클릭 시 accordion이 정상 열리며 steps 데이터가 표시된다
2. 에러 상태 파이프라인에서 retry 버튼이 정상 동작한다 (mock toast)
3. 모든 admin API route가 동일한 인증 패턴을 사용한다 (dev bypass 제거)

**Plans:** 1 plan

Plans:
- [x] 06-01-PLAN.md — Fix pipeline detail response shape + remove dev auth bypass in 5 routes

**Status:** [x] Complete (2026-02-19)

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
- [ ] v4-01-01-PLAN.md — Archive existing specs to `specs/_archive/v2.1.0/` + audit stale file paths
- [ ] v4-01-02-PLAN.md — Design screen/flow spec templates + rewrite `specs/README.md`

**Status:** [ ] Not started

---

### Phase v4-02: Shared Foundation

**Goal:** 모든 화면 spec이 공통으로 참조하는 기반 문서가 완성되어 있으며, AI 에이전트가 임의 파일을 추측하지 않고 올바른 컴포넌트/스토어/API를 참조할 수 있다

**Dependencies:** v4-01 (templates and new README structure required)

**Requirements:** SHRD-01, SHRD-02, SHRD-03, SHRD-04, SHRD-05

**Success Criteria:**
1. `specs/_shared/component-registry.md` 에 35+ 디자인 시스템 컴포넌트의 props, variants, 파일경로, 사용 예시가 기록되어 있다
2. `specs/_shared/data-models.md` 가 현재 코드베이스 TypeScript 타입 기준으로 동기화되어 있다
3. `specs/_shared/api-contracts.md` 가 현재 구현된 API routes 기준으로 동기화되어 있다
4. `specs/_shared/store-map.md` 에 5개 Zustand 스토어의 파일경로, 핵심 필드, 사용 화면이 기록되어 있다
5. `specs/_shared/injection-guide.md` 에 작업 유형별 어떤 spec 파일을 로드해야 하는지 프로토콜이 정의되어 있다

**Plans:** 2 plans

Plans:
- [ ] v4-02-01-PLAN.md — Component registry (35+ components), data models, API contracts
- [ ] v4-02-02-PLAN.md — Store map (5 Zustand stores), injection guide, CMN shared component specs

**Status:** [ ] Not started

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
- [ ] v4-03-01-PLAN.md — Write FLW-01~04 flow files + FLW-05 DRAFT file

**Status:** [ ] Not started

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
- [ ] v4-04-01-PLAN.md — SCR-VIEW-01 (post detail) + SCR-VIEW-02 (spot/hotspot) with transitionStore verification
- [ ] v4-04-02-PLAN.md — SCR-VIEW-03 (item/solution) + SCR-VIEW-04 (related content)

**Status:** [ ] Not started

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
- [ ] v4-05-01-PLAN.md — SCR-DISC-01 (home) + SCR-DISC-02 (search) with stale path fixes
- [ ] v4-05-02-PLAN.md — SCR-DISC-03 (feed) + SCR-DISC-04 (explore)

**Status:** [ ] Not started

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
- [ ] v4-06-01-PLAN.md — SCR-CREA-01~03 (upload, AI detect, edit/solution) with requestStore + API verification

**Status:** [ ] Not started

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
- [ ] v4-07-01-PLAN.md — SCR-USER-01~03 (login, profile, earnings) with authStore state verification

**Status:** [ ] Not started

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
| **v4.0 Spec Overhaul** | **v4-01~09** | **0/13** | **In progress** | - |
| **Total** | **6 milestones** | **70/82** | **Ongoing** | - |

### v3.0 Phase Progress

| Phase | Goal | Requirements | Status |
|-------|------|--------------|--------|
| v3-01 | Admin Foundation — auth middleware, layout, routing | AAUTH-01~03 | Complete (2026-02-19) |
| v3-02 | Dashboard — KPI cards, traffic charts, today summary | DASH-01~03 | Complete (2026-02-19) |
| v3-03 | AI Audit — request list, detail view, edit, filter | AUDIT-01~04 | Complete (2026-02-19) |
| v3-04 | AI Cost Monitoring — call stats, token charts, cost estimate | COST-01~03 | Complete (2026-02-19) |
| v3-05 | Pipeline & Server Logs — pipeline viewer, server log, streaming | PIPE-01~03, SLOG-01~03 | Complete (2026-02-19) |
| v3-06 | Pipeline Bug Fix + Auth Consistency — response shape fix, dev bypass removal | PIPE-02, PIPE-03 (fix) | Complete (2026-02-19) |

**v3.0 Coverage:** 18/18 requirements mapped (100%)

### v4.0 Phase Progress

| Phase | Goal | Requirements | Plans | Status |
|-------|------|--------------|-------|--------|
| v4-01 | Archive & Foundation — snapshot, templates, README | ARCH-01~04 | 0/2 | Not started |
| v4-02 | Shared Foundation — component registry, data models, API contracts, stores, injection guide | SHRD-01~05 | 0/2 | Not started |
| v4-03 | Flow Documents — 4 user journey flows + VTON draft | FLOW-01~05 | 0/1 | Not started |
| v4-04 | Screen Specs: Detail View — post detail, spot, item, related | DETL-01~04 | 0/2 | Not started |
| v4-05 | Screen Specs: Discovery — home, search, feed, explore | DISC-01~04 | 0/2 | Not started |
| v4-06 | Screen Specs: Creation-AI — upload, detect, edit/solution | CREA-01~03 | 0/1 | Not started |
| v4-07 | Screen Specs: User System — login, profile, earnings | USER-01~03 | 0/1 | Not started |
| v4-08 | Next Version Draft — service identity, VTON, dynamic UI, commerce | NEXT-01~04 | 0/1 | Not started |
| v4-09 | Cleanup — retire old bundle files, verify new structure | CLEN-01 | 0/1 | Not started |

**v4.0 Coverage:** 29/29 requirements mapped (100%)

---

*Roadmap created: 2026-01-29*
*Last updated: 2026-02-19 (v4.0 Spec Overhaul roadmap added — 9 phases, 13 plans, 29 requirements)*
