# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-01-29)

**Core value:** 완전한 사용자 경험
**Current focus:** v1.1 Full API Integration

## Current Position

**Milestone:** v1.1 Full API Integration
**Phase:** Not started (defining requirements)
**Status:** Defining requirements

## Milestones

| Version | Name | Status | Date |
|---------|------|--------|------|
| v1.0 | Documentation Optimization | SHIPPED | 2026-01-29 |
| v1.1 | Full API Integration | IN PROGRESS | 2026-01-29 |

## Last Activity

- **2026-01-29**: v1.1 milestone started (API 연결 범위 확정)

## Accumulated Context

### Decisions Made (v1.0)
- .planning/codebase/ = source of truth for codebase analysis
- SSOT principle: docs/ = implemented, specs/ = designed, codebase/ = analyzed
- Empty spec folders cleaned up (bugfix, experiment, feature)

### Decisions Made (v1.1)
- Supabase MCP 연결하여 API 탐색
- 백엔드 OpenAPI spec 기준으로 프론트엔드 구현
- 전체 API 연결 (Admin 제외)

### Open Items
- v2 deferred: API 문서 자동화, 문서 린터, Admin 대시보드, 실시간 알림

### Tech Debt
- Supabase 직접 쿼리 → REST API 전환 필요 (일부 페이지)

### Backend API Reference
- OpenAPI: https://dev.decoded.style/api-docs/openapi.json
- Base URL: https://dev.decoded.style/api/v1

---

*Last updated: 2026-01-29 after v1.1 milestone start*
