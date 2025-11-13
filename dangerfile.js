/**
 * @file dangerfile.js
 * @description Danger.js configuration for spec coverage validation
 * @usage danger pr https://github.com/owner/repo/pull/123
 */

import { danger, warn, markdown, message } from 'danger'
import fs from 'node:fs'

// Read trace.json for spec coverage data
let trace
try {
  trace = JSON.parse(fs.readFileSync('docs/.generated/trace.json', 'utf-8'))
} catch (error) {
  warn('⚠️ Could not read trace.json - spec coverage check skipped')
  process.exit(0)
}

const { spec_coverage, changed_files_total, changed_files_with_spec, files_without_spec, suggestions } = trace.summary

// Coverage threshold warnings
if (spec_coverage < 30) {
  warn(`📊 **Spec coverage is ${spec_coverage}%** (target: ≥30%)`)
  markdown(`
### ⚠️ Low Spec Coverage Detected

Current coverage: **${spec_coverage}%** (${changed_files_with_spec}/${changed_files_total} files)

**Target**: ≥30% for this sprint

Please add spec tags to changed files using the VSCode snippet:
- Type \`spec\` + Tab → \`// spec: PRD-TG-0002\`
- Type \`specs\` + Tab → \`// spec: PRD-TG-0002, PLAN-TG-0003\`
`)
}

// List files without specs
if (files_without_spec && files_without_spec.length > 0) {
  const filesMarkdown = files_without_spec
    .slice(0, 10)
    .map(f => `- \`${f}\``)
    .join('\n')

  markdown(`
### 📝 Files Missing Spec Tags (${files_without_spec.length} total)

${filesMarkdown}

${files_without_spec.length > 10 ? `\n_...and ${files_without_spec.length - 10} more files_` : ''}
`)
}

// Show suggestions if available
if (suggestions && suggestions.length > 0) {
  const suggestionsMarkdown = suggestions
    .slice(0, 5)
    .map(s => `- \`${s.file}\`\n  → Suggested: ${s.suggested_specs.join(', ')}`)
    .join('\n')

  markdown(`
### 💡 Suggested Spec Tags

${suggestionsMarkdown}

${suggestions.length > 5 ? `\n_...and ${suggestions.length - 5} more suggestions in trace.json_` : ''}
`)
}

// Success message if coverage is good
if (spec_coverage >= 30) {
  message(`✅ Spec coverage: ${spec_coverage}% - Great work!`)
}

// Show spec type distribution (PRD/PLAN/ADR balance)
const { by_spec_type } = trace.summary
const totalRefs = by_spec_type.PRD + by_spec_type.PLAN + by_spec_type.SPEC + by_spec_type.ADR

if (totalRefs > 0) {
  markdown(`
### 📚 Spec Type Distribution

| Type | Count | Percentage |
|------|-------|------------|
| PRD  | ${by_spec_type.PRD} | ${Math.round((by_spec_type.PRD / totalRefs) * 100)}% |
| PLAN | ${by_spec_type.PLAN} | ${Math.round((by_spec_type.PLAN / totalRefs) * 100)}% |
| SPEC | ${by_spec_type.SPEC} | ${Math.round((by_spec_type.SPEC / totalRefs) * 100)}% |
| ADR  | ${by_spec_type.ADR} | ${Math.round((by_spec_type.ADR / totalRefs) * 100)}% |

${by_spec_type.PLAN === 0 && by_spec_type.ADR === 0 ?
  '⚠️ Consider using PLAN and ADR tags alongside PRD for better traceability' : ''}
`)
}
