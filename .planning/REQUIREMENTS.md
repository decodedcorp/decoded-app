# Requirements

## v1 Requirements

### CLAUDE.md 최적화 (DOC)
- [ ] **DOC-01**: .planning/codebase/ 참조 추가 (ARCHITECTURE.md, STACK.md, CONVENTIONS.md 링크)
- [ ] **DOC-02**: 오래된 정보 업데이트 (specs/001-scroll-animation → specs/scroll-animation)
- [ ] **DOC-03**: 핵심 파일 위치 섹션 추가 (lib/stores, lib/hooks, lib/supabase 등)
- [ ] **DOC-04**: GSD 명령어 가이드 추가 (/gsd:* 명령어 목록)

### Specs 정리 (SPEC)
- [ ] **SPEC-01**: 빈 폴더 정리 (bugfix/, experiment/, feature/ 삭제 또는 .gitkeep)
- [ ] **SPEC-02**: specs/README.md 업데이트 (현재 상태 반영, .planning/codebase 연결)
- [ ] **SPEC-03**: shared/templates/ 최신화 (현재 코드베이스 패턴 반영)
- [ ] **SPEC-04**: 폴더/파일명 네이밍 통일 (kebab-case 일관성)

### Docs 정리 (DOC)
- [ ] **DOC-05**: docs/README.md 업데이트 (.planning/codebase/ 연결)
- [ ] **DOC-06**: docs/api/ 와 실제 API 라우트 매핑 (app/api/v1/* 동기화)
- [ ] **DOC-07**: docs/adr/ 정리 (최신 결정사항 반영)
- [ ] **DOC-08**: 중복 문서 식별 및 통합

### 통합 (INTG)
- [ ] **INTG-01**: .planning/codebase/ ↔ specs/ 크로스 레퍼런스 추가
- [ ] **INTG-02**: .planning/codebase/ ↔ docs/ 크로스 레퍼런스 추가
- [ ] **INTG-03**: 단일 진실 소스(SSOT) 원칙 문서화

## v2 Requirements (Deferred)
- API 문서 자동 생성 파이프라인
- OpenAPI spec 자동 생성
- 문서 린터 설정

## Out of Scope
- 새 기능 개발 — 문서화만
- 코드 변경 — 문서 파일만 수정
- 완벽한 API 문서 — 연결 및 구조만 우선

## Traceability

| REQ-ID | Phase | Status |
|--------|-------|--------|
| DOC-01 | Phase 1 | Pending |
| DOC-02 | Phase 1 | Pending |
| DOC-03 | Phase 1 | Pending |
| DOC-04 | Phase 1 | Pending |
| SPEC-01 | Phase 2 | Pending |
| SPEC-02 | Phase 2 | Pending |
| SPEC-03 | Phase 2 | Pending |
| SPEC-04 | Phase 2 | Pending |
| DOC-05 | Phase 3 | Pending |
| DOC-06 | Phase 3 | Pending |
| DOC-07 | Phase 3 | Pending |
| DOC-08 | Phase 3 | Pending |
| INTG-01 | Phase 4 | Pending |
| INTG-02 | Phase 4 | Pending |
| INTG-03 | Phase 5 | Pending |

---

*Last updated: 2026-01-23*
