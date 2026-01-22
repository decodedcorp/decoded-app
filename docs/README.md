# Documentation Index

> Last Updated: 2026-01-22

## 문서 소유권 (Source of Truth)

| 영역 | 위치 | 설명 |
|------|------|------|
| 시스템 아키텍처 | `docs/architecture/` | 현재 구현 상태 |
| DB 스키마 사용법 | `docs/database/` | 실제 사용 패턴 |
| API 엔드포인트 | `docs/api/` | 구현된 API 문서 |
| 디자인 시스템 | `docs/design-system/` | UI 토큰 및 컴포넌트 |
| TypeScript 타입 | `specs/shared/data-models.md` | 설계 의도 타입 정의 |
| 기능 명세 | `specs/{bundle}/spec.md` | 요구사항 및 설계 |
| 화면 설계 | `specs/{bundle}/screens/` | UI/UX 명세 |
| API 계약 (설계) | `specs/shared/api-contracts.md` | Screen-API 매핑 |

## 원칙

- **docs/**: 구현된 것 (WHAT IS)
- **specs/**: 설계 의도 (WHAT SHOULD BE)
- **CLAUDE.md**: 빠른 참조 (Quick Reference)

---

## 주요 문서

### Architecture
- [아키텍처 개요](./architecture/README.md)
- [ADR (Architecture Decision Records)](./adr/)

### Database
- [스키마 사용 가이드](./database/01-schema-usage.md)
- [데이터 흐름](./database/03-data-flow.md)

### API
- [API 문서 개요](./api/README.md)
- [공통 스키마](./api/schemas.md)

### Design System
- [디자인 토큰](./design-system/)

### AI Playbook
- [AI 도구 가이드](./ai-playbook/)

---

## Specs (설계 문서)

- [공통 데이터 모델](../specs/shared/data-models.md)
- [API 계약](../specs/shared/api-contracts.md)
