# Roadmap

## Overview

**목표**: AI 에이전트 효율화를 위한 specs/docs 정리 및 최적화
**총 요구사항**: 15개
**Phase 수**: 5개
**예상 소요**: 오늘 내 완료

---

## Phases

### Phase 1: CLAUDE.md 최적화
**Goal**: Claude Code가 프로젝트를 빠르게 이해할 수 있도록 CLAUDE.md 개선

**Requirements**: DOC-01, DOC-02, DOC-03, DOC-04

**Success Criteria**:
1. .planning/codebase/ 문서들이 CLAUDE.md에서 참조됨
2. 모든 경로 정보가 최신 상태
3. GSD 명령어 목록이 포함됨

---

### Phase 2: Specs 구조 정리
**Goal**: specs/ 폴더 구조 정리 및 표준화

**Requirements**: SPEC-01, SPEC-02, SPEC-03, SPEC-04

**Success Criteria**:
1. 빈 폴더가 정리됨 (삭제 또는 의미있는 내용 추가)
2. README.md가 현재 상태를 반영
3. 템플릿이 현재 코드베이스 패턴을 반영
4. 모든 폴더/파일이 일관된 네이밍 사용

---

### Phase 3: Docs 구조 정리
**Goal**: docs/ 폴더 정리 및 최신화

**Requirements**: DOC-05, DOC-06, DOC-07, DOC-08

**Success Criteria**:
1. README.md가 .planning/codebase/ 참조
2. API 문서가 실제 라우트와 동기화
3. ADR이 최신 결정사항 반영
4. 중복 문서가 식별되고 통합됨

---

### Phase 4: 크로스 레퍼런스 추가
**Goal**: .planning/codebase/, specs/, docs/ 간 연결 강화

**Requirements**: INTG-01, INTG-02

**Success Criteria**:
1. codebase 문서에서 관련 specs 링크
2. codebase 문서에서 관련 docs 링크
3. 양방향 참조 가능

---

### Phase 5: SSOT 원칙 문서화
**Goal**: 단일 진실 소스 원칙 확립 및 문서화

**Requirements**: INTG-03

**Success Criteria**:
1. SSOT 원칙이 명확히 문서화
2. 각 정보 유형의 진실 소스 위치가 정의됨
3. 문서 유지보수 가이드 포함

---

## Summary

| Phase | Goal | Requirements | Success Criteria |
|-------|------|--------------|------------------|
| 1 | CLAUDE.md 최적화 | DOC-01~04 | 3 |
| 2 | Specs 구조 정리 | SPEC-01~04 | 4 |
| 3 | Docs 구조 정리 | DOC-05~08 | 4 |
| 4 | 크로스 레퍼런스 | INTG-01~02 | 3 |
| 5 | SSOT 원칙 | INTG-03 | 3 |

**모든 v1 요구사항 매핑 완료** ✓

---

*Created: 2026-01-23*
