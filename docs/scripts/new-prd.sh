#!/usr/bin/env bash
set -euo pipefail

#
# new-prd.sh
# Create a new PRD document with proper ID and frontmatter
# Usage: ./docs/scripts/new-prd.sh <domain> <title>
# Example: ./docs/scripts/new-prd.sh TG "ThiingsGrid Enhancement"
#

if [ "$#" -lt 2 ]; then
  echo "Usage: $0 <DOMAIN> <TITLE>"
  echo "Example: $0 TG \"ThiingsGrid Enhancement\""
  echo ""
  echo "Common domains:"
  echo "  TG    - ThiingsGrid"
  echo "  DS    - Design System"
  echo "  AUTH  - Authentication"
  echo "  PERF  - Performance"
  exit 1
fi

DOMAIN="$1"
TITLE="$2"
DATE=$(date +%Y-%m-%d)

# Find next sequence number for this domain
NEXT_SEQ=$(find docs/00-specs/prd -name "PRD-${DOMAIN}-*.md" 2>/dev/null | \
  sed -E "s/.*PRD-${DOMAIN}-([0-9]{4}).*/\1/" | \
  sort -n | tail -1 | \
  awk '{printf "%04d", $1 + 1}')

# Default to 0001 if no existing PRDs for this domain
if [ -z "$NEXT_SEQ" ]; then
  NEXT_SEQ="0001"
fi

ID="PRD-${DOMAIN}-${NEXT_SEQ}"
SLUG=$(echo "$TITLE" | tr '[:upper:]' '[:lower:]' | tr ' ' '-' | tr -cd '[:alnum:]-')
FILENAME="${SLUG}-v1.0.md"
FILEPATH="docs/00-specs/prd/active/${FILENAME}"

# Check if file exists
if [ -f "$FILEPATH" ]; then
  echo "❌ File already exists: $FILEPATH"
  exit 1
fi

# Create file
cat > "$FILEPATH" << EOF
---
type: prd
id: ${ID}
title: "${TITLE}"
version: "1.0"
status: draft
created: ${DATE}
updated: ${DATE}
owner: Product Team
related_plans: []
related_specs: []
tags:
  - ${DOMAIN,,}
---

# ${TITLE} PRD

**Version:** 1.0
**Date:** ${DATE}
**ID:** ${ID}
**Status:** Draft

---

## 배경 (Background)

[프로젝트 배경 및 동기를 설명합니다]

---

## 목표 (Objectives)

### 주요 목표
1. **목표 1**: 설명
2. **목표 2**: 설명
3. **목표 3**: 설명

### 성공 지표
- [ ] 지표 1: [측정 기준]
- [ ] 지표 2: [측정 기준]
- [ ] 지표 3: [측정 기준]

---

## 범위 (Scope)

### In Scope
- 포함 항목 1
- 포함 항목 2
- 포함 항목 3

### Out of Scope
- 제외 항목 1
- 제외 항목 2

---

## 기술 사양 (Technical Specifications)

[기술적 요구사항을 상세히 기술합니다]

---

## 구현 계획 (Implementation Plan)

### Phase 1: [이름]
- [ ] 작업 1
- [ ] 작업 2
- [ ] 작업 3

### Phase 2: [이름]
- [ ] 작업 1
- [ ] 작업 2

---

## 성공 기준 (Success Criteria)

### 기능적 요구사항
- [ ] 요구사항 1
- [ ] 요구사항 2

### 성능 요구사항
- [ ] 요구사항 1
- [ ] 요구사항 2

### 사용자 경험 요구사항
- [ ] 요구사항 1
- [ ] 요구사항 2

---

## 위험 요소 및 대응 (Risk Management)

### 기술적 위험
1. **위험 1** (높음/중간/낮음)
   - 대응: [대응 방안]

### UX 위험
1. **위험 1** (높음/중간/낮음)
   - 대응: [대응 방안]

---

## 다음 단계

1. **우선순위 1** - [설명]
2. **우선순위 2** - [설명]
3. **우선순위 3** - [설명]

---

**문서 메타데이터**
- 최종 수정일: ${DATE}
- 담당자: [팀/이름]
- 관련 문서: [링크]
EOF

echo "✅ Created PRD: ${ID}"
echo "📄 File: ${FILEPATH}"
echo ""
echo "Next steps:"
echo "  1. Edit the PRD: ${FILEPATH}"
echo "  2. Create implementation plan: ./docs/scripts/new-plan.sh ${DOMAIN} \"${TITLE} Implementation\""
echo "  3. Link them together in frontmatter"
echo "  4. Commit: git commit -m 'docs(${DOMAIN,,}): add ${ID} PRD spec(${ID})'"
