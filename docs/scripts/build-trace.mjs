#!/usr/bin/env node
/**
 * @file build-trace.mjs
 * @description Collect spec references from commits, code comments, and PRs
 * @usage node docs/scripts/build-trace.mjs
 * @output docs/.generated/trace.json
 */

import fs from 'node:fs'
import path from 'node:path'
import { execSync } from 'node:child_process'
import { globby } from 'globby'

console.log('🔍 Building Code-Spec Traceability...\n')

// Spec ID pattern: PRD-XX-0000, PLAN-XX-0000, SPEC-XX-0000, ADR-0000
const SPEC_PATTERN = /\b(PRD|PLAN|SPEC|ADR)-[A-Z]{2,4}-\d{4}\b|\bADR-\d{4}\b/g

const trace = {
  generated_at: new Date().toISOString(),
  summary: {
    total_references: 0,
    by_source: {
      commits: 0,
      code_comments: 0,
      pr_descriptions: 0
    },
    by_spec: {},
    by_spec_type: {
      PRD: 0,
      PLAN: 0,
      SPEC: 0,
      ADR: 0
    }
  },
  references: []
}

// Helper: Track spec type (C안: PLAN/ADR 동등 가중)
function trackSpecType(specId) {
  const type = specId.split('-')[0] // PRD, PLAN, SPEC, ADR
  if (trace.summary.by_spec_type[type] !== undefined) {
    trace.summary.by_spec_type[type]++
  }
}

// 1. Collect from commit messages (last 100 commits)
console.log('📝 Scanning commit messages...')
try {
  const commits = execSync('git log -100 --format=%H---%s---%b---%ad --date=iso', {
    encoding: 'utf-8'
  }).trim().split('\n')

  for (const line of commits) {
    if (!line) continue
    const [hash, subject, body, date] = line.split('---')
    const fullMessage = `${subject} ${body || ''}`
    const matches = fullMessage.match(SPEC_PATTERN)

    if (matches) {
      const uniqueSpecs = [...new Set(matches)]
      for (const specId of uniqueSpecs) {
        trace.references.push({
          spec_id: specId,
          source: 'commit',
          location: hash.substring(0, 7),
          context: subject.substring(0, 100),
          timestamp: date
        })
        trace.summary.by_source.commits++
        trace.summary.by_spec[specId] = (trace.summary.by_spec[specId] || 0) + 1
        trackSpecType(specId)
      }
    }
  }
} catch (error) {
  console.warn('⚠️  Could not read git history:', error.message)
}

console.log(`   Found ${trace.summary.by_source.commits} commit references`)

// 2. Collect from code comments
console.log('💬 Scanning code comments...')
try {
  const codeFiles = await globby([
    'src/**/*.{ts,tsx,js,jsx}',
    'packages/**/*.{ts,tsx,js,jsx}',
    '!**/node_modules/**',
    '!**/.next/**',
    '!**/dist/**'
  ])

  for (const filepath of codeFiles) {
    const content = fs.readFileSync(filepath, 'utf-8')
    const lines = content.split('\n')

    lines.forEach((line, index) => {
      // Match: // spec: PRD-XX-0000 or /* spec: PRD-XX-0000 */
      if (line.includes('spec:') || line.includes('Spec:')) {
        const matches = line.match(SPEC_PATTERN)
        if (matches) {
          const uniqueSpecs = [...new Set(matches)]
          for (const specId of uniqueSpecs) {
            trace.references.push({
              spec_id: specId,
              source: 'code_comment',
              location: `${filepath}:${index + 1}`,
              context: line.trim().substring(0, 100),
              timestamp: new Date().toISOString()
            })
            trace.summary.by_source.code_comments++
            trace.summary.by_spec[specId] = (trace.summary.by_spec[specId] || 0) + 1
            trackSpecType(specId)
          }
        }
      }
    })
  }
} catch (error) {
  console.warn('⚠️  Could not scan code files:', error.message)
}

console.log(`   Found ${trace.summary.by_source.code_comments} code comment references`)

// 3. Collect from PR descriptions (via gh CLI if available)
console.log('📋 Scanning PR descriptions...')
try {
  const prs = execSync('gh pr list --state all --limit 100 --json number,title,body,createdAt', {
    encoding: 'utf-8'
  })

  const prList = JSON.parse(prs)

  for (const pr of prList) {
    const fullText = `${pr.title} ${pr.body || ''}`
    const matches = fullText.match(SPEC_PATTERN)

    if (matches) {
      const uniqueSpecs = [...new Set(matches)]
      for (const specId of uniqueSpecs) {
        trace.references.push({
          spec_id: specId,
          source: 'pr_description',
          location: `PR #${pr.number}`,
          context: pr.title.substring(0, 100),
          timestamp: pr.createdAt
        })
        trace.summary.by_source.pr_descriptions++
        trace.summary.by_spec[specId] = (trace.summary.by_spec[specId] || 0) + 1
        trackSpecType(specId)
      }
    }
  }

  console.log(`   Found ${trace.summary.by_source.pr_descriptions} PR description references`)
} catch (error) {
  console.log('   ℹ️  gh CLI not available or no PRs found')
}

// Calculate changed-file-based spec coverage
console.log('📊 Calculating spec coverage...')

// Exclude patterns for coverage calculation (A안: 분모 정제)
const COVERAGE_IGNORES = [
  '/__tests__/',
  '.spec.',
  '.test.',
  '.stories.',
  '.d.ts',
  '.generated.',
  '/migrations/',
  '/.storybook/',
  '/scripts/',
  '/docs/scripts/'
]

let specCoverage = 0
let changedFilesTotal = 0
let changedFilesWithSpec = 0
let filesWithoutSpec = []
let excludedFiles = []

try {
  const changedFilesOutput = execSync('git diff --name-only origin/main...HEAD', {
    encoding: 'utf-8'
  }).trim()

  if (changedFilesOutput) {
    const allChangedFiles = changedFilesOutput.split('\n')
      .filter(f => f.match(/\.(ts|tsx|js|jsx)$/))

    // Apply filters (분모 정제)
    const changedFiles = allChangedFiles.filter(filepath => {
      const shouldExclude = COVERAGE_IGNORES.some(pattern => filepath.includes(pattern))
      if (shouldExclude) {
        excludedFiles.push(filepath)
      }
      return !shouldExclude
    })

    changedFilesTotal = changedFiles.length

    // Count files with spec references
    for (const filepath of changedFiles) {
      if (fs.existsSync(filepath)) {
        const content = fs.readFileSync(filepath, 'utf-8')
        if (SPEC_PATTERN.test(content)) {
          changedFilesWithSpec++
        } else {
          filesWithoutSpec.push(filepath)
        }
      }
    }

    specCoverage = changedFilesTotal > 0
      ? Math.round((changedFilesWithSpec / changedFilesTotal) * 100)
      : 0
  }

  console.log(`   Total changed: ${changedFilesOutput ? changedFilesOutput.split('\n').filter(f => f.match(/\.(ts|tsx|js|jsx)$/)).length : 0}`)
  console.log(`   Excluded: ${excludedFiles.length}`)
  console.log(`   Analyzed: ${changedFilesTotal}`)
  console.log(`   With spec: ${changedFilesWithSpec}`)
} catch (error) {
  console.log('   ℹ️  Could not calculate coverage (main branch may not exist)')
}

// Calculate total
trace.summary.total_references =
  trace.summary.by_source.commits +
  trace.summary.by_source.code_comments +
  trace.summary.by_source.pr_descriptions

// B안: 자동 제안 (spec-by-path 매핑)
let specByPath = {}
let suggestions = []
try {
  specByPath = JSON.parse(fs.readFileSync('docs/.generated/spec-by-path.json', 'utf-8'))

  // Generate suggestions for files without spec
  for (const filepath of filesWithoutSpec) {
    const matchedPrefix = Object.keys(specByPath).find(prefix => filepath.startsWith(prefix))
    if (matchedPrefix) {
      suggestions.push({
        file: filepath,
        suggested_specs: specByPath[matchedPrefix],
        reason: `Matched path prefix: ${matchedPrefix}`
      })
    }
  }
} catch (error) {
  console.log('   ℹ️  spec-by-path.json not found, suggestions disabled')
}

// Add coverage metrics to summary
trace.summary.spec_coverage = specCoverage
trace.summary.changed_files_total = changedFilesTotal
trace.summary.changed_files_with_spec = changedFilesWithSpec
trace.summary.files_without_spec = filesWithoutSpec
trace.summary.excluded_files_count = excludedFiles.length
trace.summary.excluded_samples = excludedFiles.slice(0, 5) // 검증용 샘플
trace.summary.suggestions = suggestions.slice(0, 10) // Top 10 제안

// Sort references by spec_id, then timestamp
trace.references.sort((a, b) => {
  if (a.spec_id !== b.spec_id) {
    return a.spec_id.localeCompare(b.spec_id)
  }
  return new Date(b.timestamp) - new Date(a.timestamp)
})

// Write output
const outputPath = 'docs/.generated/trace.json'
fs.writeFileSync(outputPath, JSON.stringify(trace, null, 2), 'utf-8')

console.log('')
console.log('✅ Generated traceability map:', outputPath)
console.log('')
console.log('📊 Summary:')
console.log(`   Total references: ${trace.summary.total_references}`)
console.log(`   Unique specs: ${Object.keys(trace.summary.by_spec).length}`)
console.log(`   Spec coverage: ${specCoverage}% (${changedFilesWithSpec}/${changedFilesTotal} changed files)`)
console.log('')
console.log('📖 By source:')
console.log(`   Commits: ${trace.summary.by_source.commits}`)
console.log(`   Code comments: ${trace.summary.by_source.code_comments}`)
console.log(`   PR descriptions: ${trace.summary.by_source.pr_descriptions}`)
console.log('')
console.log('📚 By spec type (C안: PLAN/ADR 동등 가중):')
console.log(`   PRD: ${trace.summary.by_spec_type.PRD}`)
console.log(`   PLAN: ${trace.summary.by_spec_type.PLAN}`)
console.log(`   SPEC: ${trace.summary.by_spec_type.SPEC}`)
console.log(`   ADR: ${trace.summary.by_spec_type.ADR}`)
console.log('')
console.log('🎯 Most referenced specs:')
const topSpecs = Object.entries(trace.summary.by_spec)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 5)

for (const [specId, count] of topSpecs) {
  console.log(`   ${specId}: ${count} references`)
}

if (suggestions.length > 0) {
  console.log('')
  console.log('💡 Spec suggestions (B안: 자동 제안):')
  console.log(`   ${suggestions.length} files need spec tags`)
  console.log(`   Run "yarn docs:trace" to see full suggestions in trace.json`)
}
