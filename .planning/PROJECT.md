# Project: decoded-app

## What This Is

AI 기반 미디어 디스커버리 플랫폼. K-POP 아이돌과 셀럽의 패션 아이템을 발견하고 공유하는 서비스.

**v1.0 (2026-01-29 shipped):** 문서화 최적화
**v1.1 (2026-01-29 shipped):** 전체 API 연결 — 백엔드 API를 프론트엔드에 연결하여 실제 데이터로 동작
**v2.0 (진행중):** 디자인 오버홀 — decoded.pen 디자인을 코드로 구현

## Active Milestones

### v2.0 Design Overhaul (진행중)

**Goal:** decoded.pen 디자인을 Pencil MCP로 코드로 변환하여 디자인-코드 일관성 확보

**Target features:**
- 디자인 시스템 컴포넌트 (Buttons, Cards, Inputs, Tags, Typography)
- 데스크탑 인프라 (Header, Footer, Sidebar, Layouts)
- 8개 페이지 (Home, Feed, Profile, Search, Image Detail, Request Flow, Explore, Login)
- 모바일 + 데스크탑 반응형 레이아웃
- 문서 업데이트 (docs, specs, codebase)

**Branch:** `feature/v2-design-overhaul` (v1.1과 별도 브랜치)

## Core Value

**완전한 사용자 경험** — 모든 페이지가 실제 데이터로 동작하여 프로덕션 레벨의 서비스 제공

## Current State

### Codebase
- **Tech Stack**: Next.js 16 + React 18 + TypeScript 5.9 + Supabase + Zustand + React Query
- **Structure**: Monorepo (packages/web, packages/shared)
- **Codebase Map**: `.planning/codebase/` (8 files, 3,250+ lines)

### Documentation (v1.0 shipped)
- **CLAUDE.md**: AI 에이전트용 최적화 완료
- **specs/**: 9개 번들 (빈 폴더 정리됨)
- **docs/**: SSOT 테이블, codebase 연결 완료
- **SSOT**: `.planning/SSOT.md` 원칙 문서화

## Requirements

### Validated

- CLAUDE.md에 codebase 참조 추가 — v1.0
- specs/README.md 업데이트 — v1.0
- docs/README.md 업데이트 — v1.0
- 빈 스펙 폴더 정리 — v1.0
- 크로스 레퍼런스 추가 — v1.0
- SSOT 원칙 문서화 — v1.0
- 프로필 API 연결 (GET/PATCH, activities, stats) — v1.1
- Posts/Spots/Solutions CRUD API — v1.1
- 투표/댓글 시스템 API — v1.1
- 랭킹/배지 시스템 API — v1.1
- 수익 대시보드/정산 API — v1.1
- 검색 API (popular, recent) — v1.1

### Active

**v2.0 Design Overhaul:**
- [x] 디자인 토큰 추출 (색상, 타이포그래피, 간격)
- [x] 타이포그래피 컴포넌트 구현 (Heading, Text)
- [x] Tailwind CSS 설정 확장
- [ ] 버튼, 입력, 태그 컴포넌트
- [ ] 카드 컴포넌트 (Product, Feed, Profile)
- [ ] 데스크탑 레이아웃 (Header, Footer, Sidebar)
- [ ] 페이지별 디자인 적용 (8개 페이지)

### Out of Scope

- Admin 기능 — 관리자 대시보드는 별도 마일스톤
- 실시간 알림 — v2로 미루기
- 소셜 로그인 추가 — 현재 OAuth 유지

## Context

- **프로젝트 초기화**: 2026-01-23
- **v1.0 shipped**: 2026-01-29
- **v1.1 shipped**: 2026-01-29
- **v2.0 started**: 2026-01-29
- **코드베이스**: Next.js 16 + React 18 + TypeScript 5.9 + Supabase
- **백엔드 API**: https://dev.decoded.style (OpenAPI spec 완비)
- **상태**: v2.0 Design Overhaul 진행중

## Constraints

- **호환성**: 기존 SpecKit 워크플로우 유지
- **API 우선**: 백엔드 API 스펙을 따름 (프론트엔드 맞춤)
- **점진적 마이그레이션**: Supabase 직접 쿼리 → REST API로 전환

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| .planning/codebase/를 진실 소스로 | AI 생성, 최신 상태 유지 | ✓ Good |
| 빈 스펙 폴더 정리 | 혼란 감소, 유지보수성 향상 | ✓ Good |
| CLAUDE.md 간결화 | 토큰 효율성 | ✓ Good |
| SSOT 원칙 확립 | 문서 충돌 방지 | ✓ Good |

| Supabase MCP 연결 | API 탐색 및 타입 생성 용이 | — Pending |

| Pencil MCP로 디자인 → 코드 | decoded.pen 디자인 시스템 구현 | — Pending |

---

*Last updated: 2026-01-29 after v1.1 milestone completion*
