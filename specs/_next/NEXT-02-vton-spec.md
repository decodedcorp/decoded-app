> STATUS: DRAFT — not approved for implementation

# NEXT-02: Virtual Try-On (VTON) Technical Architecture

> Direction: Phase 1–3 VTON rollout | Updated: 2026-02-20
> Audience: Internal decision-making + future AI agent context injection
> Builds on: NEXT-01 (Service Identity)
> User flow reference: [FLW-05 VTON](../flows/FLW-05-vton.md) — 5-stage cinematic fitting sequence

---

## Concept

VTON lets users see detected items (from image spots) virtually fitted on themselves. The 5-stage cinematic sequence (Pick & Drop → Chic Blur → Blueprint → Magic Flip → Morphing Loop) defined in FLW-05 is the UX layer — this document covers the technical architecture beneath it.

## Phase Architecture

### Phase 1 — MVP (Feature-Flagged Proof of Concept)

**Goal:** End-to-end flow from item tap → rendered result. No user photo required.
**Architecture:**
- Input: detected item image (from existing `spots.solution_id` → product image URL)
- Processing: third-party VTON API (e.g. Fashn.ai or similar) — item-on-mannequin mode
- Output: static result image rendered in result screen
- Auth gate: logged-in users only (feature flag in `authStore`)
- Storage: ephemeral — result not persisted, session-only

**Key decisions needed:** API vendor selection, rate limiting strategy, cost per inference.

### Phase 2 — User Photo Integration

**Goal:** User photo as the fitting base for personalized results.
**Architecture:**
- Add photo capture/upload sub-flow (camera or gallery pick)
- User photo stored temporarily (presigned S3 URL, 24h TTL)
- VTON API call: item image + user photo → fitted result
- Result optionally saved to user's "Try-On History" (new DB table: `vton_results`)
- Privacy: user photo never persisted beyond session without explicit opt-in

**Dependencies:** S3 presigned upload, new API route `/api/v1/vton/submit`, new Supabase table.

### Phase 3 — Scale & Personalization

**Goal:** VTON as a core commerce-driving feature, personalized by body profile.
**Architecture:**
- User body profile (height, measurements) stored in `users` table (new columns)
- VTON model fine-tuned or parameterized with body profile for better fit accuracy
- Result gallery: persistent, shareable, linkable (`/vton/[resultId]`)
- Batch processing queue for peak load (background job, not synchronous)
- Analytics: conversion tracking from VTON result → affiliate link tap

## Integration Points (Current System)

| Touchpoint | Current spec | VTON hook |
|------------|-------------|-----------|
| Item spot selection | FLW-02 Solution Panel | "Try On" CTA added to solution card |
| Auth check | `authStore.selectIsLoggedIn` | VTON requires `isLoggedIn` (not guest) |
| Solution data | `SolutionRow.affiliate_url` | Product image sourced from solution |

## Out of Scope (This Document)

- Specific API endpoint contracts (Phase 1 vendor not yet selected)
- UI component specs (follow FLW-05 for flow, separate screen spec TBD)
- Avatar/body profile capture UI (separate sub-flow)
