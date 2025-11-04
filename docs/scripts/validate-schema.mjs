#!/usr/bin/env node
/**
 * @file validate-schema.mjs
 * @description Validate all documentation frontmatter against JSON schema
 * @usage node docs/scripts/validate-schema.mjs [--fix]
 */

import { globby } from 'globby'
import fs from 'node:fs/promises'
import matter from 'gray-matter'
import Ajv from 'ajv'
import addFormats from 'ajv-formats'

const schema = JSON.parse(
  await fs.readFile(new URL('../.schema/doc.schema.json', import.meta.url), 'utf-8')
)

const ajv = new Ajv({ allErrors: true, strict: false })
addFormats(ajv)
const validate = ajv.compile(schema)

const files = await globby([
  'docs/**/*.md',
  '!docs/**/node_modules/**',
  '!docs/.schema/**',
  '!docs/.generated/**',
  '!docs/99-archive/**'
])

let totalErrors = 0
const errors = []

for (const file of files) {
  const content = await fs.readFile(file, 'utf-8')
  const { data: frontmatter, isEmpty } = matter(content)

  if (isEmpty) {
    console.warn(`⚠️  ${file}: No frontmatter found`)
    continue
  }

  const valid = validate(frontmatter)

  if (!valid) {
    totalErrors += validate.errors.length
    errors.push({
      file,
      errors: validate.errors.map(err => ({
        path: err.instancePath,
        message: err.message,
        params: err.params
      }))
    })
  }
}

if (totalErrors > 0) {
  console.error(`\n❌ Found ${totalErrors} validation errors in ${errors.length} files:\n`)

  for (const { file, errors: fileErrors } of errors) {
    console.error(`📄 ${file}`)
    for (const err of fileErrors) {
      console.error(`   ${err.path || '(root)'}: ${err.message}`)
      if (err.params) {
        console.error(`   Details: ${JSON.stringify(err.params)}`)
      }
    }
    console.error('')
  }

  process.exit(1)
} else {
  console.log(`✅ All ${files.length} documents validated successfully`)
}
