#!/usr/bin/env node
/**
 * @file build-index.mjs
 * @description Build searchable index of all documentation
 * @usage node docs/scripts/build-index.mjs
 * @output docs/.generated/index.json
 */

import { globby } from 'globby'
import fs from 'node:fs/promises'
import path from 'node:path'
import matter from 'gray-matter'

const files = await globby([
  'docs/**/*.md',
  '!docs/**/node_modules/**',
  '!docs/.schema/**',
  '!docs/.generated/**',
  '!docs/99-archive/**'
])

const index = []

for (const filePath of files) {
  const content = await fs.readFile(filePath, 'utf-8')
  const { data: frontmatter, isEmpty } = matter(content)

  if (isEmpty) {
    continue
  }

  const item = {
    path: filePath,
    id: frontmatter.id || null,
    type: frontmatter.type || 'unknown',
    title: frontmatter.title || path.basename(filePath),
    status: frontmatter.status || null,
    owner: frontmatter.owner || null,
    created: frontmatter.created || null,
    updated: frontmatter.updated || null,

    // Relations
    related_specs: frontmatter.related_specs || [],
    related_plans: frontmatter.related_plans || [],

    // Metadata
    tags: frontmatter.tags || [],
    version: frontmatter.version || null,
  }

  index.push(item)
}

// Ensure output directory exists
await fs.mkdir('docs/.generated', { recursive: true })

// Write index
await fs.writeFile(
  'docs/.generated/index.json',
  JSON.stringify(index, null, 2),
  'utf-8'
)

console.log(`✅ Built index with ${index.length} documents`)

// Generate stats
const stats = {
  total: index.length,
  by_type: {},
  by_status: {},
  missing_ids: [],
  updated: new Date().toISOString()
}

for (const item of index) {
  // Count by type
  stats.by_type[item.type] = (stats.by_type[item.type] || 0) + 1

  // Count by status
  if (item.status) {
    stats.by_status[item.status] = (stats.by_status[item.status] || 0) + 1
  }

  // Track missing IDs (for non-guidelines)
  if (!item.id && ['prd', 'plan', 'spec', 'adr'].includes(item.type)) {
    stats.missing_ids.push(item.path)
  }
}

await fs.writeFile(
  'docs/.generated/stats.json',
  JSON.stringify(stats, null, 2),
  'utf-8'
)

console.log(`📊 Stats: ${JSON.stringify(stats.by_type)}`)

if (stats.missing_ids.length > 0) {
  console.warn(`⚠️  ${stats.missing_ids.length} documents missing IDs`)
}
