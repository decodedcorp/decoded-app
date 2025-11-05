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
    by_spec: {}
  },
  references: []
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
      }
    }
  }

  console.log(`   Found ${trace.summary.by_source.pr_descriptions} PR description references`)
} catch (error) {
  console.log('   ℹ️  gh CLI not available or no PRs found')
}

// Calculate total
trace.summary.total_references =
  trace.summary.by_source.commits +
  trace.summary.by_source.code_comments +
  trace.summary.by_source.pr_descriptions

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
console.log('')
console.log('📖 By source:')
console.log(`   Commits: ${trace.summary.by_source.commits}`)
console.log(`   Code comments: ${trace.summary.by_source.code_comments}`)
console.log(`   PR descriptions: ${trace.summary.by_source.pr_descriptions}`)
console.log('')
console.log('🎯 Most referenced specs:')
const topSpecs = Object.entries(trace.summary.by_spec)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 5)

for (const [specId, count] of topSpecs) {
  console.log(`   ${specId}: ${count} references`)
}
