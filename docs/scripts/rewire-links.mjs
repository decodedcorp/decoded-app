#!/usr/bin/env node
/**
 * @file rewire-links.mjs
 * @description Automatically rewire internal markdown links using redirect map
 * @usage node docs/scripts/rewire-links.mjs [--dry-run] [--staged-only]
 * @output Modified markdown files with updated links
 */

import { globby } from 'globby'
import fs from 'node:fs/promises'
import path from 'node:path'
import { execSync } from 'node:child_process'

const args = process.argv.slice(2)
const DRY_RUN = args.includes('--dry-run')
const STAGED_ONLY = args.includes('--staged-only')

console.log('🔗 Rewiring internal markdown links...\n')
if (DRY_RUN) console.log('🧪 DRY RUN MODE - No files will be modified\n')

// Load redirect map
let redirects
try {
  const content = await fs.readFile('docs/.generated/redirects.json', 'utf-8')
  redirects = JSON.parse(content)
} catch (error) {
  console.error('❌ Failed to load redirects.json')
  console.error('   Run: node docs/scripts/build-redirects.mjs first')
  process.exit(1)
}

if (redirects.length === 0) {
  console.log('✅ No redirects found, nothing to do')
  process.exit(0)
}

console.log(`📋 Loaded ${redirects.length} redirects\n`)

// Build redirect lookup (from path → to path)
const redirectMap = new Map()
for (const redirect of redirects) {
  redirectMap.set(redirect.from, redirect.to)
}

// Get files to process
let files

if (STAGED_ONLY) {
  console.log('📝 Processing staged files only...\n')
  try {
    const stagedFiles = execSync('git diff --cached --name-only --diff-filter=ACMR', {
      encoding: 'utf-8'
    })
      .trim()
      .split('\n')
      .filter(f => f.endsWith('.md') && f.startsWith('docs/'))

    files = stagedFiles
  } catch (error) {
    console.error('❌ Failed to get staged files')
    process.exit(1)
  }
} else {
  files = await globby([
    'docs/**/*.md',
    '!docs/**/node_modules/**',
    '!docs/.schema/**',
    '!docs/.generated/**',
    '!docs/99-archive/**'  // Don't modify archived docs
  ])
}

console.log(`🔍 Scanning ${files.length} markdown files...\n`)

let totalReplacements = 0
let filesModified = 0

for (const filePath of files) {
  const content = await fs.readFile(filePath, 'utf-8')
  let modified = content
  let fileReplacements = 0

  // Find all markdown links: [text](path) or [text](path "title")
  // Also find reference-style links: [text][ref] and [ref]: path
  const linkPatterns = [
    // Inline links: [text](path)
    /\[([^\]]+)\]\(([^)]+)\)/g,
    // Reference-style definitions: [ref]: path
    /^\[([^\]]+)\]:\s*(.+)$/gm
  ]

  for (const pattern of linkPatterns) {
    modified = modified.replace(pattern, (match, text, linkPath) => {
      // Extract just the path part (remove title if present)
      const pathMatch = linkPath.match(/^([^\s"']+)/)
      if (!pathMatch) return match

      let targetPath = pathMatch[1]

      // Skip external links
      if (targetPath.startsWith('http://') || targetPath.startsWith('https://')) {
        return match
      }

      // Skip anchors only
      if (targetPath.startsWith('#')) {
        return match
      }

      // Handle relative paths
      let absolutePath
      if (targetPath.startsWith('./') || targetPath.startsWith('../')) {
        // Resolve relative to current file's directory
        const fileDir = path.dirname(filePath)
        absolutePath = path.normalize(path.join(fileDir, targetPath))
      } else if (targetPath.startsWith('docs/')) {
        // Already absolute from project root
        absolutePath = targetPath
      } else {
        // Assume relative to current file
        const fileDir = path.dirname(filePath)
        absolutePath = path.normalize(path.join(fileDir, targetPath))
      }

      // Check if this path is in redirect map
      if (redirectMap.has(absolutePath)) {
        const newPath = redirectMap.get(absolutePath)

        // Calculate relative path from current file to new location
        const fileDir = path.dirname(filePath)
        let relativePath = path.relative(fileDir, newPath)

        // Ensure relative path starts with ./
        if (!relativePath.startsWith('.')) {
          relativePath = './' + relativePath
        }

        // Preserve any title or anchor
        const titleMatch = linkPath.match(/\s+["'](.+)["']$/)
        const anchorMatch = linkPath.match(/#[^"'\s]+/)
        let suffix = ''
        if (anchorMatch) suffix += anchorMatch[0]
        if (titleMatch) suffix += ` "${titleMatch[1]}"`

        fileReplacements++

        // Return modified link
        if (pattern.source.startsWith('^\\[')) {
          // Reference-style: [ref]: path
          return `[${text}]: ${relativePath}${suffix}`
        } else {
          // Inline: [text](path)
          return `[${text}](${relativePath}${suffix})`
        }
      }

      return match
    })
  }

  if (fileReplacements > 0) {
    filesModified++
    totalReplacements += fileReplacements

    console.log(`✏️  ${filePath}`)
    console.log(`   Replaced ${fileReplacements} link(s)`)

    if (!DRY_RUN) {
      await fs.writeFile(filePath, modified, 'utf-8')
    }
  }
}

console.log(`\n📊 Summary:`)
console.log(`   Files scanned: ${files.length}`)
console.log(`   Files modified: ${filesModified}`)
console.log(`   Total replacements: ${totalReplacements}`)

if (DRY_RUN) {
  console.log(`\n🧪 DRY RUN - No changes were made`)
  console.log(`   Run without --dry-run to apply changes`)
} else if (totalReplacements > 0) {
  console.log(`\n✅ Links rewired successfully`)

  if (STAGED_ONLY) {
    console.log(`   Modified files are still staged`)
  } else {
    console.log(`   Run: git add docs/ && git commit -m "docs: rewire links after archive"`)
  }
} else {
  console.log(`\n✅ No links needed rewiring`)
}
