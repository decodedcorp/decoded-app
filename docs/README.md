# Decoded 프로젝트 문서 시스템

**문서 버전:** 2.0 (Git-Spec 주도 개발 체계)
**마지막 업데이트:** 2025-11-04
**온보딩 목표 시간:** 30분

---

## 🚀 Start-Here: 30분 온보딩

### 5분: 핵심 개념 이해

**Git-Spec 주도 개발이란?**

불변 스펙(PRD) → 실행 계획(Plan) → 추적/검증(Status)의 흐름을 자동화하여 문서 드리프트를 방지하는 개발 체계

**4가지 핵심 요소:**

1. **식별자 시스템** - PRD-TG-0002 형식의 영구 ID로 문서 추적
2. **스키마 정의** - JSON Schema 기반 프런트매터 자동 검증
3. **동기화 규칙** - PRD ↔ Plan 양방향 링크 강제
4. **게이트 메커니즘** - Git hooks + CI로 품질 자동 검증

### 10분: 문서 구조 탐색

```
docs/
├── 00-specs/          # 불변 스펙 (변경 시 버전업)
│   ├── prd/           # 제품 요구사항 (PRD-XX-####)
│   └── technical-specs/ # 기술 제약 (SPEC-XX-####)
│
├── 01-plans/          # 실행 계획 (구현 전략)
│   ├── active/        # 진행중 (PLAN-XX-####)
│   └── completed/     # 완료
│
├── 02-status/         # 추적 현황 (자동 생성)
│   ├── handoff-status.md
│   └── sprint-status.md
│
├── 03-guidelines/     # 가이드라인 (권장 패턴)
│   ├── development/
│   ├── design/
│   └── content/
│
└── 04-analysis/       # 의사결정 기록
    └── decisions/     # ADR (ADR-####)
```

**빠른 탐색:**

```bash
# 활성 PRD 확인
ls docs/00-specs/prd/active/

# 진행중인 계획
ls docs/01-plans/active/

# 최근 의사결정
ls docs/04-analysis/decisions/
```

### 10분: 실습 - 문서 생성 및 검증

```bash
# 1. 새 PRD 생성
bash docs/scripts/new-prd.sh TEST "My First Test PRD"

# 2. 파일 열기 및 메타데이터 확인
# docs/00-specs/prd/active/my-first-test-prd-v1.0.md

# 3. 검증 실행
pnpm docs:sync

# 4. 커밋
git add docs/
git commit -m "docs(test): add test PRD spec(PRD-TEST-0001)"
```

### 5분: 주요 명령어

```bash
# 문서 검증
pnpm docs:validate      # 스키마 검증
pnpm docs:build-index   # 인덱스 빌드
pnpm docs:verify        # 관계 검증
pnpm docs:sync          # 전체 동기화 체크

# 문서 생성
bash docs/scripts/new-prd.sh <DOMAIN> "<TITLE>"
bash docs/scripts/new-adr.sh "<TITLE>"

# Git Hooks 설치
bash docs/scripts/setup-hooks.sh
```

---

## 📚 주요 문서

### 시작하기

- **[Git-Spec 구현 가이드](./GIT_SPEC_IMPLEMENTATION_GUIDE.md)** - 전체 시스템 구축 방법 (1-2시간)
- **[팀 개발 가이드](./03-guidelines/development/team-guide.md)** - 협업 워크플로우
- **[핸드오프 상태](./02-status/handoff-status.md)** - 현재 개발 상태

### 주요 PRD

- **[ThiingsGrid PRD v2.0](./00-specs/prd/active/thiings-grid-v2.0.md)** (PRD-TG-0002)
  - 2D 드래그 탐색 무한 그리드 구현
  - 관련 계획: [PLAN-TG-0003](./01-plans/active/thiings-grid-implementation.md)

### 진행중인 계획

- **[ThiingsGrid Implementation](./01-plans/active/thiings-grid-implementation.md)** (PLAN-TG-0003)
  - Phase 3: UX Polish 진행중

### 주요 의사결정 (ADR)

- **[ADR-0001](./04-analysis/decisions/ADR-0001-adopt-thiings-grid-library.md)** - ThiingsGrid 라이브러리 채택
  - Reversibility: 4/5

---

## 🔧 도구 및 자동화

### Git Hooks

**설치:**
```bash
bash docs/scripts/setup-hooks.sh
```

**동작:**
- `commit-msg`: Conventional Commits 검증 + spec 참조 힌트
- `pre-commit`: ESLint + 문서 인덱스 자동 갱신

### 스키마 검증

**스키마 정의:** [docs/.schema/doc.schema.json](./.schema/doc.schema.json)

**검증 실행:**
```bash
pnpm docs:validate
```

**예상 출력:**
```
✅ All 42 documents validated successfully
```

### 동기화 검증

**양방향 링크 체크:**
```bash
pnpm docs:verify
```

**전체 동기화:**
```bash
pnpm docs:sync          # Warn mode (권장)
pnpm docs:sync:strict   # Fail mode (CI용)
```

---

## 📖 가이드라인

### 문서 작성 규칙

#### PRD (Product Requirements Document)

```yaml
---
type: prd
id: PRD-<DOMAIN>-<SEQUENCE>
title: "명확한 제목"
version: "1.0"
status: draft | active | completed | archived
created: YYYY-MM-DD
updated: YYYY-MM-DD
owner: "Product Team"
related_plans:
  - PLAN-<DOMAIN>-<SEQUENCE>
related_specs:
  - SPEC-<DOMAIN>-<SEQUENCE>
tags:
  - domain
  - feature
---
```

#### Plan (Implementation Plan)

```yaml
---
type: plan
id: PLAN-<DOMAIN>-<SEQUENCE>
title: "구현 계획 제목"
status: draft | active | completed | archived
created: YYYY-MM-DD
updated: YYYY-MM-DD
owner: "Engineering Team"
related_specs:
  - PRD-<DOMAIN>-<SEQUENCE>
phases:
  - name: "Phase 1"
    status: completed | in-progress | pending
tags:
  - implementation
---
```

#### ADR (Architecture Decision Record)

```yaml
---
type: adr
id: ADR-<SEQUENCE>
title: "결정 제목"
status: proposed | accepted | rejected | deprecated | superseded
decision_date: YYYY-MM-DD
owner: "Decision Maker"
reversibility: 1-5
created: YYYY-MM-DD
updated: YYYY-MM-DD
related_specs:
  - PRD-<DOMAIN>-<SEQUENCE>
revert_plan:
  trigger: "되돌리기 조건"
  steps: ["단계 1", "단계 2"]
---
```

### 커밋 메시지 규칙

**Conventional Commits 형식:**

```
<type>(<scope>): <subject> [spec(<ID>)]

type: feat, fix, docs, style, refactor, perf, test, build, ci, chore
scope: 도메인 또는 모듈명 (예: grid, auth, design-system)
spec: 관련 문서 ID (PRD-XX-0000, PLAN-XX-0000, ADR-0000)
```

**예시:**

```bash
# PRD 작성
git commit -m "docs(grid): add ThiingsGrid PRD spec(PRD-TG-0002)"

# Plan 업데이트
git commit -m "docs(grid): update implementation plan phase 3 spec(PLAN-TG-0003)"

# 코드 구현
git commit -m "feat(grid): implement 2D drag navigation spec(PLAN-TG-0003)"

# ADR 기록
git commit -m "docs(architecture): record ThiingsGrid adoption decision"
```

### 문서 ID 규칙

| 타입 | 형식 | 예시 | 도메인 |
|------|------|------|--------|
| PRD | `PRD-<DOMAIN>-<SEQUENCE>` | `PRD-TG-0002` | TG=ThiingsGrid |
| Plan | `PLAN-<DOMAIN>-<SEQUENCE>` | `PLAN-TG-0003` | DS=DesignSystem |
| Spec | `SPEC-<DOMAIN>-<SEQUENCE>` | `SPEC-PERF-0001` | AUTH=Authentication |
| ADR | `ADR-<SEQUENCE>` | `ADR-0007` | (도메인 생략) |

**일반 도메인:**
- `TG` - ThiingsGrid
- `DS` - Design System
- `AUTH` - Authentication
- `PERF` - Performance
- `MOB` - Mobile
- `CH` - Channels
- `CONT` - Content

---

## 🧪 문제 해결

### 자주 발생하는 오류

#### 1. 스키마 검증 실패

```
❌ /required must have required property 'id'
```

**해결:** 프런트매터에 `id` 필드 추가

#### 2. 끊어진 링크

```
❌ Plan PLAN-XX-0003 should reference PRD PRD-XX-0002
```

**해결:** Plan의 `related_specs`에 PRD ID 추가

#### 3. Git Hook 실행 안 됨

```bash
# Husky 재설치
bash docs/scripts/setup-hooks.sh

# 권한 확인
chmod +x .husky/commit-msg .husky/pre-commit
```

### 긴급 우회

```bash
# Hook 비활성화 (긴급 상황만)
git commit --no-verify -m "emergency fix"
```

**⚠️  주의:** PR에서 반드시 검증 통과 필요

---

## 📊 문서 통계

```bash
# 자동 생성된 통계 확인
cat docs/.generated/stats.json
```

**예시 출력:**
```json
{
  "total": 42,
  "by_type": {
    "prd": 8,
    "plan": 12,
    "adr": 3,
    "guideline": 15,
    "status": 4
  },
  "by_status": {
    "active": 18,
    "completed": 10,
    "archived": 3
  },
  "missing_ids": [],
  "updated": "2025-11-04T10:30:00Z"
}
```

---

## 🎯 다음 단계

### 신규 팀원

1. ✅ 이 README 읽기 (5분)
2. ✅ 주요 PRD 1-2개 읽기 (10분)
3. ✅ 테스트 문서 생성 (10분)
4. ✅ 커밋 및 검증 (5분)

### 기존 팀원

1. 📖 [Git-Spec 구현 가이드](./GIT_SPEC_IMPLEMENTATION_GUIDE.md) 읽기
2. 🔧 Git Hooks 설치: `bash docs/scripts/setup-hooks.sh`
3. 📝 기존 문서 마이그레이션 (우선순위: PRD → Plan)
4. ✅ 검증 통과 확인: `pnpm docs:sync`

### 프로젝트 리더

1. 📊 KPI 설정 및 측정 계획
2. 🧪 2주 실험 기간 설정
3. 📢 팀 온보딩 세션 진행
4. 🔄 회고 및 개선 (2주 후)

---

## 📞 지원 및 피드백

**문제 발생 시:**
1. [문제 해결](#문제-해결) 섹션 확인
2. [Git-Spec 구현 가이드](./GIT_SPEC_IMPLEMENTATION_GUIDE.md#문제-해결) 참조
3. 팀 슬랙: #docs-automation (예시)

**개선 제안:**
- GitHub Issues
- 정기 회고

---

## 📜 라이선스 및 메타데이터

**문서 버전:** 2.0
**시스템 버전:** B안 (Spec-Plan 동기화 검증)
**마지막 업데이트:** 2025-11-04
**다음 리뷰:** 2025-11-18 (2주 후)
**작성자:** Claude Code + Development Team

**주요 변경사항 (v2.0):**
- ✅ 식별자 시스템 도입 (PRD-XX-####)
- ✅ JSON Schema 기반 검증
- ✅ 양방향 링크 강제
- ✅ Git Hooks 자동화
- ✅ ADR 템플릿 및 가역성 평가
