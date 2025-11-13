#!/usr/bin/env bash

set -e

SPEC_ID="$1"

if [ -z "$SPEC_ID" ]; then
  echo "Usage: scripts/run-spec-workflow.sh FEATURE-id"
  exit 1
fi

SPEC_FILE="specs/feature/${SPEC_ID}.yml"

if [ ! -f "$SPEC_FILE" ]; then
  echo "Spec file not found: $SPEC_FILE"
  exit 1
fi

echo "Using spec: $SPEC_FILE"
echo "----------------------------------------"

# 1) Show spec content
cat "$SPEC_FILE"

echo ""
echo "----------------------------------------"
echo "Now starting Codex session for this spec..."
echo "You can ask Codex to implement or refactor code based on this spec."

codex <<EOF
You are working in a spec-driven development workflow.

Spec file:
$SPEC_FILE

Steps:
1. Read and summarize the spec.
2. Propose an implementation or refactor plan, referencing concrete file paths.
3. Wait for my approval before any file modifications.
4. After changes, run the 'test' script if defined in the project config.
EOF

