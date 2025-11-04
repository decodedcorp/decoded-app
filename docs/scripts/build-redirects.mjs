#!/usr/bin/env node
/**
 * @file build-redirects.mjs
 * @description Scan tombstone files and build redirect map
 * @usage node docs/scripts/build-redirects.mjs
 * @output docs/.generated/redirects.json
 */

import { globby } from 'globby'
import fs from 'node:fs/promises'
import matter from 'gray-matter'
import path from 'node:path'

console.log('🔍 Scanning for tombstone files...\n')

// Find all markdown files
const files = await globby([
  'docs/**/*.md',
  '!docs/**/node_modules/**',
  '!docs/.schema/**',
  '!docs/.generated/**'
])

const redirects = []
let tombstoneCount = 0

for (const filePath of files) {
  const content = await fs.readFile(filePath, 'utf-8')
  const { data: frontmatter, isEmpty } = matter(content)

  if (isEmpty || frontmatter.type !== 'tombstone') {
    continue
  }

  tombstoneCount++

  // Validate tombstone structure
  if (!frontmatter.moved_to) {
    console.warn(`⚠️  ${filePath}: Missing 'moved_to' field`)
    continue
  }

  // Normalize paths (relative to project root)
  const from = filePath
  const to = frontmatter.moved_to.startsWith('docs/')
    ? frontmatter.moved_to
    : path.join('docs', frontmatter.moved_to)

  redirects.push({
    from,
    to,
    moved_at: frontmatter.moved_at || null,
    reason: frontmatter.reason || 'Document moved',
    original_id: frontmatter.original_id || null
  })

  console.log(`📌 ${path.basename(from)} → ${path.basename(to)}`)
  console.log(`   Reason: ${frontmatter.reason}`)
  console.log('')
}

// Ensure output directory exists
await fs.mkdir('docs/.generated', { recursive: true })

// Write redirect map
await fs.writeFile(
  'docs/.generated/redirects.json',
  JSON.stringify(redirects, null, 2),
  'utf-8'
)

console.log(`✅ Built redirect map with ${redirects.length} redirects from ${tombstoneCount} tombstones`)
console.log(`📄 Output: docs/.generated/redirects.json`)

// Generate stats
const stats = {
  total_tombstones: tombstoneCount,
  total_redirects: redirects.length,
  by_reason: {},
  updated: new Date().toISOString()
}

for (const redirect of redirects) {
  const reason = redirect.reason
  stats.by_reason[reason] = (stats.by_reason[reason] || 0) + 1
}

await fs.writeFile(
  'docs/.generated/redirect-stats.json',
  JSON.stringify(stats, null, 2),
  'utf-8'
)

console.log(`\n📊 Stats:`)
for (const [reason, count] of Object.entries(stats.by_reason)) {
  console.log(`   - "${reason}": ${count}`)
}

// Validation: Check if target files exist
let missingCount = 0
for (const redirect of redirects) {
  try {
    await fs.access(redirect.to)
  } catch (error) {
    console.error(`\n❌ Redirect target not found: ${redirect.to}`)
    console.error(`   From: ${redirect.from}`)
    missingCount++
  }
}

if (missingCount > 0) {
  console.error(`\n⚠️  ${missingCount} redirect targets are missing`)
  console.error(`   Fix tombstone 'moved_to' paths or restore missing files`)
  process.exit(1)
}

console.log(`\n✅ All redirect targets verified`)
