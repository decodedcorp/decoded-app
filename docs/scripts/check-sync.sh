#!/usr/bin/env bash
set -euo pipefail

#
# check-sync.sh
# Complete documentation synchronization check
# Usage: ./docs/scripts/check-sync.sh [--strict]
#

STRICT_MODE=false
if [[ "${1:-}" == "--strict" ]]; then
  STRICT_MODE=true
fi

echo "🔍 Running documentation sync checks..."
echo ""

EXIT_CODE=0

# 1. Validate frontmatter schema
echo "📐 Step 1/3: Validating frontmatter schema..."
if node docs/scripts/validate-schema.mjs; then
  echo "   ✅ Schema validation passed"
else
  echo "   ❌ Schema validation failed"
  EXIT_CODE=1
fi
echo ""

# 2. Build index
echo "📚 Step 2/3: Building documentation index..."
if node docs/scripts/build-index.mjs; then
  echo "   ✅ Index built successfully"
else
  echo "   ❌ Index build failed"
  EXIT_CODE=1
fi
echo ""

# 3. Verify bidirectional links
echo "🔗 Step 3/3: Verifying bidirectional links..."
if node docs/scripts/verify-relations.mjs; then
  echo "   ✅ All relations verified"
else
  echo "   ❌ Relation verification failed"
  if $STRICT_MODE; then
    EXIT_CODE=1
  else
    echo "   ⚠️  Non-strict mode: treating as warning"
  fi
fi
echo ""

# Summary
if [[ $EXIT_CODE -eq 0 ]]; then
  echo "✅ All sync checks passed"
else
  echo "❌ Some checks failed (exit code: $EXIT_CODE)"
  echo ""
  echo "💡 To fix:"
  echo "   - Review error messages above"
  echo "   - Update document frontmatter"
  echo "   - Ensure all referenced IDs exist"
  echo "   - Add missing backlinks"
fi

exit $EXIT_CODE
