#!/usr/bin/env bash
set -euo pipefail

#
# new-adr.sh
# Create a new Architecture Decision Record
# Usage: ./docs/scripts/new-adr.sh <title>
# Example: ./docs/scripts/new-adr.sh "Adopt ThiingsGrid Library"
#

if [ "$#" -lt 1 ]; then
  echo "Usage: $0 <TITLE>"
  echo "Example: $0 \"Adopt ThiingsGrid Library\""
  exit 1
fi

TITLE="$1"
DATE=$(date +%Y-%m-%d)

# Find next sequence number
NEXT_SEQ=$(find docs/04-analysis/decisions -name "ADR-*.md" ! -name "*template*" 2>/dev/null | \
  sed -E "s/.*ADR-([0-9]{4}).*/\1/" | \
  sort -n | tail -1 | \
  awk '{printf "%04d", $1 + 1}')

# Default to 0001 if no existing ADRs
if [ -z "$NEXT_SEQ" ]; then
  NEXT_SEQ="0001"
fi

ID="ADR-${NEXT_SEQ}"
SLUG=$(echo "$TITLE" | tr '[:upper:]' '[:lower:]' | tr ' ' '-' | tr -cd '[:alnum:]-')
FILENAME="${ID}-${SLUG}.md"
FILEPATH="docs/04-analysis/decisions/${FILENAME}"

# Check if file exists
if [ -f "$FILEPATH" ]; then
  echo "❌ File already exists: $FILEPATH"
  exit 1
fi

# Create file
cat > "$FILEPATH" << EOF
---
type: adr
id: ${ID}
title: "${TITLE}"
status: proposed
decision_date: ${DATE}
owner: [Your Name]
reversibility: 3
created: ${DATE}
updated: ${DATE}
related_specs: []
tags:
  - architecture
---

# ${ID}: ${TITLE}

## Status

**Status:** Proposed
**Decision Date:** ${DATE}
**Reversibility:** 3/5 (1=hard to revert, 5=easy)

## Context

**Background:**
- [프로젝트 배경 및 현재 상황]
- [해결하려는 문제]

**Stakeholders:**
- [영향받는 팀/역할]

**Requirements:**
- [주요 요구사항]
- [성공 기준]

## Decision

**What we decided:**
- [결정 사항을 명확하게 기술]

**Why this approach:**
- [선택한 이유]
- [주요 고려사항]

**Alternatives considered:**

### Alternative 1: [이름]
- 설명: [대안 설명]
- 장점: [장점]
- 단점: [단점]
- 기각 이유: [왜 선택하지 않았는가]

### Alternative 2: [이름]
- 설명: [대안 설명]
- 장점: [장점]
- 단점: [단점]
- 기각 이유: [왜 선택하지 않았는가]

## Consequences

**Positive:**
- ✅ [긍정적 영향 1]
- ✅ [긍정적 영향 2]

**Negative:**
- ❌ [부정적 영향 1]
- ❌ [위험 요소 1]

**Neutral:**
- ℹ️ [중립적 변화 1]

## Implementation

**Timeline:**
- Phase 1: [설명] (Week 1-2)
- Phase 2: [설명] (Week 3-4)

**Required Changes:**
- [ ] 코드 변경
- [ ] 문서 업데이트
- [ ] 팀 교육
- [ ] 인프라 변경

**Success Metrics:**
- 지표 1: [목표 값]
- 지표 2: [목표 값]

## Revert Plan

**Reversibility Level:** 3/5

**When to consider reverting:**
- 조건 1: [예: 성능이 20% 이상 저하되는 경우]
- 조건 2: [예: 치명적 버그가 1주일 내 해결 불가능한 경우]

**How to revert:**

1. **Step 1:** [되돌리기 단계 1]
   - 명령어: \`...\`
   - 예상 소요 시간: X시간
   - 위험도: 낮음/중간/높음

2. **Step 2:** [되돌리기 단계 2]
   - 명령어: \`...\`
   - 예상 소요 시간: X시간
   - 위험도: 낮음/중간/높음

**Fallback solution:**
- [되돌리기가 실패할 경우 백업 계획]

## References

**Related Documents:**
- [PRD-XX-0000](../../00-specs/prd/active/xxx.md)

**External Resources:**
- [참고 자료 링크]

**Related ADRs:**
- [ADR-0001](./ADR-0001-xxx.md) - 관련 결정

---

**Document Metadata:**
- Created: ${DATE}
- Author: [작성자]
- Reviewers: [검토자]
EOF

echo "✅ Created ADR: ${ID}"
echo "📄 File: ${FILEPATH}"
echo ""
echo "Next steps:"
echo "  1. Edit the ADR: ${FILEPATH}"
echo "  2. Add related_specs in frontmatter"
echo "  3. Update reversibility score (1-5)"
echo "  4. Fill in revert plan"
echo "  5. Commit: git commit -m 'docs(architecture): add ${ID} decision record'"
