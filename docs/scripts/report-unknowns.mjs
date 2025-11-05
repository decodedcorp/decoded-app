#!/usr/bin/env node
/**
 * @file report-unknowns.mjs
 * @description Generate report for documents without proper type classification
 * @usage node docs/scripts/report-unknowns.mjs
 * @output docs/.generated/unknowns.md
 */

import fs from 'node:fs'
import path from 'node:path'
import { execSync } from 'node:child_process'

console.log('📊 Generating Unknowns Report...\n')

// Load index
let index
try {
  const content = fs.readFileSync('docs/.generated/index.json', 'utf-8')
  index = JSON.parse(content)
} catch (error) {
  console.error('❌ Failed to load index.json')
  console.error('   Run: node docs/scripts/build-index.mjs first')
  process.exit(1)
}

// Filter unknown documents
const unknowns = index.filter(doc => !doc.type || doc.type === 'unknown')

// Categorize unknowns
const categories = {
  guides: [],
  checklists: [],
  templates: [],
  analysis: [],
  others: []
}

for (const doc of unknowns) {
  const filename = path.basename(doc.path).toLowerCase()
  const dirpath = path.dirname(doc.path).toLowerCase()

  if (filename.includes('guide') || filename.includes('tutorial')) {
    categories.guides.push(doc)
  } else if (filename.includes('checklist') || filename.includes('template')) {
    categories.checklists.push(doc)
  } else if (dirpath.includes('analysis') || filename.includes('analysis')) {
    categories.analysis.push(doc)
  } else if (filename.includes('template')) {
    categories.templates.push(doc)
  } else {
    categories.others.push(doc)
  }
}

// Calculate git age for sorting
const getGitAge = (filepath) => {
  try {
    const date = execSync(`git log -1 --format=%ct -- "${filepath}"`, {
      encoding: 'utf-8'
    }).trim()
    return date ? parseInt(date) : 0
  } catch {
    return 0
  }
}

// Generate report
const lines = [
  '# Unknown Documents Report',
  '',
  `**Generated**: ${new Date().toISOString()}`,
  `**Total unknowns**: ${unknowns.length}`,
  '',
  '## Summary by Category',
  '',
  `- 📖 **Guides**: ${categories.guides.length}`,
  `- ✅ **Checklists**: ${categories.checklists.length}`,
  `- 🔬 **Analysis**: ${categories.analysis.length}`,
  `- 📋 **Templates**: ${categories.templates.length}`,
  `- 📄 **Others**: ${categories.others.length}`,
  '',
  '## Recommended Actions',
  '',
  '### High Priority (Archive or Classify)',
  ''
]

// Add high-priority recommendations
const highPriority = unknowns.filter(doc => {
  const name = path.basename(doc.path).toLowerCase()
  return name.includes('old') ||
         name.includes('backup') ||
         name.includes('temp') ||
         name.includes('draft') ||
         name.includes('wip')
})

if (highPriority.length > 0) {
  lines.push('These documents should be archived or properly classified:')
  lines.push('')
  for (const doc of highPriority) {
    lines.push(`- [ ] \`${doc.path}\``)
    lines.push(`  - Reason: Temporary or outdated filename pattern`)
    lines.push('')
  }
} else {
  lines.push('No obvious temporary/outdated documents found.')
  lines.push('')
}

// Detailed breakdown by category
lines.push('---')
lines.push('')
lines.push('## Detailed Breakdown')
lines.push('')

for (const [category, docs] of Object.entries(categories)) {
  if (docs.length === 0) continue

  const emoji = {
    guides: '📖',
    checklists: '✅',
    analysis: '🔬',
    templates: '📋',
    others: '📄'
  }[category]

  lines.push(`### ${emoji} ${category.charAt(0).toUpperCase() + category.slice(1)} (${docs.length})`)
  lines.push('')

  for (const doc of docs) {
    lines.push(`- [ ] \`${doc.path}\``)

    // Suggest classification
    if (category === 'guides') {
      lines.push(`  - **Suggested**: \`type: guideline\``)
    } else if (category === 'checklists') {
      lines.push(`  - **Suggested**: \`type: note\` or archive if obsolete`)
    } else if (category === 'analysis') {
      lines.push(`  - **Suggested**: \`type: research\` or \`type: adr\``)
    } else if (category === 'templates') {
      lines.push(`  - **Suggested**: Keep as template or add \`type: guideline\``)
    } else {
      lines.push(`  - **Suggested**: \`type: note\` or review for archival`)
    }
    lines.push('')
  }
}

// Add classification instructions
lines.push('---')
lines.push('')
lines.push('## How to Classify')
lines.push('')
lines.push('### Option 1: Add Frontmatter')
lines.push('')
lines.push('```yaml')
lines.push('---')
lines.push('type: note  # or memo, research, guideline')
lines.push('title: "Document Title"')
lines.push('created: 2025-11-04')
lines.push('owner: Your Name')
lines.push('status: active  # or draft, archived')
lines.push('tags: []')
lines.push('---')
lines.push('```')
lines.push('')
lines.push('### Option 2: Archive')
lines.push('')
lines.push('```bash')
lines.push('# Move to archive')
lines.push('mv docs/path/to/file.md docs/99-archive/misc/')
lines.push('')
lines.push('# Create tombstone (optional)')
lines.push('echo "---')
lines.push('type: tombstone')
lines.push('moved_to: docs/99-archive/misc/file.md')
lines.push('moved_at: 2025-11-04')
lines.push('reason: No longer needed')
lines.push('---" > docs/path/to/file.md')
lines.push('```')
lines.push('')
lines.push('### Option 3: Delete (if truly unnecessary)')
lines.push('')
lines.push('```bash')
lines.push('git rm docs/path/to/file.md')
lines.push('```')
lines.push('')
lines.push('---')
lines.push('')
lines.push('## Sprint Goal')
lines.push('')
lines.push(`**Target**: Reduce unknowns from ${unknowns.length} → ≤5 within 2 weeks`)
lines.push('')
lines.push('### Week 1')
lines.push('- [ ] Classify or archive high-priority documents (10-15)')
lines.push('- [ ] Review guides and checklists (5-10)')
lines.push('- [ ] Run validation: `yarn docs:validate`')
lines.push('')
lines.push('### Week 2')
lines.push('- [ ] Process remaining unknowns (10-15)')
lines.push('- [ ] Verify all tombstones have valid redirects')
lines.push('- [ ] Update sprint-status.md with progress')
lines.push('')
lines.push('---')
lines.push('')
lines.push('**Generated by**: `docs/scripts/report-unknowns.mjs`')
lines.push('')
lines.push('**Refresh**: `yarn docs:unknowns`')

// Write report
const outputPath = 'docs/.generated/unknowns.md'
fs.writeFileSync(outputPath, lines.join('\n'), 'utf-8')

console.log(`✅ Generated unknowns report: ${outputPath}`)
console.log('')
console.log('📊 Summary:')
console.log(`   Total unknowns: ${unknowns.length}`)
console.log(`   High priority: ${highPriority.length}`)
console.log('')
console.log('📖 Next steps:')
console.log('   1. Review: cat docs/.generated/unknowns.md')
console.log('   2. Classify: Add frontmatter or archive')
console.log('   3. Validate: yarn docs:validate')
