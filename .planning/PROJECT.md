# Project: decoded-app

## What This Is

AI 기반 미디어 디스커버리 플랫폼. K-POP 아이돌과 셀럽의 패션 아이템을 발견하고 공유하는 서비스.

**v1.0 (2026-01-29 shipped):** 문서화 최적화
**v1.1 (2026-01-29 shipped):** 전체 API 연결 — 백엔드 API를 프론트엔드에 연결하여 실제 데이터로 동작
**v2.0 (2026-02-05 shipped):** 디자인 오버홀 — decoded.pen 디자인을 코드로 구현
**v2.1 (2026-02-06 shipped):** 디자인 시스템 확장 — 23개 추가 컴포넌트 + Visual QA 자동화

## Current Milestone: v4.0 Spec Overhaul — AI-Ready Documentation

**Goal:** 사용자 화면 중심의 spec/docs를 현재 코드베이스 기준으로 재작성하고, AI 에이전트 컨텍스트 주입에 최적화된 포맷으로 고도화

**Target features:**
- 기존 spec v2.1.0 아카이빙 (버전 스냅샷)
- Mobile-first 화면별 spec 재작성 (컴포넌트 매핑 + 파일경로)
- 유저 플로우/시나리오 기반 문서 구조 (상태 전이, 데이터 흐름)
- AI 에이전트 컨텍스트 주입 최적화 (Claude, Gemini, Cursor 호환)
- shared 기반 문서 (데이터 모델, API 계약, 공통 컴포넌트) 동기화
- 추후 서비스 기조 변경 반영을 위한 확장 가능한 구조

**대상 번들:** discovery, detail-view, creation-ai, user-system, shared
**제외:** admin (v3.0에서 별도 진행), system-backend, mobile-platform

## Core Value

**완전한 사용자 경험** — 모든 페이지가 실제 데이터로 동작하며 일관된 디자인 시스템 적용

## Current State

### Codebase
- **Tech Stack**: Next.js 16 + React 18 + TypeScript 5.9 + Supabase + Zustand + React Query
- **Structure**: Monorepo (packages/web, packages/shared)
- **Design System**: 45+ components in `lib/design-system/` (5,924 LOC)
- **Codebase Map**: `.planning/codebase/` (8 files, 3,250+ lines)

### Visual QA
- **Playwright Tests**: 40 tests covering 10 pages at 4 breakpoints
- **Baseline Screenshots**: 36 approved
- **CI Pipeline**: GitHub Actions workflow on PRs

### Documentation (v1.0 shipped)
- **CLAUDE.md**: AI 에이전트용 최적화 완료
- **specs/**: 9개 번들 (빈 폴더 정리됨)
- **docs/**: SSOT 테이블, codebase 연결 완료

## Requirements

### Validated

**v1.0 Documentation:**
- CLAUDE.md에 codebase 참조 추가 — v1.0
- specs/README.md 업데이트 — v1.0
- docs/README.md 업데이트 — v1.0
- 빈 스펙 폴더 정리 — v1.0
- 크로스 레퍼런스 추가 — v1.0
- SSOT 원칙 문서화 — v1.0

**v1.1 API Integration:**
- 프로필 API 연결 (GET/PATCH, activities, stats) — v1.1
- Posts/Spots/Solutions CRUD API — v1.1
- 투표/댓글 시스템 API — v1.1
- 랭킹/배지 시스템 API — v1.1
- 수익 대시보드/정산 API — v1.1
- 검색 API (popular, recent) — v1.1

**v2.0 Design Overhaul:**
- 디자인 토큰 추출 (색상, 타이포그래피, 간격) — v2.0
- 타이포그래피 컴포넌트 구현 (Heading, Text) — v2.0
- Tailwind CSS 설정 확장 — v2.0
- 버튼, 입력, 태그 컴포넌트 — v2.0
- 카드 컴포넌트 (Product, Feed, Profile) — v2.0
- 데스크탑 레이아웃 (Header, Footer) — v2.0
- 페이지별 디자인 적용 (8개 페이지) — v2.0

**v2.1 Design System Expansion:**
- Tag 컴포넌트 (6 category variants) — v2.1
- ActionButton 컴포넌트 (3 variants) — v2.1
- StepIndicator (3 size, 3 visual variants) — v2.1
- Hotspot 컴포넌트 (3 variants with animation) — v2.1
- NavBar, NavItem, SectionHeader, Tabs — v2.1
- ArtistCard, StatCard, SpotCard, ShopCarouselCard — v2.1
- Badge, LeaderItem, RankingItem, SpotDetail — v2.1
- OAuthButton, GuestButton, Divider, LoginCard — v2.1
- LoadingSpinner, SkeletonCard, BottomSheet — v2.1
- Visual QA with Playwright — v2.1

### Active

**v3.0 Admin Panel — AI Management (병렬 진행):**
- [ ] 요청 파이프라인 로그 뷰어
- [ ] 서버 로그/에러 모니터링

**v4.0 Spec Overhaul — AI-Ready Documentation:**
- [ ] 기존 spec 아카이빙 (specs/v2.1.0/)
- [ ] spec 포맷/구조 재설계 (AI 컨텍스트 최적화)
- [ ] discovery 번들 spec 재작성
- [ ] detail-view 번들 spec 재작성
- [ ] creation-ai 번들 spec 재작성
- [ ] user-system 번들 spec 재작성
- [ ] shared 기반 문서 동기화

### Out of Scope

- 태그/키워드 관리 (A-01) — v3.1로 미루기
- 콘텐츠 모더레이션 (A-02) — v3.1로 미루기
- 지급 관리 (A-03) — v3.1로 미루기
- 실시간 알림 — 별도 마일스톤
- 컴포넌트 통합 (15 orphaned) — v2.2로 미루기

## Context

- **프로젝트 초기화**: 2026-01-23
- **v1.0 shipped**: 2026-01-29
- **v1.1 shipped**: 2026-01-29
- **v2.0 shipped**: 2026-02-05
- **v2.1 shipped**: 2026-02-06
- **코드베이스**: Next.js 16 + React 18 + TypeScript 5.9 + Supabase
- **백엔드 API**: https://dev.decoded.style (OpenAPI spec 완비)

## Constraints

- **호환성**: 기존 SpecKit 워크플로우 유지
- **API 우선**: 백엔드 API 스펙을 따름 (프론트엔드 맞춤)
- **점진적 마이그레이션**: Supabase 직접 쿼리 → REST API로 전환

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| .planning/codebase/를 진실 소스로 | AI 생성, 최신 상태 유지 | Good |
| 빈 스펙 폴더 정리 | 혼란 감소, 유지보수성 향상 | Good |
| CLAUDE.md 간결화 | 토큰 효율성 | Good |
| SSOT 원칙 확립 | 문서 충돌 방지 | Good |
| CVA 패턴 사용 | 일관된 컴포넌트 variant 시스템 | Good |
| Playwright Visual QA | 디자인 일관성 자동 검증 | Good |
| Tech debt 수용 (v2.1) | 컴포넌트 생성이 주 목표, 통합은 점진적 | Pending |

| Supabase MCP 연결 | API 탐색 및 타입 생성 용이 | — Pending |
| Pencil MCP로 디자인 → 코드 | decoded.pen 디자인 시스템 구현 | — Pending |

---

*Last updated: 2026-02-19 after v4.0 milestone start*
