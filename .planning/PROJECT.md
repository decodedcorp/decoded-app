# Project: decoded-app

## What This Is

AI 기반 미디어 디스커버리 플랫폼. K-POP 아이돌과 셀럽의 패션 아이템을 발견하고 공유하는 서비스.

**v1.0 (2026-01-29 shipped):** 문서화 최적화 — AI 에이전트가 프로젝트 컨텍스트를 빠르게 이해할 수 있도록 specs/docs 정리

## Core Value

**AI 에이전트 효율화** — 새로운 Claude 세션이 시작될 때 프로젝트 컨텍스트를 최소한의 토큰으로 최대한 정확하게 전달.

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

### Active

(다음 마일스톤에서 정의)

### Out of Scope

- 새 기능 개발 — 문서화만 (v1.0)
- 완벽한 API 문서 — 연결 및 구조만 우선 (v1.0)

## Context

- **프로젝트 초기화**: 2026-01-23
- **v1.0 shipped**: 2026-01-29
- **코드베이스**: Next.js 16 + React 18 + TypeScript 5.9 + Supabase
- **상태**: 문서화 최적화 완료, 새 마일스톤 대기

## Constraints

- **호환성**: 기존 SpecKit 워크플로우 유지
- **범위**: 핵심만 빠르게 (완벽보다 실용성)

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| .planning/codebase/를 진실 소스로 | AI 생성, 최신 상태 유지 | ✓ Good |
| 빈 스펙 폴더 정리 | 혼란 감소, 유지보수성 향상 | ✓ Good |
| CLAUDE.md 간결화 | 토큰 효율성 | ✓ Good |
| SSOT 원칙 확립 | 문서 충돌 방지 | ✓ Good |

---

*Last updated: 2026-01-29 after v1.0 milestone*
