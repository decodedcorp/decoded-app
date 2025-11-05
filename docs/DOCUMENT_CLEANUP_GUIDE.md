---
type: guideline
title: "Document Cleanup Execution Guide"
created: 2025-11-04
owner: Documentation Team
category: documentation
tags: [cleanup, archive, tombstone, workflow]
status: active
---

# Document Cleanup Execution Guide

**목표**: 불필요/중복/완료된 문서를 안전하게 아카이브하고 링크 무결성 유지

**전략**: B안 (Archive + Tombstone + Auto-redirect)

---

## 📋 Quick Reference

```bash
# 1. 후보 찾기
node docs/scripts/find-archive-candidates.mjs --output candidates.json

# 2. 검토 (dry-run)
bash docs/scripts/archive-docs.sh --candidates candidates.json --dry-run

# 3. 실행 (우선순위별)
bash docs/scripts/archive-docs.sh --candidates candidates.json --priority high

# 4. 검증
bash docs/scripts/check-sync.sh
npx lychee docs/**/*.md --offline
```

---

## 🎯 Phase 1: 후보 식별 (Candidate Discovery)

### 1.1 자동 후보 수집

```bash
# 모든 후보 수집 + JSON 리포트 생성
node docs/scripts/find-archive-candidates.mjs --output docs/.generated/archive-candidates.json
```

**수집 카테고리**:
- **versioned**: 구버전 문서 (v1.0 superseded by v2.0)
- **stale**: 60+ 일 미수정 (git history 기반)
- **orphaned**: 참조 없음 (no related_specs/related_plans)
- **duplicates**: 유사 제목
- **completed**: status = completed or archived

**출력 예시**:
```
🔢 Checking for old versions...
   Found 3 old versions

📆 Checking for stale documents (60+ days)...
   Found 12 stale documents

🔗 Checking for orphaned documents...
   Found 5 orphaned documents

📋 Checking for potential duplicates...
   Found 2 potential duplicates

✅ Checking for completed documents...
   Found 8 completed documents

═══════════════════════════════════════════════════════
📊 ARCHIVE CANDIDATES SUMMARY
═══════════════════════════════════════════════════════
Total documents scanned: 42
Total candidates found: 30

🎯 PRIORITY RECOMMENDATIONS
────────────────────────────────────────────────────────
🔴 High priority (archive now):   11 files
🟡 Medium priority (review):      10 files
🟢 Low priority (monitor):        9 files
```

### 1.2 수동 검토

```bash
# 후보 리포트 확인
cat docs/.generated/archive-candidates.json | jq '.priority.high'
```

**검토 체크리스트**:
- [ ] 문서가 정말 불필요한가?
- [ ] 다른 활성 문서에서 참조되지 않는가?
- [ ] 역사적 가치가 없는가?
- [ ] 백업이 필요한 중요 정보는 없는가?

**결정 기준**:
- **High Priority**: 즉시 아카이브 (구버전, archived 상태)
- **Medium Priority**: 검토 후 아카이브 (orphan + stale)
- **Low Priority**: 모니터링 (단순 stale)

---

## 🚀 Phase 2: 실행 (Execution)

### 2.1 Dry-Run 테스트

**항상 dry-run으로 먼저 테스트!**

```bash
# 전체 dry-run
bash docs/scripts/archive-docs.sh \
  --candidates docs/.generated/archive-candidates.json \
  --dry-run

# 특정 우선순위만 dry-run
bash docs/scripts/archive-docs.sh \
  --candidates docs/.generated/archive-candidates.json \
  --priority high \
  --dry-run
```

**출력 확인사항**:
- 이동 경로가 올바른가? (`docs/00-specs/prd/foo.md` → `docs/99-archive/specs/prd/foo.md`)
- 토읁스톤 생성 위치가 맞는가?
- Reason이 적절한가?

### 2.2 단계별 실행 (권장)

**High → Medium → Low 순서로 단계적 실행**

```bash
# Step 1: High priority (10-20개)
bash docs/scripts/archive-docs.sh \
  --candidates docs/.generated/archive-candidates.json \
  --priority high

# 검증
bash docs/scripts/check-sync.sh
git status

# Step 2: Medium priority (검토 후)
bash docs/scripts/archive-docs.sh \
  --candidates docs/.generated/archive-candidates.json \
  --priority medium

# 검증
bash docs/scripts/check-sync.sh

# Step 3: Low priority (선택적)
bash docs/scripts/archive-docs.sh \
  --candidates docs/.generated/archive-candidates.json \
  --priority low
```

### 2.3 전체 일괄 실행 (주의!)

```bash
# 모든 우선순위 한 번에 (신중히!)
bash docs/scripts/archive-docs.sh \
  --candidates docs/.generated/archive-candidates.json
```

**⚠️ 주의**: 전체 실행 전 반드시 dry-run으로 전체 검토!

---

## ✅ Phase 3: 검증 (Validation)

### 3.1 자동 검증 스크립트

```bash
# 1. 스키마 검증 (토읁스톤 포함)
node docs/scripts/validate-schema.mjs

# 2. 인덱스 재구축
node docs/scripts/build-index.mjs

# 3. 관계 검증
node docs/scripts/verify-relations.mjs

# 4. 전체 동기화 체크
bash docs/scripts/check-sync.sh --strict
```

### 3.2 리다이렉트 검증

```bash
# 리다이렉트 맵 재구축
node docs/scripts/build-redirects.mjs

# 타겟 파일 존재 확인
node -e "
const fs = require('fs');
const redirects = JSON.parse(fs.readFileSync('docs/.generated/redirects.json', 'utf-8'));
let errors = 0;
for (const r of redirects) {
  if (!fs.existsSync(r.to)) {
    console.error(\`❌ Missing: \${r.to}\`);
    errors++;
  }
}
process.exit(errors > 0 ? 1 : 0);
"
```

### 3.3 링크 무결성 검증

```bash
# Lychee로 깨진 링크 체크
npx lychee docs/**/*.md \
  --offline \
  --exclude-path docs/99-archive \
  --exclude-path node_modules

# 또는 markdown-link-check
npx markdown-link-check docs/**/*.md \
  --quiet \
  --config .markdown-link-check.json
```

### 3.4 수동 검증

```bash
# Git 상태 확인
git status

# 변경사항 검토
git diff --name-status

# 토읁스톤 샘플 확인
head -20 docs/00-specs/prd/some-archived-doc.md

# 아카이브 파일 확인
ls -la docs/99-archive/specs/prd/
```

---

## 📝 Phase 4: 커밋 및 PR (Commit & PR)

### 4.1 커밋 전 체크리스트

- [ ] 모든 검증 스크립트 통과
- [ ] `git status`로 변경사항 확인
- [ ] 토읁스톤 샘플링 검토 (5-10개)
- [ ] 아카이브 파일 위치 확인
- [ ] `.generated/` 파일 모두 생성됨

### 4.2 커밋

```bash
# 변경사항 스테이징
git add docs/

# 커밋 (Conventional Commits)
git commit -m "docs: archive obsolete documents

- Archived 11 high-priority candidates
- Created tombstones at original locations
- Auto-rewired 45 internal links
- Updated redirect map and document index

Categories:
- 3 versioned (superseded by newer versions)
- 5 stale (60+ days no update)
- 2 orphaned (no references)
- 1 duplicate

All validation checks passed."
```

### 4.3 PR 생성

```bash
# PR 생성 (gh CLI)
gh pr create \
  --title "docs: archive obsolete documents (cleanup #1)" \
  --body "## Summary

Archived 11 high-priority documents using the new tombstone + redirect system.

## Changes
- 📦 Moved 11 documents to \`99-archive/\`
- 🪦 Created tombstones at original locations
- 🔗 Auto-rewired 45 internal links
- 📊 Updated redirect map and index

## Validation
- ✅ All schema validations passed
- ✅ All redirect targets verified
- ✅ No broken internal links
- ✅ Bidirectional references intact

## Categories
- \`versioned\`: 3 files (old versions)
- \`stale\`: 5 files (60+ days)
- \`orphaned\`: 2 files (no references)
- \`duplicates\`: 1 file

## Testing
\`\`\`bash
bash docs/scripts/check-sync.sh --strict  # ✅ Passed
npx lychee docs/**/*.md --offline         # ✅ No broken links
\`\`\`

## Rollback Plan
If issues arise:
\`\`\`bash
git revert HEAD
\`\`\`

All changes are reversible through git history.
"
```

---

## 🔄 Phase 5: 상태 업데이트 (Status Update)

### 5.1 Sprint Status 업데이트

```markdown
<!-- docs/02-status/sprint-status.md -->

## Document Cleanup #1

**Date**: 2025-01-04
**Status**: ✅ Completed

### Summary
Archived 11 high-priority obsolete documents using tombstone + redirect system.

### Metrics
- Documents archived: 11
- Tombstones created: 11
- Links rewired: 45
- Categories:
  - Versioned: 3
  - Stale: 5
  - Orphaned: 2
  - Duplicates: 1

### Validation
- Schema: ✅ Passed
- Relations: ✅ Passed
- Redirects: ✅ All targets exist
- Links: ✅ No broken links

### Next Steps
- Monitor for 1 week
- Medium priority cleanup (10 candidates)
- Low priority review
```

---

## 🚨 Troubleshooting

### Issue: "Redirect target not found"

```bash
# 문제 파일 찾기
node docs/scripts/build-redirects.mjs 2>&1 | grep "not found"

# 토읁스톤의 moved_to 경로 수정
vim docs/path/to/tombstone.md

# 재검증
node docs/scripts/build-redirects.mjs
```

### Issue: "Broken internal links"

```bash
# 깨진 링크 찾기
npx lychee docs/**/*.md --offline --verbose

# 링크 재배선 강제 실행
node docs/scripts/rewire-links.mjs

# 수동 수정이 필요한 경우
vim docs/path/to/file-with-broken-link.md
```

### Issue: "Schema validation failed for tombstone"

```bash
# 토읁스톤 형식 확인
head -15 docs/path/to/tombstone.md

# 필수 필드 확인
# - type: tombstone
# - title: "Moved: ..."
# - moved_to: docs/99-archive/...
# - moved_at: YYYY-MM-DD
# - reason: "..."

# 수정 후 재검증
node docs/scripts/validate-schema.mjs
```

### Issue: "Git merge conflicts in .generated/"

```bash
# .generated/ 파일은 재생성 가능
rm -rf docs/.generated/

# 재생성
node docs/scripts/build-index.mjs
node docs/scripts/build-redirects.mjs

# 재검증
bash docs/scripts/check-sync.sh
```

---

## 🎓 Best Practices

### DO ✅
- **항상 dry-run 먼저**: 실행 전 변경사항 확인
- **단계적 실행**: High → Medium → Low 순서
- **검증 철저히**: 모든 스크립트 실행 후 검증
- **작은 배치**: 10-20개씩 아카이브 (첫 실행)
- **PR로 검토**: 팀 리뷰 후 머지
- **상태 업데이트**: sprint-status.md 기록

### DON'T ❌
- **하드 삭제 금지**: 항상 아카이브 → 토읁스톤
- **수동 이동 금지**: 스크립트 사용 (링크 재배선 자동화)
- **검증 생략 금지**: 링크 무결성 반드시 체크
- **99-archive/ 수동 편집 금지**: 아카이브 후 readonly
- **전체 일괄 실행 주의**: 첫 실행은 소량으로 테스트

### Recommended Workflow

1. **주 1회**: `find-archive-candidates.mjs` 실행
2. **High priority**: 즉시 아카이브
3. **Medium priority**: 팀 리뷰 후 아카이브
4. **Low priority**: 월 1회 검토
5. **분기별**: 99-archive/ 정리 (선택적 삭제)

---

## 📊 Metrics & KPIs

### Success Criteria
- ✅ 모든 검증 스크립트 통과
- ✅ 깨진 링크 0개
- ✅ CI 파이프라인 성공
- ✅ 토읁스톤 → 아카이브 1:1 매칭
- ✅ 리다이렉트 맵 무결성 100%

### Key Metrics
- **Total archived**: 아카이브 문서 수
- **Tombstones created**: 토읁스톤 수
- **Links rewired**: 재배선된 링크 수
- **Validation time**: 전체 검증 시간
- **PR review time**: 리뷰 소요 시간

### Quality Gates
- Schema validation: 100% pass
- Redirect targets: 100% exist
- Internal links: 0 broken
- Bidirectional refs: 100% valid

---

## 🔗 Related Documentation

- [Git-Spec Implementation Guide](./GIT_SPEC_IMPLEMENTATION_GUIDE.md)
- [README](./README.md)
- [Schema Definition](./. schema/doc.schema.json)
- [Sprint Status](./02-status/sprint-status.md)

---

**Version**: 1.0
**Last Updated**: 2025-01-04
**Owner**: Development Team
**Status**: Active
