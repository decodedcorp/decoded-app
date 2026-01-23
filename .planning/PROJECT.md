# Project: decoded-app Documentation Optimization

## What This Is

AI 에이전트(Claude Code, Cursor)가 decoded-app 코드베이스를 빠르고 정확하게 이해할 수 있도록 specs와 docs를 정리하고 최적화하는 프로젝트.

## Core Value

**AI 에이전트 효율화** — 새로운 Claude 세션이 시작될 때 프로젝트 컨텍스트를 최소한의 토큰으로 최대한 정확하게 전달.

## Current State

### Codebase
- **Tech Stack**: Next.js 16 + React 18 + TypeScript 5.9 + Supabase + Zustand + React Query
- **Structure**: Monorepo (packages/web, packages/shared)
- **Codebase Map**: `.planning/codebase/` (방금 생성됨, 3,250 라인)

### Specs (현재)
- 12개 폴더: admin, bugfix, creation-ai, detail-view, discovery, experiment, feature, mobile-platform, scroll-animation, shared, system-backend, user-system
- SpecKit 기반 구조 일부 사용
- 일관성 부족: 일부는 상세, 일부는 스텁만 존재

### Docs (현재)
- 10개 폴더: adr, ai-playbook, api, architecture, database, design-system, diagrams, performance, prompts, testing
- 단일 파일들: nginx-cloudflare-setup.md, post-centric-refactoring-summary.md, server-setup.md
- 최신 코드와 동기화 필요

## Target State

### 1. CLAUDE.md 최적화
- 프로젝트 개요 간결화
- `.planning/codebase/` 참조 추가
- 자주 사용하는 명령어 업데이트
- 핵심 파일 위치 정리

### 2. 코드베이스 문서 연결
- `.planning/codebase/` ↔ `specs/` 크로스 레퍼런스
- `.planning/codebase/` ↔ `docs/` 크로스 레퍼런스
- 중복 제거 및 단일 진실 소스(Single Source of Truth) 확립

### 3. Specs 구조 표준화
- 모든 스펙에 일관된 템플릿 적용
- 네이밍 컨벤션 통일
- 미완성 스텁 정리 (삭제 또는 완성)

### 4. API 문서 자동화
- OpenAPI spec 생성 또는 연결
- `docs/api/` 와 실제 API 라우트 동기화
- 자동 생성 파이프라인 설정

## Constraints

- **시간**: 오늘 내 완료
- **범위**: 핵심만 빠르게 (완벽보다 실용성)
- **호환성**: 기존 SpecKit 워크플로우 유지

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] CLAUDE.md에 .planning/codebase/ 참조 추가
- [ ] specs/README.md 업데이트 (현재 상태 반영)
- [ ] docs/README.md 업데이트 (현재 상태 반영)
- [ ] 미사용 스펙 폴더 정리 (bugfix, experiment, feature)
- [ ] specs/shared/ 템플릿 최신화
- [ ] docs/api/ 와 실제 API 라우트 매핑
- [ ] 중복 문서 식별 및 통합

### Out of Scope

- 새 기능 개발 — 문서화만
- 코드 변경 — 문서만
- 완벽한 API 문서 — 연결만 우선

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| .planning/codebase/를 진실 소스로 | 방금 생성되어 최신 상태 | — Pending |
| 빈 스펙 폴더 정리 | 혼란 감소, 유지보수성 향상 | — Pending |
| CLAUDE.md 간결화 | 토큰 효율성 | — Pending |

---

*Last updated: 2026-01-23 after initialization*
