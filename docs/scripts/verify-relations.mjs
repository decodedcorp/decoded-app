#!/usr/bin/env node
/**
 * @file verify-relations.mjs
 * @description Verify bidirectional links between PRDs, Plans, and Specs
 * @usage node docs/scripts/verify-relations.mjs
 */

import fs from 'node:fs/promises'

const indexPath = 'docs/.generated/index.json'

// Read index
let index
try {
  const content = await fs.readFile(indexPath, 'utf-8')
  index = JSON.parse(content)
} catch (error) {
  console.error(`❌ Failed to read index: ${indexPath}`)
  console.error(`   Run: node docs/scripts/build-index.mjs first`)
  process.exit(1)
}

// Build lookup maps
const byId = new Map()
const errors = []

for (const doc of index) {
  if (doc.id) {
    byId.set(doc.id, doc)
  }
}

console.log(`🔍 Verifying relations for ${byId.size} documents with IDs...\n`)

// Verify bidirectional links
for (const doc of index) {
  if (!doc.id) continue

  // PRD → Plan verification
  if (doc.type === 'prd' && doc.related_plans?.length > 0) {
    for (const planId of doc.related_plans) {
      const plan = byId.get(planId)

      if (!plan) {
        errors.push({
          type: 'broken_link',
          from: doc.id,
          to: planId,
          message: `PRD ${doc.id} references non-existent Plan ${planId}`,
          file: doc.path
        })
        continue
      }

      if (!plan.related_specs?.includes(doc.id)) {
        errors.push({
          type: 'missing_backlink',
          from: doc.id,
          to: planId,
          message: `Plan ${planId} should reference PRD ${doc.id}`,
          file: plan.path,
          suggestion: `Add "${doc.id}" to related_specs in ${plan.path}`
        })
      }
    }
  }

  // Plan → PRD/Spec verification
  if (doc.type === 'plan' && doc.related_specs?.length > 0) {
    for (const specId of doc.related_specs) {
      const spec = byId.get(specId)

      if (!spec) {
        errors.push({
          type: 'broken_link',
          from: doc.id,
          to: specId,
          message: `Plan ${doc.id} references non-existent Spec ${specId}`,
          file: doc.path
        })
        continue
      }

      // PRD should have this plan in related_plans
      if (spec.type === 'prd' && !spec.related_plans?.includes(doc.id)) {
        errors.push({
          type: 'missing_backlink',
          from: doc.id,
          to: specId,
          message: `PRD ${specId} should reference Plan ${doc.id}`,
          file: spec.path,
          suggestion: `Add "${doc.id}" to related_plans in ${spec.path}`
        })
      }
    }
  }

  // ADR → Spec verification
  if (doc.type === 'adr' && doc.related_specs?.length > 0) {
    for (const specId of doc.related_specs) {
      if (!byId.has(specId)) {
        errors.push({
          type: 'broken_link',
          from: doc.id,
          to: specId,
          message: `ADR ${doc.id} references non-existent Spec ${specId}`,
          file: doc.path
        })
      }
    }
  }
}

// Report errors
if (errors.length === 0) {
  console.log(`✅ All ${byId.size} documents have valid bidirectional links`)
  process.exit(0)
}

console.error(`\n❌ Found ${errors.length} relation errors:\n`)

const byType = {}
for (const error of errors) {
  byType[error.type] = byType[error.type] || []
  byType[error.type].push(error)
}

for (const [type, typeErrors] of Object.entries(byType)) {
  console.error(`📌 ${type.toUpperCase().replace('_', ' ')} (${typeErrors.length}):`)

  for (const error of typeErrors) {
    console.error(`\n   ${error.message}`)
    console.error(`   📄 ${error.file}`)
    if (error.suggestion) {
      console.error(`   💡 ${error.suggestion}`)
    }
  }
  console.error('')
}

// Helpful summary
console.error(`\n📊 Summary:`)
console.error(`   Total errors: ${errors.length}`)
console.error(`   Broken links: ${byType.broken_link?.length || 0}`)
console.error(`   Missing backlinks: ${byType.missing_backlink?.length || 0}`)
console.error(`\n💡 To fix: Update frontmatter in affected files with suggested changes\n`)

process.exit(1)
