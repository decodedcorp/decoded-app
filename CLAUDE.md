# decoded-app Development Guidelines

## Overview
Modern web application for image/item discovery and curation with advanced filtering, detail views, and scroll animations.

## Tech Stack
- **Frontend**: Next.js 16.0.7, React 18.3.1, TypeScript 5.9.3
- **Styling**: Tailwind CSS 3.4.18 + custom design system
- **State**: Zustand 4.5.7, React Query 5.90.11
- **Backend**: Supabase (PostgreSQL, Auth)
- **Animations**: GSAP 3.13.0, Motion 12.23.12, Lenis 1.3.15
- **Linting**: ESLint 9.39.1, Prettier 3.6.2
- **Package Manager**: Yarn 4.9.2 (node-modules linker)

## Project Structure
```text
app/              # Next.js App Router pages
lib/              # Utilities, hooks, Supabase, Zustand stores
__tests__/        # Test files
specs/            # SpecKit-driven development specs
docs/             # ADR, API, ai-playbook, design-system
.claude/          # Claude Code settings and SpecKit commands
.cursor/          # Cursor AI rules
```

## Commands
```bash
yarn dev              # Development server
yarn build            # Production build
yarn start            # Start production server
yarn lint             # ESLint
yarn format           # Prettier formatting
yarn format:check     # Check Prettier formatting
```

## Code Style
- TypeScript strict mode enabled
- ESLint + Prettier applied
- Conventional Commits format

## Important Notes
- Uses Yarn 4 with node-modules linker - use `yarn` commands (not npm)
- ESLint 9 with flat config (eslint.config.mjs)
- Environment variables: .env.local (gitignored, see .env.local.example)
- Supabase integration required for data/auth

## SpecKit Integration
- Active spec: specs/001-scroll-animation/
- Commands: /speckit.* (in Claude Code)

## Documentation
- docs/adr/ - Architecture Decision Records
- docs/api/ - API integration guides
- docs/ai-playbook/ - AI tool usage guides
- docs/design-system/ - Design tokens

<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->
