# Roadmap: decoded-app

## Milestones

- [x] **v1.0 Documentation Optimization** - Phases 1-5 (shipped 2026-01-29)
- [x] **v1.1 Full API Integration** - Phase 6 + Tracks A-D (shipped 2026-01-29)
- [x] **v2.0 Design Overhaul** - v2-Phases 1-9 (shipped 2026-02-05)
- [x] **v2.1 Design System Expansion** - v2.1-Phases 1-6 (shipped 2026-02-06)
- [ ] **v3.0 Admin Panel — AI Management** - v3-Phases 01-05 (in progress)

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

**Status:** [ ] Not started

---

## Progress

| Milestone | Phases | Plans | Status | Completed |
|-----------|--------|-------|--------|-----------|
| v1.0 Documentation | 1-5 | 5/5 | Shipped | 2026-01-29 |
| v1.1 API Integration | 6 + A-D | 13/13 | Shipped | 2026-01-29 |
| v2.0 Design Overhaul | v2-1~9 | 26/26 | Shipped | 2026-02-05 |
| v2.1 Design System | v2.1-1~6 | 14/14 | Shipped | 2026-02-06 |
| **v3.0 Admin Panel** | **v3-01~05** | **8/?** | **In Progress** | - |
| **Total** | **5 milestones** | **66+ plans** | **Ongoing** | - |

### v3.0 Phase Progress

| Phase | Goal | Requirements | Status |
|-------|------|--------------|--------|
| v3-01 | Admin Foundation — auth middleware, layout, routing | AAUTH-01~03 | ✓ Complete (2026-02-19) |
| v3-02 | Dashboard — KPI cards, traffic charts, today summary | DASH-01~03 | ✓ Complete (2026-02-19) |
| v3-03 | AI Audit — request list, detail view, edit, filter | AUDIT-01~04 | ✓ Complete (2026-02-19) |
| v3-04 | AI Cost Monitoring — call stats, token charts, cost estimate | COST-01~03 | ✓ Complete (2026-02-19) |
| v3-05 | Pipeline & Server Logs — pipeline viewer, server log, streaming | PIPE-01~03, SLOG-01~03 | Not started |

**v3.0 Coverage:** 18/18 requirements mapped (100%)

---

*Roadmap created: 2026-01-29*
*Last updated: 2026-02-19 (v3-04 AI Cost Monitoring complete)*
