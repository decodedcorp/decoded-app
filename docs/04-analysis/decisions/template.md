---
type: adr
id: ADR-0000
title: [Decision Title]
status: proposed
decision_date: YYYY-MM-DD
owner: [Your Name or Role]
reversibility: 3
created: YYYY-MM-DD
updated: YYYY-MM-DD
related_specs:
  - PRD-XX-0000
  - SPEC-XX-0000
tags:
  - architecture
  - infrastructure
---

# ADR-0000: [Decision Title]

## Status

**Status:** Proposed
**Decision Date:** YYYY-MM-DD
**Reversibility:** 3/5 (1=hard to revert, 5=easy)

## Context

**Background:**
- What is the issue or situation that motivates this decision?
- What problem are we trying to solve?
- What constraints do we have?

**Stakeholders:**
- Who is affected by this decision?
- Who needs to be involved?

**Requirements:**
- What are the key requirements driving this decision?
- What are the success criteria?

## Decision

**What we decided:**
- Clear statement of the decision
- What approach we're taking

**Why this approach:**
- Rationale and reasoning
- Key factors that influenced the decision

**Alternatives considered:**

### Alternative 1: [Name]
- Description
- Pros: ...
- Cons: ...
- Why rejected: ...

### Alternative 2: [Name]
- Description
- Pros: ...
- Cons: ...
- Why rejected: ...

## Consequences

**Positive:**
- ✅ Benefit 1
- ✅ Benefit 2
- ✅ Benefit 3

**Negative:**
- ❌ Trade-off 1
- ❌ Trade-off 2
- ❌ Risk 1

**Neutral:**
- ℹ️ Change 1
- ℹ️ Change 2

## Implementation

**Timeline:**
- Phase 1: [Description] (Week 1-2)
- Phase 2: [Description] (Week 3-4)

**Required Changes:**
- [ ] Code changes in [module]
- [ ] Documentation updates
- [ ] Team training
- [ ] Infrastructure changes

**Success Metrics:**
- Metric 1: [Target value]
- Metric 2: [Target value]

## Revert Plan

**Reversibility Level:** 3/5

**When to consider reverting:**
- Trigger condition 1 (e.g., "Performance degrades by >20% for 2+ sprints")
- Trigger condition 2 (e.g., "Critical bug unfixable within 1 week")
- Trigger condition 3 (e.g., "Team velocity drops by >30%")

**How to revert:**

1. **Step 1:** [Detailed revert step]
   - Commands: `...`
   - Expected duration: X hours
   - Risk: Low/Medium/High

2. **Step 2:** [Detailed revert step]
   - Commands: `...`
   - Expected duration: X hours
   - Risk: Low/Medium/High

3. **Step 3:** [Validation]
   - Check: [What to verify]
   - Expected outcome: [What should happen]

**Fallback solution:**
- If revert fails, what's the backup plan?

## References

**Related Documents:**
- [PRD-XX-0000](../00-specs/prd/active/xxx.md)
- [PLAN-XX-0000](../01-plans/active/xxx.md)

**External Resources:**
- [Link to research](https://...)
- [Link to discussion](https://...)

**Related ADRs:**
- [ADR-0001](./ADR-0001-xxx.md) - Supersedes this decision
- [ADR-0003](./ADR-0003-xxx.md) - Related decision

---

**Document Metadata:**
- Created: YYYY-MM-DD
- Last Updated: YYYY-MM-DD
- Author: [Name]
- Reviewers: [Names]
