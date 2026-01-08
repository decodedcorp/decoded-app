# Decoded App - Feature Specification

> Version: 1.0.0
> Last Updated: 2026-01-08
> Source: `docs/기능명세서.md`

---

## Overview

Decoded is a K-content fashion discovery platform that helps fans identify and purchase items worn by Korean celebrities in dramas, music shows, and public appearances.

### Core Value Proposition
1. **Deep-dive Discovery**: Navigate from content → cast → context → item
2. **Fandom Engagement**: Badge system rewards fans who contribute to their favorite artists
3. **Conversion**: Direct purchase links with affiliate tracking

---

## Document Index

| File | Category | Features | Status |
|------|----------|----------|--------|
| [01-user-system.md](./01-user-system.md) | User System | U-01 ~ U-05 | 0% implemented |
| [02-discovery.md](./02-discovery.md) | Discovery | D-01 ~ D-04 | 30% implemented |
| [03-detail-interaction.md](./03-detail-interaction.md) | Detail & Interaction | V-01 ~ V-06 | 40% implemented |
| [04-creation-ai.md](./04-creation-ai.md) | Creation & AI | C-01 ~ C-04 | 10% implemented |
| [05-system-backend.md](./05-system-backend.md) | System & Backend | S-01 ~ S-08 | 20% implemented |
| [06-admin.md](./06-admin.md) | Admin Panel | A-01 ~ A-03 | 0% implemented |
| [data-models.md](./data-models.md) | Data Models | TypeScript types | Reference |

---

## Priority Matrix

### P0 - Critical (Must Have for MVP)

| ID | Feature | Category | Status |
|----|---------|----------|--------|
| U-01 | Social Login | User | Not Started |
| U-03 | Profile Dashboard | User | Not Started |
| D-01 | Responsive Magazine Feed | Discovery | **Implemented** |
| D-02 | Hierarchical Filter (Deep Filter) | Discovery | Not Started |
| D-04 | Unified Search | Discovery | Partial |
| V-01 | Responsive Detail View | Detail | **Implemented** |
| V-02 | Pin Interaction | Detail | Partial |
| V-03 | Dual Match List | Detail | Not Started |
| V-04 | Smart Tags (Breadcrumb) | Detail | Not Started |
| V-05 | Purchase Link (Outlink) | Detail | Not Started |
| V-06 | Voting & Comments | Detail | Not Started |
| C-01 | Image Upload | Creation | Not Started |
| C-02 | AI Object Recognition | Creation | Partial |
| C-03 | Metadata Tagging | Creation | Not Started |
| C-04 | Spot Registration (URL Parsing) | Creation | Not Started |

### P1 - Important

| ID | Feature | Category | Status |
|----|---------|----------|--------|
| U-02 | Multi-language (KO/EN) | User | Not Started |
| U-04 | Activity History | User | Not Started |
| D-03 | Media Gallery | Discovery | Not Started |

### P2 - Nice to Have

| ID | Feature | Category | Status |
|----|---------|----------|--------|
| U-05 | Withdrawal Request | User | Not Started |

---

## Architecture Overview

### Hierarchical Data Model

```
Category (K-POP, K-Drama, K-Movie)
    └── Media/Group (BTS, Squid Game)
            └── Cast/Person (Jungkook, Jung Ho-yeon)
                    └── Context (Airport, Stage, Bedroom)
                            └── Item (Jacket, Bag, Shoes)
```

### Key Entities

```
POST (Social media post / Scene capture)
  ├── belongs_to: MEDIA (show, drama, group)
  ├── features: CAST[] (people in the image)
  ├── has_context: CONTEXT (where/when)
  └── contains: ITEM[] (detected fashion items)

USER
  ├── has_many: CONTRIBUTIONS (posts, answers)
  ├── has_many: BADGES (earned titles)
  └── earns: REWARDS (revenue share)
```

---

## Implementation Roadmap

### Sprint 1: Foundation
- [ ] U-01 Social Login (Kakao, Google, Apple)
- [ ] U-03 Profile Dashboard (basic)
- [ ] D-02 Hierarchical Filter UI

### Sprint 2: Core Interaction
- [ ] V-02 Pin Interaction (complete)
- [ ] V-03 Dual Match List
- [ ] V-05 Purchase Links
- [ ] C-01 Image Upload

### Sprint 3: AI & Engagement
- [ ] C-02 AI Object Recognition (UI)
- [ ] C-03 Metadata Tagging
- [ ] V-06 Voting & Comments
- [ ] S-07 Badge System

### Sprint 4: Monetization & Admin
- [ ] S-05 Click Tracker
- [ ] S-06 Reward Batch
- [ ] A-01 ~ A-03 Admin Panel

---

## Technical Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 16, React 18, TypeScript |
| Styling | Tailwind CSS, GSAP, Motion |
| State | Zustand, React Query |
| Backend | Supabase (PostgreSQL, Auth, Storage) |
| AI | Vision API (TBD), Scraper Engine |

---

## File Naming Convention

- Feature IDs use prefix letters:
  - `U-##`: User features
  - `D-##`: Discovery features
  - `V-##`: View/Detail features
  - `C-##`: Creation features
  - `S-##`: System features
  - `A-##`: Admin features

- Priority levels:
  - `P0`: Critical for MVP
  - `P1`: Important for launch
  - `P2`: Nice to have

---

## Related Documentation

- Original Spec (Korean): [`docs/기능명세서.md`](../../docs/기능명세서.md)
- Database Schema: [`docs/database/`](../../docs/database/)
- Architecture Decisions: [`docs/adr/`](../../docs/adr/)
- Design System: [`docs/design-system/`](../../docs/design-system/)
