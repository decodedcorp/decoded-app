#!/usr/bin/env bash
###
# @file archive-docs.sh
# @description Batch archive documents and create tombstones with redirect automation
# @usage bash docs/scripts/archive-docs.sh [--candidates <file>] [--dry-run] [--priority high|medium|low]
# @output Archived files in 99-archive/ + tombstones at original locations
###

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Parse arguments
DRY_RUN=false
CANDIDATES_FILE=""
PRIORITY_FILTER=""

while [[ $# -gt 0 ]]; do
  case $1 in
    --candidates)
      CANDIDATES_FILE="$2"
      shift 2
      ;;
    --dry-run)
      DRY_RUN=true
      shift
      ;;
    --priority)
      PRIORITY_FILTER="$2"
      shift 2
      ;;
    *)
      echo -e "${RED}Unknown option: $1${NC}"
      exit 1
      ;;
  esac
done

echo -e "${BLUE}📦 Document Archiving System${NC}\n"

if [ "$DRY_RUN" = true ]; then
  echo -e "${YELLOW}🧪 DRY RUN MODE - No files will be modified${NC}\n"
fi

# Load candidates from JSON or run find-archive-candidates
if [ -z "$CANDIDATES_FILE" ]; then
  echo -e "${BLUE}🔍 Finding archive candidates...${NC}"
  CANDIDATES_FILE="docs/.generated/archive-candidates.json"
  node docs/scripts/find-archive-candidates.mjs --output "$CANDIDATES_FILE"
  echo ""
fi

if [ ! -f "$CANDIDATES_FILE" ]; then
  echo -e "${RED}❌ Candidates file not found: $CANDIDATES_FILE${NC}"
  exit 1
fi

# Function to create archive directory structure
create_archive_dirs() {
  local dirs=(
    "docs/99-archive/specs/prd"
    "docs/99-archive/specs/technical-specs"
    "docs/99-archive/plans"
    "docs/99-archive/analysis/decisions"
    "docs/99-archive/guidelines"
    "docs/99-archive/status"
  )

  for dir in "${dirs[@]}"; do
    if [ "$DRY_RUN" = false ]; then
      mkdir -p "$dir"
    fi
  done
}

# Function to determine archive destination
get_archive_path() {
  local original_path="$1"

  # Map original path to archive location
  if [[ "$original_path" =~ docs/00-specs/prd ]]; then
    echo "${original_path/00-specs\/prd/99-archive/specs/prd}"
  elif [[ "$original_path" =~ docs/00-specs/technical-specs ]]; then
    echo "${original_path/00-specs\/technical-specs/99-archive/specs/technical-specs}"
  elif [[ "$original_path" =~ docs/01-plans ]]; then
    echo "${original_path/01-plans/99-archive/plans}"
  elif [[ "$original_path" =~ docs/04-analysis/decisions ]]; then
    echo "${original_path/04-analysis\/decisions/99-archive/analysis/decisions}"
  elif [[ "$original_path" =~ docs/03-guidelines ]]; then
    echo "${original_path/03-guidelines/99-archive/guidelines}"
  elif [[ "$original_path" =~ docs/02-status ]]; then
    echo "${original_path/02-status/99-archive/status}"
  else
    echo "docs/99-archive/misc/$(basename "$original_path")"
  fi
}

# Function to create tombstone
create_tombstone() {
  local original_path="$1"
  local archive_path="$2"
  local reason="$3"
  local original_id="$4"
  local today=$(date +%Y-%m-%d)

  local tombstone_content="---
type: tombstone
title: \"Moved: $(basename "$original_path" .md)\"
moved_to: $archive_path
moved_at: $today
reason: \"$reason\"
original_id: \"$original_id\"
---

# Document Moved

This document has been archived.

**New location**: [$archive_path]($archive_path)

**Reason**: $reason

**Date**: $today
"

  if [ "$DRY_RUN" = false ]; then
    echo "$tombstone_content" > "$original_path"
  fi
}

# Function to extract frontmatter field
extract_frontmatter_field() {
  local file="$1"
  local field="$2"

  # Simple extraction - assumes well-formed frontmatter
  grep "^$field:" "$file" | sed "s/^$field: *[\"']*//" | sed "s/[\"']*$//" || echo ""
}

# Process candidates
echo -e "${BLUE}📋 Processing candidates from: $CANDIDATES_FILE${NC}\n"

create_archive_dirs

# Track statistics
total_processed=0
total_moved=0
total_tombstones=0

# Parse JSON and process each priority level
if [ -n "$PRIORITY_FILTER" ]; then
  echo -e "${YELLOW}🎯 Filtering for priority: $PRIORITY_FILTER${NC}\n"
fi

# Process high priority first, then medium, then low
for priority in high medium low; do
  if [ -n "$PRIORITY_FILTER" ] && [ "$priority" != "$PRIORITY_FILTER" ]; then
    continue
  fi

  echo -e "${BLUE}Processing ${priority} priority candidates...${NC}"

  # Extract paths from JSON using node
  candidates=$(node -e "
    const fs = require('fs');
    const data = JSON.parse(fs.readFileSync('$CANDIDATES_FILE', 'utf-8'));
    const priority = data.priority['$priority'] || [];
    priority.forEach(item => {
      console.log(JSON.stringify({
        path: item.path,
        reason: item.reason || 'No longer needed',
        id: item.id || ''
      }));
    });
  ")

  while IFS= read -r line; do
    if [ -z "$line" ]; then
      continue
    fi

    # Parse JSON line
    path=$(echo "$line" | node -e "
      const readline = require('readline');
      const rl = readline.createInterface({ input: process.stdin });
      rl.on('line', line => {
        try {
          const obj = JSON.parse(line);
          console.log(obj.path);
        } catch(e) {}
      });
    ")

    reason=$(echo "$line" | node -e "
      const readline = require('readline');
      const rl = readline.createInterface({ input: process.stdin });
      rl.on('line', line => {
        try {
          const obj = JSON.parse(line);
          console.log(obj.reason);
        } catch(e) {}
      });
    ")

    original_id=$(echo "$line" | node -e "
      const readline = require('readline');
      const rl = readline.createInterface({ input: process.stdin });
      rl.on('line', line => {
        try {
          const obj = JSON.parse(line);
          console.log(obj.id || '');
        } catch(e) {}
      });
    ")

    if [ -z "$path" ] || [ ! -f "$path" ]; then
      continue
    fi

    total_processed=$((total_processed + 1))

    # Get archive destination
    archive_path=$(get_archive_path "$path")
    archive_dir=$(dirname "$archive_path")

    echo -e "  ${YELLOW}📄 $path${NC}"
    echo -e "     → ${GREEN}$archive_path${NC}"
    echo -e "     Reason: $reason"

    if [ "$DRY_RUN" = false ]; then
      # Create archive directory
      mkdir -p "$archive_dir"

      # Move file to archive
      mv "$path" "$archive_path"
      total_moved=$((total_moved + 1))

      # Create tombstone at original location
      create_tombstone "$path" "$archive_path" "$reason" "$original_id"
      total_tombstones=$((total_tombstones + 1))
    fi

    echo ""
  done <<< "$candidates"
done

echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}📊 ARCHIVING SUMMARY${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
echo -e "Candidates processed: $total_processed"
echo -e "Files moved: $total_moved"
echo -e "Tombstones created: $total_tombstones"
echo ""

if [ "$DRY_RUN" = true ]; then
  echo -e "${YELLOW}🧪 DRY RUN - No changes were made${NC}"
  echo -e "   Run without --dry-run to apply changes"
  exit 0
fi

# Rebuild redirect map
echo -e "${BLUE}🔗 Rebuilding redirect map...${NC}"
yarn node docs/scripts/build-redirects.mjs

# Rewire internal links
echo -e "\n${BLUE}🔧 Rewiring internal markdown links...${NC}"
yarn node docs/scripts/rewire-links.mjs

# Rebuild index
echo -e "\n${BLUE}📑 Rebuilding document index...${NC}"
yarn node docs/scripts/build-index.mjs

echo -e "\n${GREEN}✅ Document archiving complete!${NC}"
echo -e "\n${YELLOW}Next steps:${NC}"
echo -e "  1. Review changes: ${BLUE}git status${NC}"
echo -e "  2. Validate: ${BLUE}bash docs/scripts/check-sync.sh${NC}"
echo -e "  3. Test links: ${BLUE}npx lychee docs/**/*.md${NC}"
echo -e "  4. Commit: ${BLUE}git add docs/ && git commit -m \"docs: archive obsolete documents\"${NC}"
