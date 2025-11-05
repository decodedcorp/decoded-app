#!/usr/bin/env node
/**
 * @file generate-sprint-status.mjs
 * @description Generate sprint status report with metrics
 * @usage node docs/scripts/generate-sprint-status.mjs
 * @output docs/02-status/sprint-status.md
 */

import fs from 'node:fs'
import path from 'node:path'
import { execSync } from 'node:child_process'

console.log('📊 Generating Sprint Status...\n')

const now = new Date()
const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
const formatDate = (date) => date.toISOString().split('T')[0]

// Load trace data
let trace = { summary: { total_references: 0, by_source: {} } }
try {
  const traceContent = fs.readFileSync('docs/.generated/trace.json', 'utf-8')
  trace = JSON.parse(traceContent)
} catch {
  console.log('ℹ️  No trace.json found, using empty data')
}

// Load index data
let index = []
let unknownCount = 0
try {
  const indexContent = fs.readFileSync('docs/.generated/index.json', 'utf-8')
  index = JSON.parse(indexContent)
  unknownCount = index.filter(doc => !doc.type || doc.type === 'unknown').length
} catch {
  console.log('ℹ️  No index.json found, using empty data')
}

// Get git metrics
console.log('📝 Collecting git metrics...')

let commitCount = 0
let contributorCount = 0
let filesChanged = 0

try {
  const commitLog = execSync(`git log --since="${formatDate(weekAgo)}" --oneline`, {
    encoding: 'utf-8'
  }).trim()
  commitCount = commitLog ? commitLog.split('\n').length : 0

  const contributors = execSync(`git log --since="${formatDate(weekAgo)}" --format=%an`, {
    encoding: 'utf-8'
  }).trim()
  contributorCount = contributors ? new Set(contributors.split('\n')).size : 0

  const diffStat = execSync(`git diff --shortstat HEAD~${commitCount} HEAD`, {
    encoding: 'utf-8'
  }).trim()
  const filesMatch = diffStat.match(/(\d+) files? changed/)
  filesChanged = filesMatch ? parseInt(filesMatch[1]) : 0
} catch (error) {
  console.warn('⚠️  Could not collect git metrics:', error.message)
}

// Get PR count (if gh available)
let openPRs = 0
let closedPRsThisWeek = 0

try {
  const prs = execSync('gh pr list --state open --json number', {
    encoding: 'utf-8'
  })
  openPRs = JSON.parse(prs).length

  const closedPRs = execSync(`gh pr list --state closed --search "closed:>${formatDate(weekAgo)}" --json number`, {
    encoding: 'utf-8'
  })
  closedPRsThisWeek = JSON.parse(closedPRs).length
} catch {
  console.log('ℹ️  gh CLI not available, PR metrics unavailable')
}

// Calculate Spec Coverage (from changed-file-based calculation in trace.json)
const specCoverage = trace.summary.spec_coverage || 0
const changedFilesTotal = trace.summary.changed_files_total || 0
const changedFilesWithSpec = trace.summary.changed_files_with_spec || 0

// Check Sync-Fail rate (run sync check)
let syncFailCount = 0
let syncTotalChecks = 0

try {
  const syncResult = execSync('bash docs/scripts/check-sync.sh', {
    encoding: 'utf-8'
  })
  // Parse sync result for failures
  const failMatches = syncResult.match(/❌/g)
  syncFailCount = failMatches ? failMatches.length : 0
  const totalMatches = syncResult.match(/Checking|Verifying/g)
  syncTotalChecks = totalMatches ? totalMatches.length : 1
} catch {
  // If script fails, that counts as sync issues
  syncFailCount = 1
  syncTotalChecks = 1
}

const syncFailRate = syncTotalChecks > 0
  ? Math.round((syncFailCount / syncTotalChecks) * 100)
  : 0

// Generate report
const lines = [
  '---',
  'type: status',
  'title: "Sprint Status Report"',
  `created: ${formatDate(now)}`,
  'owner: Documentation Team',
  'auto_generated: true',
  'generation_script: "docs/scripts/generate-sprint-status.mjs"',
  'tags: [status, sprint, metrics, weekly]',
  '---',
  '',
  '# Sprint Status Report',
  '',
  `**Generated**: ${now.toISOString()}`,
  `**Period**: ${formatDate(weekAgo)} → ${formatDate(now)} (Last 7 days)`,
  '',
  '---',
  '',
  '## 📊 Key Metrics',
  '',
  '### Documentation Health',
  '',
  `| Metric | Current | Target | Status |`,
  `|--------|---------|--------|--------|`,
  `| Unknown Docs | ${unknownCount} | ≤ 5 | ${unknownCount <= 5 ? '✅' : unknownCount <= 15 ? '⚠️' : '❌'} |`,
  `| Spec Coverage | ${specCoverage}% | ≥ 80% | ${specCoverage >= 80 ? '✅' : specCoverage >= 50 ? '⚠️' : '❌'} |`,
  `| Sync-Fail Rate | ${syncFailRate}% | ≤ 10% | ${syncFailRate <= 10 ? '✅' : syncFailRate <= 20 ? '⚠️' : '❌'} |`,
  '',
  '### Development Activity',
  '',
  `| Metric | Count |`,
  `|--------|-------|`,
  `| Commits (7d) | ${commitCount} |`,
  `| Contributors | ${contributorCount} |`,
  `| Files Changed | filesChanged} |`,
  `| Open PRs | ${openPRs} |`,
  `| PRs Merged (7d) | ${closedPRsThisWeek} |`,
  '',
  '### Code-Spec Traceability',
  '',
  `| Source | References |`,
  `|--------|------------|`,
  `| Commit Messages | ${trace.summary.by_source.commits || 0} |`,
  `| Code Comments | ${trace.summary.by_source.code_comments || 0} |`,
  `| PR Descriptions | ${trace.summary.by_source.pr_descriptions || 0} |`,
  `| **Total** | **${trace.summary.total_references}** |`,
  '',
  '---',
  '',
  '## 🎯 Sprint Goals',
  '',
  '### Current Sprint: Unknown Zero',
  '',
  `- **Goal**: Reduce unknowns from 41 → ≤5`,
  `- **Progress**: ${41 - unknownCount} / 36 (${Math.round(((41 - unknownCount) / 36) * 100)}%)`,
  `- **Status**: ${unknownCount <= 5 ? '✅ Complete' : unknownCount <= 15 ? '🔄 On Track' : '⚠️ Needs Attention'}`,
  '',
  '### Week 1 Objectives',
  '',
  `- [${unknownCount <= 25 ? 'x' : ' '}] Classify or archive 10-15 high-priority documents`,
  `- [${trace.summary.total_references > 0 ? 'x' : ' '}] Enable spec() traceability system`,
  '- [ ] Review guides and checklists',
  '- [ ] Run validation: `yarn docs:validate`',
  '',
  '### Week 2 Objectives',
  '',
  '- [ ] Process remaining unknowns (10-15)',
  '- [ ] Verify all tombstones have valid redirects',
  '- [ ] Update documentation workflows',
  '- [ ] Final validation and metrics review',
  '',
  '---',
  '',
  '## 📈 Trend Analysis',
  '',
  '### Unknown Documents',
  '',
  '```',
  'Week  | Count | Change',
  '------|-------|-------',
  `Now   | ${unknownCount}    | baseline`,
  '```',
  '',
  '### Spec Coverage',
  '',
  '```',
  'Week  | Coverage | Changed Files with spec()',
  '------|----------|---------------------------',
  `Now   | ${specCoverage}%      | ${changedFilesWithSpec}/${changedFilesTotal}`,
  '```',
  '',
  '---',
  '',
  '## 🚨 Issues & Blockers',
  '',
  unknownCount > 15
    ? '- ⚠️ **High unknown count**: ' + unknownCount + ' unknowns need classification'
    : '- ✅ Unknown count within acceptable range',
  '',
  syncFailRate > 10
    ? '- ⚠️ **Sync failures detected**: ' + syncFailRate + '% failure rate'
    : '- ✅ Sync checks passing',
  '',
  specCoverage < 50
    ? '- ⚠️ **Low spec coverage**: Only ' + specCoverage + '% of commits reference specs'
    : '- ✅ Spec coverage acceptable',
  '',
  '---',
  '',
  '## 🎯 Top 10 Files Missing Spec Tags',
  '',
  trace.summary.files_without_spec && trace.summary.files_without_spec.length > 0
    ? trace.summary.files_without_spec.slice(0, 10).map(f => `- \`${f}\``).join('\n')
    : '✅ All changed files have spec tags!',
  '',
  trace.summary.suggestions && trace.summary.suggestions.length > 0
    ? '**Suggested specs** (from spec-by-path.json):'
    : '',
  trace.summary.suggestions && trace.summary.suggestions.length > 0
    ? trace.summary.suggestions.slice(0, 5).map(s =>
        `- \`${s.file}\` → ${s.suggested_specs.join(', ')}`
      ).join('\n')
    : '',
  '',
  '---',
  '',
  '## 📝 Action Items',
  '',
  '### This Week',
  '',
  unknownCount > 5
    ? `- [ ] Classify ${Math.min(10, unknownCount)} unknown documents`
    : '',
  specCoverage < 80
    ? '- [ ] Add spec() references to recent commits'
    : '',
  '- [ ] Review and update PRD/Plan relationships',
  '- [ ] Run full validation suite',
  '',
  '### Next Week',
  '',
  '- [ ] Complete Unknown Zero Sprint',
  '- [ ] Enable automatic spec() validation in CI',
  '- [ ] Document new workflow to team',
  '',
  '---',
  '',
  '**Auto-generated by**: `docs/scripts/generate-sprint-status.mjs`',
  '',
  '**Refresh**: `yarn docs:status`',
  ''
]

// Ensure output directory exists
const outputDir = 'docs/02-status'
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true })
}

// Write output
const outputPath = path.join(outputDir, 'sprint-status.md')
fs.writeFileSync(outputPath, lines.filter(line => line !== '').join('\n'), 'utf-8')

console.log('')
console.log('✅ Generated sprint status:', outputPath)
console.log('')
console.log('📊 Key Findings:')
console.log(`   Unknown Docs: ${unknownCount} (target: ≤5)`)
console.log(`   Spec Coverage: ${specCoverage}% (target: ≥80%)`)
console.log(`   Sync-Fail Rate: ${syncFailRate}% (target: ≤10%)`)
console.log(`   Weekly Commits: ${commitCount}`)
console.log('')
console.log('📖 Next steps:')
console.log('   1. Review: cat docs/02-status/sprint-status.md')
console.log('   2. Address action items')
console.log('   3. Update weekly: yarn docs:status')
