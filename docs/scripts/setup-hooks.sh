#!/usr/bin/env bash
set -euo pipefail

#
# setup-hooks.sh
# Install git hooks using Husky
# Usage: ./docs/scripts/setup-hooks.sh
#

echo "🪝 Setting up Git hooks with Husky..."

# Check if husky is installed
if ! command -v npx &> /dev/null; then
  echo "❌ npx not found. Please install Node.js first."
  exit 1
fi

# Install husky
echo "📦 Installing Husky..."
pnpm add -D husky @commitlint/cli @commitlint/config-conventional

# Initialize husky
echo "🔧 Initializing Husky..."
npx husky init

# Create commit-msg hook
cat > .husky/commit-msg << 'EOF'
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

# Commitlint check
npx --no-install commitlint --edit "$1"

# Spec reference hint (non-blocking)
commit_msg=$(cat "$1")
changed_specs=$(git diff --cached --name-only | grep -E '^docs/00-specs/' || true)

if [ -n "$changed_specs" ]; then
  if ! echo "$commit_msg" | grep -Eq 'spec\((PRD|PLAN|SPEC|ADR)-[A-Z]{0,4}-?[0-9]{3,4}\)'; then
    echo ""
    echo "⚠️  You modified spec files but didn't reference them in commit message"
    echo "   Consider adding: spec(PRD-XX-0000) to track spec changes"
    echo ""
    echo "   Changed specs:"
    echo "$changed_specs" | sed 's/^/     - /'
    echo ""
  fi
fi
EOF

chmod +x .husky/commit-msg

# Create pre-commit hook
cat > .husky/pre-commit << 'EOF'
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

# Run ESLint on staged files
echo "🔍 Running ESLint on staged files..."
pnpm lint-staged

# Check for documentation changes
docs_changed=$(git diff --cached --name-only | grep -E '^docs/.*\.md$' || true)

if [ -n "$docs_changed" ]; then
  echo ""
  echo "📚 Documentation files changed, running sync checks..."

  # Build index (always run if docs changed)
  node docs/scripts/build-index.mjs

  # Stage generated files
  git add docs/.generated/index.json docs/.generated/stats.json 2>/dev/null || true

  echo "   ✅ Documentation index updated"
fi
EOF

chmod +x .husky/pre-commit

# Create commitlint config
cat > commitlint.config.js << 'EOF'
export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'fix',
        'docs',
        'style',
        'refactor',
        'perf',
        'test',
        'build',
        'ci',
        'chore',
        'revert'
      ]
    ],
    'scope-enum': [
      1, // warn only
      'always',
      [
        'grid',
        'auth',
        'channels',
        'content',
        'design-system',
        'mobile',
        'performance',
        'deps',
        'docs'
      ]
    ],
    'subject-case': [0], // allow any case
    'header-max-length': [2, 'always', 100]
  }
}
EOF

# Update package.json scripts
echo ""
echo "📝 Adding package.json scripts..."
echo ""
echo "Add these to your package.json scripts section:"
echo ""
cat << 'EOF'
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
EOF

echo ""
echo "✅ Git hooks installed successfully!"
echo ""
echo "📋 What's configured:"
echo "   - commit-msg: Conventional Commits validation + spec reference hints"
echo "   - pre-commit: ESLint + documentation index auto-update"
echo ""
echo "🧪 Test your setup:"
echo "   1. Make a change to a doc file"
echo "   2. Commit with: git commit -m 'docs: update PRD'"
echo "   3. You should see validation and index update"
echo ""
echo "💡 To skip hooks (emergency only): git commit --no-verify"
