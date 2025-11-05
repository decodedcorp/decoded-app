---
type: guideline
title: "Git-Spec 주도 개발 체계 구축 가이드"
created: 2025-11-04
owner: Documentation Team
category: development
tags: [git-spec, workflow, implementation, validation]
status: active
version: "2.0"
---

# Git-Spec 주도 개발 체계 구축 가이드 (v2.0)

**작성일:** 2025-11-04
**버전:** 2.0 (B안: Spec-Plan 동기화 검증)
**상태:** 실행 준비 완료

---

## 📋 목차

1. [개요](#개요)
2. [필수 전제조건](#필수-전제조건)
3. [단계별 구현 가이드](#단계별-구현-가이드)
4. [검증 및 테스트](#검증-및-테스트)
5. [팀 온보딩](#팀-온보딩)
6. [문제 해결](#문제-해결)
7. [KPI 및 성공 지표](#kpi-및-성공-지표)

---

## 개요

### 무엇을 구축하는가?

Git-Spec 주도 개발 체계는 **불변 스펙 ↔ 실행 계획 ↔ 추적/검증** 흐름을 자동화하여:

- ✅ PRD-Plan 드리프트를 50% 감소
- ✅ 문서 동기화 실패를 24시간 내 감지
- ✅ 신규 팀원의 온보딩 시간을 30분 내로 단축

### 4가지 핵심 요소

1. **식별자 시스템** - PRD-TG-0002 형식의 영구 ID
2. **스키마 정의** - JSON Schema 기반 프런트매터 검증
3. **동기화 규칙** - PRD ↔ Plan 양방향 링크 강제
4. **게이트 메커니즘** - Git hooks + CI 자동 검증

---

## 필수 전제조건

### 환경 요구사항

- **Node.js**: ≥18.0.0
- **pnpm**: ≥8.0.0
- **Git**: ≥2.30.0
- **OS**: macOS, Linux, Windows (WSL)

### 프로젝트 상태

```bash
# 현재 디렉토리 확인
pwd
# /Users/kiyeol/development/decoded/decoded-app

# Git 상태 확인
git status
# Clean working tree 권장 (커밋되지 않은 변경사항 없음)

# Node 버전 확인
node --version
# v18.0.0 이상

# pnpm 확인
pnpm --version
# 8.0.0 이상
```

---

## 단계별 구현 가이드

### Phase 1: 스키마 및 검증 도구 설치 (15-20분)

#### Step 1.1: 필요한 패키지 설치

```bash
# 프로젝트 루트에서 실행
cd /Users/kiyeol/development/decoded/decoded-app

# 필수 패키지 설치
pnpm add -D \
  ajv \
  ajv-formats \
  globby \
  gray-matter \
  husky \
  @commitlint/cli \
  @commitlint/config-conventional \
  lint-staged

# 설치 확인
pnpm list ajv globby husky
```

#### Step 1.2: package.json에 스크립트 추가

```json
{
  "scripts": {
    "docs:validate": "node docs/scripts/validate-schema.mjs",
    "docs:build-index": "node docs/scripts/build-index.mjs",
    "docs:verify": "node docs/scripts/verify-relations.mjs",
    "docs:sync": "bash docs/scripts/check-sync.sh",
    "docs:sync:strict": "bash docs/scripts/check-sync.sh --strict",
    "prepare": "husky install"
  }
}
```

#### Step 1.3: 스키마 검증 테스트

```bash
# 스키마 검증 (현재 문서 상태 확인)
pnpm docs:validate

# 예상 출력: 많은 오류가 나올 수 있음 (기존 문서에 메타데이터 없음)
# ❌ Found X validation errors in Y files
```

**참고:** 이 단계에서 오류가 나오는 것은 정상입니다. Phase 2에서 해결합니다.

---

### Phase 2: 기존 문서 마이그레이션 (1-2시간)

#### Step 2.1: 디렉토리 구조 생성

```bash
# 새 디렉토리 구조 생성
mkdir -p docs/{00-specs/{prd/{active,archive},technical-specs,templates},01-plans/{active,completed,templates},02-status,03-guidelines/{development,design,content,deployment},04-analysis/{architecture,decisions,performance},99-archive,.generated}

# 확인
tree docs -L 2
```

#### Step 2.2: 주요 문서에 ID 및 메타데이터 추가

**예시: ThiingsGrid PRD 업데이트**

```bash
# 현재 파일 위치
# docs/prd/infinity-quilt-grid-thiings-style-prd-v2.0.md

# 새 위치로 복사 (원본 유지)
cp docs/prd/infinity-quilt-grid-thiings-style-prd-v2.0.md \
   docs/00-specs/prd/active/thiings-grid-v2.0.md
```

파일 상단에 프런트매터 추가:

```yaml
---
type: prd
id: PRD-TG-0002
title: "Infinity Quilt Grid - ThiingsGrid Style"
version: "2.0"
status: active
created: 2025-08-18
updated: 2025-11-04
owner: Product Team
related_plans:
  - PLAN-TG-0003
related_specs:
  - SPEC-PERF-0001
tags:
  - thiings-grid
  - performance
  - ui
---
```

**예시: Implementation Plan 업데이트**

```bash
# 현재 파일
# docs/implementation/thiings-style-grid-implementation-plan.md

# 새 위치로 복사
cp docs/implementation/thiings-style-grid-implementation-plan.md \
   docs/01-plans/active/thiings-grid-implementation.md
```

프런트매터 추가:

```yaml
---
type: plan
id: PLAN-TG-0003
title: "ThiingsGrid Style Implementation Plan"
version: "2.0"
status: active
created: 2025-08-18
updated: 2025-11-04
owner: Engineering Team
related_specs:
  - PRD-TG-0002
  - SPEC-PERF-0001
phases:
  - name: "Phase 1: Core Integration"
    status: completed
  - name: "Phase 2: Card Data Integration"
    status: completed
  - name: "Phase 3: UX Polish"
    status: in-progress
tags:
  - thiings-grid
  - implementation
---
```

#### Step 2.3: 검증 실행

```bash
# 인덱스 빌드
pnpm docs:build-index

# 스키마 검증
pnpm docs:validate

# 관계 검증
pnpm docs:verify

# 전체 동기화 체크
pnpm docs:sync
```

---

### Phase 3: Git Hooks 설정 (15분)

#### Step 3.1: Husky 설치

```bash
# Husky 초기화 및 hooks 설정
bash docs/scripts/setup-hooks.sh

# 예상 출력:
# ✅ Git hooks installed successfully!
```

#### Step 3.2: Hook 테스트

```bash
# 테스트 커밋 생성
echo "# Test" >> docs/test.md
git add docs/test.md
git commit -m "docs: test git hooks"

# 예상 동작:
# 1. commitlint가 메시지 형식 검증
# 2. pre-commit이 문서 인덱스 업데이트
# 3. .generated/index.json 자동 갱신
```

성공 메시지:

```
🔍 Running ESLint on staged files...
📚 Documentation files changed, running sync checks...
   ✅ Documentation index updated
[feature/git-spec abc1234] docs: test git hooks
 2 files changed, 5 insertions(+)
```

#### Step 3.3: Spec 참조 힌트 테스트

```bash
# PRD 파일 수정
echo "\n## Test Section" >> docs/00-specs/prd/active/thiings-grid-v2.0.md
git add docs/00-specs/prd/active/thiings-grid-v2.0.md

# spec 참조 없이 커밋 시도
git commit -m "docs: update ThiingsGrid PRD"

# 예상 출력 (경고만, 커밋은 성공):
# ⚠️  You modified spec files but didn't reference them in commit message
#    Consider adding: spec(PRD-TG-0002) to track spec changes
```

올바른 커밋:

```bash
git commit -m "docs(grid): update ThiingsGrid PRD spec(PRD-TG-0002)"
# ✅ 경고 없이 성공
```

---

### Phase 4: ADR 초기 기록 작성 (30분)

#### Step 4.1: 주요 의사결정 3개 기록

```bash
# 1. ThiingsGrid 채택 결정
bash docs/scripts/new-adr.sh "Adopt ThiingsGrid Library"
# Created: docs/04-analysis/decisions/ADR-0001-adopt-thiings-grid-library.md

# 2. Design System v3 마이그레이션
bash docs/scripts/new-adr.sh "Migrate to Design System v3"
# Created: docs/04-analysis/decisions/ADR-0002-migrate-to-design-system-v3.md

# 3. Mock Provider 패턴
bash docs/scripts/new-adr.sh "Use Mock Provider Pattern for Data Layer"
# Created: docs/04-analysis/decisions/ADR-0003-use-mock-provider-pattern.md
```

#### Step 4.2: ADR 내용 작성 (예시: ADR-0001)

파일: `docs/04-analysis/decisions/ADR-0001-adopt-thiings-grid-library.md`

프런트매터 업데이트:

```yaml
---
type: adr
id: ADR-0001
title: "Adopt ThiingsGrid Library"
status: accepted
decision_date: 2025-08-18
owner: FE Lead
reversibility: 4
created: 2025-08-18
updated: 2025-11-04
related_specs:
  - PRD-TG-0002
  - SPEC-PERF-0001
tags:
  - architecture
  - ui
  - performance
---
```

주요 섹션 작성:

```markdown
## Context

**Background:**
- 기존 세로 무한 스크롤 그리드는 성능 한계 (LCP 43.7초)
- 2D 탐색 경험 필요
- Thiings.co 벤치마킹 통해 GPU 가속 + 뷰포트 가상화 요구

**Requirements:**
- 60fps 유지
- 1000개+ 카드 메모리 안정성
- 터치/마우스 일관된 경험

## Decision

ThiingsGrid 라이브러리를 직접 통합하여 2D 드래그 탐색 구현

**Why this approach:**
- 검증된 물리 엔진 및 가상화
- 커스터마이징 가능 (소스 직접 통합)
- TanStack Virtual 대비 2D 탐색 특화

## Consequences

**Positive:**
- ✅ 2D 드래그 + 관성 스크롤 즉시 확보
- ✅ GPU 가속 내장
- ✅ 검증된 성능 패턴

**Negative:**
- ❌ 외부 라이브러리 의존성
- ❌ 업데이트 직접 관리 필요

## Revert Plan

**Reversibility Level:** 4/5

**When to revert:**
- 성능이 목표 대비 20% 이상 저하
- 모바일에서 심각한 버그 발생 시

**How to revert:**
1. TanStack Virtual로 교체 (1주)
2. 나선형 배치 알고리즘 자체 구현 (2주)
3. 세로 무한 스크롤로 롤백 (3일)
```

---

### Phase 5: CI 통합 (선택사항, 15분)

#### GitHub Actions 워크플로우

파일: `.github/workflows/docs-check.yml`

```yaml
name: Documentation Check

on:
  pull_request:
    paths:
      - 'docs/**/*.md'
  push:
    branches:
      - main
      - develop

jobs:
  docs-validation:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v3
        with:
          version: 8

      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Validate documentation
        run: pnpm docs:sync:strict

      - name: Check for broken links
        uses: lycheeverse/lychee-action@v1
        with:
          args: --verbose --no-progress 'docs/**/*.md'
          fail: true
```

---

## 검증 및 테스트

### 전체 시스템 테스트

```bash
# 1. 새 PRD 생성
bash docs/scripts/new-prd.sh AUTH "User Authentication System"

# 2. 메타데이터 작성 (에디터에서)
# docs/00-specs/prd/active/user-authentication-system-v1.0.md

# 3. 새 Plan 생성 (수동)
# docs/01-plans/active/auth-implementation.md
# id: PLAN-AUTH-0001
# related_specs: [PRD-AUTH-0001]

# 4. PRD 업데이트 (related_plans 추가)
# related_plans: [PLAN-AUTH-0001]

# 5. 전체 검증
pnpm docs:sync

# 예상 출력:
# ✅ Schema validation passed
# ✅ Index built successfully
# ✅ All relations verified
# ✅ All sync checks passed
```

### 실패 시나리오 테스트

```bash
# 의도적으로 끊어진 링크 생성
# PRD에 related_plans: [PLAN-FAKE-9999] 추가

pnpm docs:verify

# 예상 출력:
# ❌ Found 1 relation errors:
# 📌 BROKEN LINK (1):
#    PRD PRD-AUTH-0001 references non-existent Plan PLAN-FAKE-9999
#    📄 docs/00-specs/prd/active/user-authentication-system-v1.0.md
```

---

## 팀 온보딩

### 신규 팀원 30분 온보딩 가이드

#### 5분: 개요 이해

```bash
# docs/README.md 읽기 (Start-Here 섹션)
cat docs/README.md
```

#### 10분: 문서 탐색

```bash
# 활성 PRD 목록
ls docs/00-specs/prd/active/

# 진행중인 Plan 목록
ls docs/01-plans/active/

# 주요 결정 기록
ls docs/04-analysis/decisions/
```

#### 10분: 실습

```bash
# 1. 테스트 PRD 생성
bash docs/scripts/new-prd.sh TEST "My First Test PRD"

# 2. 메타데이터 작성
# 3. 검증 실행
pnpm docs:sync

# 4. 커밋
git add docs/
git commit -m "docs(test): add test PRD spec(PRD-TEST-0001)"
```

#### 5분: 도구 확인

```bash
# 사용 가능한 명령어
pnpm run | grep docs:

# 예상 출력:
# docs:validate
# docs:build-index
# docs:verify
# docs:sync
# docs:sync:strict
```

### 팀 가이드라인 문서

파일: `docs/03-guidelines/development/git-spec-workflow.md`

```markdown
# Git-Spec 워크플로우 가이드

## 일반 개발 흐름

1. **새 기능 시작**
   - PRD 확인: `docs/00-specs/prd/active/`
   - Plan 확인: `docs/01-plans/active/`

2. **구현 중**
   - 브랜치: `feature/<domain>-<description>`
   - 커밋: `feat(<scope>): <message> spec(<ID>)`

3. **PR 생성**
   - 관련 Spec 참조
   - 동기화 체크 통과 확인

4. **완료**
   - Plan 상태 업데이트
   - 성공 지표 체크

## 문서 작성 흐름

1. **PRD 작성**: `bash docs/scripts/new-prd.sh <DOMAIN> "<TITLE>"`
2. **Plan 작성**: 수동 생성 + 메타데이터
3. **연결**: related_specs / related_plans 상호 참조
4. **검증**: `pnpm docs:sync`
5. **커밋**: `docs(<domain>): ... spec(<ID>)`

## 의사결정 기록

1. **ADR 생성**: `bash docs/scripts/new-adr.sh "<TITLE>"`
2. **작성**: 컨텍스트, 결정, 결과, 되돌리기 계획
3. **Reversibility 평가**: 1(어려움) ~ 5(쉬움)
4. **관련 Spec 연결**: related_specs 추가
```

---

## 문제 해결

### 자주 발생하는 문제

#### 1. 스키마 검증 실패

**증상:**
```
❌ /required must have required property 'id'
```

**해결:**
```yaml
# 프런트매터에 id 추가
---
type: prd
id: PRD-XX-0000  # ← 이 줄 추가
title: "..."
---
```

#### 2. 끊어진 링크

**증상:**
```
❌ Plan PLAN-XX-0003 should reference PRD PRD-XX-0002
```

**해결:**
```yaml
# Plan 파일의 프런트매터 수정
---
type: plan
id: PLAN-XX-0003
related_specs:
  - PRD-XX-0002  # ← 이 줄 추가
---
```

#### 3. Git Hook 실행 안 됨

**증상:**
커밋 시 검증이 실행되지 않음

**해결:**
```bash
# Husky 재설치
rm -rf .husky
bash docs/scripts/setup-hooks.sh

# Hook 권한 확인
ls -la .husky/
# -rwxr-xr-x  (실행 권한 필요)

# 권한 수정
chmod +x .husky/commit-msg .husky/pre-commit
```

#### 4. Index 빌드 실패

**증상:**
```
❌ Failed to read index: docs/.generated/index.json
```

**해결:**
```bash
# .generated 디렉토리 생성
mkdir -p docs/.generated

# 인덱스 재생성
pnpm docs:build-index
```

### 긴급 우회 방법

```bash
# Hook 일시 비활성화 (긴급 상황만)
git commit --no-verify -m "emergency fix"

# 검증 skip (로컬 개발)
SKIP_DOCS_CHECK=1 git commit -m "..."
```

**⚠️  주의**: 우회는 최소한으로, PR에서 반드시 검증 통과 필요

---

## KPI 및 성공 지표

### 2주 후 측정 지표

```bash
# 자동 생성된 통계 확인
cat docs/.generated/stats.json
```

**목표:**

| 지표 | 목표 | 측정 방법 |
|------|------|-----------|
| Sync-Fail 비율 | ≤ 10% | PR 대비 검증 실패 수 |
| 평균 해결 시간 | ≤ 24h | 실패 → 수정 완료 시간 |
| 온보딩 시간 | ≤ 30분 | 신규 팀원 Start-Here → PRD 이해 |
| Spec 참조 커버리지 | ≥ 90% | 커밋 메시지의 spec() 참조 비율 |

### 실험 Kill-Switch

**조건:**
- 2주 연속 Sync-Fail > 40%
- 평균 해결 시간 > 24h

**대응:**
1. 동기화 검증을 fail → warn로 완화
2. 규칙 간소화 (필수 필드만 검증)
3. 팀 피드백 수집 및 재설계

---

## 다음 단계

### 완료 체크리스트

- [ ] Phase 1: 패키지 설치 및 스크립트 추가
- [ ] Phase 2: 주요 문서 2-3개 마이그레이션
- [ ] Phase 3: Git Hooks 설정 및 테스트
- [ ] Phase 4: ADR 3개 작성
- [ ] Phase 5: CI 통합 (선택)
- [ ] 팀 온보딩 가이드 공유
- [ ] 2주 후 KPI 측정

### 확장 옵션 (A안 또는 C안으로)

**A안으로 간소화 (도입 저항 높은 경우):**
- 동기화 검증 제거
- 스키마만 유지
- 수동 문서 관리

**C안으로 강화 (성공적인 경우):**
- 릴리즈 게이트 추가
- 자동 상태 대시보드
- 스펙 커버리지 강제

---

## 연락처 및 지원

**문제 발생 시:**
1. 이 가이드의 [문제 해결](#문제-해결) 섹션 확인
2. `docs/scripts/` 스크립트 주석 읽기
3. 팀 슬랙 채널: #docs-automation (예시)

**개선 제안:**
- GitHub Issues에 피드백 등록
- 정기 회고에서 개선 논의

---

**문서 메타데이터:**
- 작성: 2025-11-04
- 버전: 2.0
- 작성자: Claude Code + Development Team
- 다음 리뷰: 2주 후 (2025-11-18)
