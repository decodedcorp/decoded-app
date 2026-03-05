# Roadmap: decoded-app

## Milestones

- [x] **v1.0 Documentation Optimization** - Phases 1-5 (shipped 2026-01-29)
- [x] **v1.1 Full API Integration** - Phase 6 + Tracks A-D (shipped 2026-01-29)
- [x] **v2.0 Design Overhaul** - v2-Phases 1-9 (shipped 2026-02-05)
- [x] **v2.1 Design System Expansion** - v2.1-Phases 1-6 (shipped 2026-02-06)
- [x] **v3.0 Admin Panel — AI Management** — v3-Phases 01-06 (shipped 2026-02-19)
- [x] **v4.0 Spec Overhaul — AI-Ready Documentation** — v4-Phases 01-09 (shipped 2026-02-20)
- [ ] **M7 AI Magazine & Archive Expansion** — m7-Phases 01+ (in progress)

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

See archived roadmap: `.planning/milestones/v2.1-ROADMAP.md`

</details>

<details>
<summary>v3.0 Admin Panel — AI Management (v3-Phases 01-06) — SHIPPED 2026-02-19</summary>

See archived roadmap: `.planning/milestones/v3.0-ROADMAP.md`

</details>

<details>
<summary>v4.0 Spec Overhaul — AI-Ready Documentation (v4-Phases 01-09) — SHIPPED 2026-02-20</summary>

See archived roadmap: `.planning/milestones/v4.0-ROADMAP.md`

</details>

### Phase m7-01: Magazine Frontend (Mock-First)

**Goal:** Build the AI Magazine frontend with mock data — MagazineRenderer layout engine, 3D Bookshelf, Decoding Ritual animation, and #eafd67 theme system.

**Plans:** 5/5 plans complete

Plans:
- [x] m7-01-01-PLAN.md — Theme system + types + mock data + magazineStore
- [x] m7-01-02-PLAN.md — MagazineRenderer layout engine + 6 magazine components
- [x] m7-01-03-PLAN.md — Daily editorial page (/magazine) + NavBar integration
- [x] m7-01-04-PLAN.md — 3D Bookshelf collection page (/collection)
- [x] m7-01-05-PLAN.md — Decoding Ritual animation (/magazine/personal)

### Phase m7-02: Main Page Renewal — Playful Magazine Landing

**Goal:** 메인페이지(/)를 Cinema-to-Action 컨셉으로 리뉴얼. Zero-Template 레이아웃 엔진, Hero Tilt + Glow 애니메이션, Masonry Grid + Parallax, Soft Wall 로그인 유도, #eafd67 네온 테마. Mock 데이터 기반 프론트엔드 선행 구현.

**Depends on:** m7-01 (theme system, MagazineRenderer 공유)
**Plans:** 2/3 plans complete

Plans:
- [x] m7-02-01-PLAN.md — Mock data + types + MainHero (Tilt/Glow/Noise)
- [x] m7-02-02-PLAN.md — MasonryGrid + Parallax + PersonalizeBanner (Suction)
- [ ] m7-02-03-PLAN.md — SmartNav + Page assembly + visual checkpoint

### Phase m7-03: The Decoded Studio — 3D Collection Room

**Goal:** 컬렉션 페이지(/collection)를 React Three Fiber 기반 3D 스튜디오로 전면 리디자인. 네온 #eafd67 조명의 갤러리 공간에서 매거진을 탐색하는 몰입형 경험. Entry/Browse/Focus 카메라 워크, 프로시저럴 3D 매거진 오브젝트, Bloom 포스트프로세싱, WebGL 미지원 시 CSS 폴백.

**Depends on:** m7-01 (theme system, MagazineIssue types, magazineStore)
**Specs:** SCR-COL-01 (Studio room), SCR-COL-02 (R3F interactions), SCR-COL-03 (Detail panel + actions)
**Plans:** 4 plans

Plans:
- [ ] m7-03-01-PLAN.md — R3F v8 setup + studioStore + StudioScene Canvas + StudioRoom (Reflector floor, walls) + StudioLighting (neon #eafd67) + CameraRig (entry dolly)
- [ ] m7-03-02-PLAN.md — MagazineBook (cover UV, spine neon text, cover flip) + MagazineRack (arc layout) + Float bobbing
- [ ] m7-03-03-PLAN.md — CameraRig interactions (parallax, focus zoom, unfocus, exit) + hover glow + StudioEffects (Bloom/Vignette) + PerformanceMonitor
- [ ] m7-03-04-PLAN.md — IssueDetailPanel (HTML overlay) + EmptyStudio + StudioLoader + StudioHUD + CollectionClient orchestration + WebGL fallback

## Progress

| Milestone | Phases | Plans | Status | Completed |
|-----------|--------|-------|--------|-----------|
| v1.0 Documentation | 1-5 | 5/5 | Shipped | 2026-01-29 |
| v1.1 API Integration | 6 + A-D | 13/13 | Shipped | 2026-01-29 |
| v2.0 Design Overhaul | v2-1~9 | 26/26 | Shipped | 2026-02-05 |
| v2.1 Design System | v2.1-1~6 | 14/14 | Shipped | 2026-02-06 |
| v3.0 Admin Panel | v3-01~06 | 12/12 | Shipped | 2026-02-19 |
| v4.0 Spec Overhaul | v4-01~09 | 13/13 | Shipped | 2026-02-20 |
| M7 AI Magazine | m7-01, m7-02, m7-03 | 7/16 | In Progress | - |
| **Total** | **7 milestones** | **90/99** | **Active** | - |

---

*Roadmap created: 2026-01-29*
*Last updated: 2026-03-05 (m7-03 planned, 4 plans created)*
