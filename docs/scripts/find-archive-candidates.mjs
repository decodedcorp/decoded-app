#!/usr/bin/env node
/**
 * @file find-archive-candidates.mjs
 * @description Find documents that are candidates for archiving
 * @usage node docs/scripts/find-archive-candidates.mjs [--output <file>]
 * @output Console output + optional JSON file
 */

import { globby } from 'globby'
import fs from 'node:fs/promises'
import matter from 'gray-matter'
import { execSync } from 'node:child_process'

const args = process.argv.slice(2)
const outputIndex = args.indexOf('--output')
const OUTPUT_FILE = outputIndex >= 0 ? args[outputIndex + 1] : null

console.log('🔍 Finding archive candidates...\n')

// Load index for relationship analysis
let index
try {
  const content = await fs.readFile('docs/.generated/index.json', 'utf-8')
  index = JSON.parse(content)
} catch (error) {
  console.error('❌ Failed to load index.json')
  console.error('   Run: node docs/scripts/build-index.mjs first')
  process.exit(1)
}

const candidates = {
  versioned: [],        // Files with version numbers (old versions)
  stale: [],            // Not updated in 60+ days
  orphaned: [],         // No related_specs/related_plans
  duplicates: [],       // Similar titles/content
  completed: []         // Status = completed or archived
}

const stats = {
  total_docs: index.length,
  total_candidates: 0,
  by_type: {}
}

// Get git last modified dates
const gitDates = new Map()
try {
  const files = await globby(['docs/**/*.md', '!docs/**/node_modules/**'])

  for (const file of files) {
    try {
      const date = execSync(`git log -1 --format=%cs -- "${file}"`, {
        encoding: 'utf-8'
      }).trim()
      if (date) {
        gitDates.set(file, date)
      }
    } catch (err) {
      // File not in git yet, skip
    }
  }
} catch (error) {
  console.warn('⚠️  Git history not available, skipping stale check')
}

// Today's date for comparison
const today = new Date()
const sixtyDaysAgo = new Date(today)
sixtyDaysAgo.setDate(today.getDate() - 60)
const cutoffDate = sixtyDaysAgo.toISOString().split('T')[0]

console.log(`📅 Stale cutoff date: ${cutoffDate}\n`)

// 1. Find versioned documents
console.log('🔢 Checking for old versions...')
for (const doc of index) {
  // Skip archived docs
  if (doc.path.includes('/99-archive/') || doc.path.includes('/archive/')) {
    continue
  }

  // Check for version patterns in filename or frontmatter
  const hasVersionInPath = /v\d+\.\d+/.test(doc.path)
  const hasVersionInFrontmatter = doc.version && doc.version !== '1.0'

  if (hasVersionInPath || hasVersionInFrontmatter) {
    // Check if this is NOT the latest version
    // (Heuristic: if there's a v2.0 and this is v1.0, it's old)
    if (!doc.title || typeof doc.title !== 'string') continue
    const baseTitle = doc.title.replace(/v?\d+\.\d+.*/, '').trim()

    // Find newer versions
    const newerVersions = index.filter(other => {
      if (other.path === doc.path) return false
      if (!other.title || typeof other.title !== 'string') return false
      const otherTitle = other.title.replace(/v?\d+\.\d+.*/, '').trim()

      if (baseTitle === otherTitle) {
        const thisVersion = parseFloat(doc.version || '1.0')
        const otherVersion = parseFloat(other.version || '1.0')
        return otherVersion > thisVersion
      }
      return false
    })

    if (newerVersions.length > 0) {
      candidates.versioned.push({
        ...doc,
        reason: `Superseded by ${newerVersions.map(v => v.version || v.path).join(', ')}`,
        newer_versions: newerVersions.map(v => v.path)
      })
    }
  }
}
console.log(`   Found ${candidates.versioned.length} old versions\n`)

// 2. Find stale documents (60+ days no update)
console.log('📆 Checking for stale documents (60+ days)...')
for (const doc of index) {
  if (doc.path.includes('/99-archive/')) continue
  if (doc.type === 'tombstone') continue

  const lastModified = gitDates.get(doc.path) || doc.updated
  if (lastModified && lastModified < cutoffDate) {
    // Don't mark as stale if it's a guideline or if status is active
    if (doc.type === 'guideline' || doc.status === 'active') {
      continue
    }

    candidates.stale.push({
      ...doc,
      last_modified: lastModified,
      days_since_update: Math.floor((today - new Date(lastModified)) / (1000 * 60 * 60 * 24)),
      reason: `No updates in ${Math.floor((today - new Date(lastModified)) / (1000 * 60 * 60 * 24))} days`
    })
  }
}
console.log(`   Found ${candidates.stale.length} stale documents\n`)

// 3. Find orphaned documents (no relationships)
console.log('🔗 Checking for orphaned documents...')
for (const doc of index) {
  if (doc.path.includes('/99-archive/')) continue
  if (doc.type === 'tombstone') continue
  if (doc.type === 'guideline' || doc.type === 'status') continue // Guidelines don't need relations

  const hasRelations =
    (doc.related_specs && doc.related_specs.length > 0) ||
    (doc.related_plans && doc.related_plans.length > 0)

  if (!hasRelations && ['prd', 'plan', 'spec', 'adr'].includes(doc.type)) {
    candidates.orphaned.push({
      ...doc,
      reason: `No related_specs or related_plans`
    })
  }
}
console.log(`   Found ${candidates.orphaned.length} orphaned documents\n`)

// 4. Find completed/archived documents
console.log('✅ Checking for completed documents...')
for (const doc of index) {
  if (doc.path.includes('/99-archive/')) continue
  if (doc.status === 'completed' || doc.status === 'archived') {
    candidates.completed.push({
      ...doc,
      reason: `Status: ${doc.status}`
    })
  }
}
console.log(`   Found ${candidates.completed.length} completed documents\n`)

// 5. Find potential duplicates (simple title similarity)
console.log('🔍 Checking for potential duplicates...')
const titleMap = new Map()
for (const doc of index) {
  if (doc.path.includes('/99-archive/')) continue
  if (doc.type === 'tombstone') continue
  if (!doc.title || typeof doc.title !== 'string') continue

  const normalizedTitle = doc.title.toLowerCase()
    .replace(/v?\d+\.\d+/g, '')
    .replace(/[^\w\s]/g, '')
    .trim()

  if (titleMap.has(normalizedTitle)) {
    const existing = titleMap.get(normalizedTitle)
    candidates.duplicates.push({
      ...doc,
      reason: `Similar title to ${existing.path}`,
      similar_to: existing.path
    })
  } else {
    titleMap.set(normalizedTitle, doc)
  }
}
console.log(`   Found ${candidates.duplicates.length} potential duplicates\n`)

// Calculate totals
for (const category of Object.keys(candidates)) {
  stats.total_candidates += candidates[category].length
  stats.by_type[category] = candidates[category].length
}

// Report
console.log('═'.repeat(60))
console.log('📊 ARCHIVE CANDIDATES SUMMARY')
console.log('═'.repeat(60))
console.log(`Total documents scanned: ${stats.total_docs}`)
console.log(`Total candidates found: ${stats.total_candidates}`)
console.log('')
console.log('By category:')
console.log(`  📦 Versioned (old):       ${stats.by_type.versioned || 0}`)
console.log(`  📆 Stale (60+ days):      ${stats.by_type.stale || 0}`)
console.log(`  🔗 Orphaned (no links):   ${stats.by_type.orphaned || 0}`)
console.log(`  📋 Duplicates:            ${stats.by_type.duplicates || 0}`)
console.log(`  ✅ Completed:             ${stats.by_type.completed || 0}`)
console.log('')

// Priority recommendations
const highPriority = [
  ...candidates.versioned,
  ...candidates.completed.filter(d => d.status === 'archived')
]

const mediumPriority = [
  ...candidates.orphaned.filter(d =>
    candidates.stale.some(s => s.path === d.path)
  ),
  ...candidates.duplicates
]

const lowPriority = [
  ...candidates.stale.filter(d =>
    !highPriority.some(h => h.path === d.path) &&
    !mediumPriority.some(m => m.path === d.path)
  )
]

console.log('🎯 PRIORITY RECOMMENDATIONS')
console.log('─'.repeat(60))
console.log(`🔴 High priority (archive now):   ${highPriority.length} files`)
console.log(`🟡 Medium priority (review):      ${mediumPriority.length} files`)
console.log(`🟢 Low priority (monitor):        ${lowPriority.length} files`)
console.log('')

// Output detailed lists
if (highPriority.length > 0) {
  console.log('🔴 HIGH PRIORITY:')
  for (const doc of highPriority.slice(0, 10)) {
    console.log(`   - ${doc.path}`)
    console.log(`     Reason: ${doc.reason}`)
  }
  if (highPriority.length > 10) {
    console.log(`   ... and ${highPriority.length - 10} more`)
  }
  console.log('')
}

// Save to file if requested
if (OUTPUT_FILE) {
  const output = {
    generated_at: new Date().toISOString(),
    stats,
    priority: {
      high: highPriority,
      medium: mediumPriority,
      low: lowPriority
    },
    all_candidates: candidates
  }

  await fs.writeFile(OUTPUT_FILE, JSON.stringify(output, null, 2), 'utf-8')
  console.log(`💾 Saved detailed report to: ${OUTPUT_FILE}`)
}

console.log('')
console.log('📝 Next steps:')
console.log('   1. Review high priority candidates')
console.log('   2. Run: bash docs/scripts/archive-docs.sh --candidates <this-output>')
console.log('   3. Or manually move files to docs/99-archive/')
