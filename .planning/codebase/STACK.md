# Technology Stack
**Analysis Date:** 2026-01-23

## Languages
**Primary:**
- TypeScript 5.9.3 - All source code, type-safe development
- JavaScript (ESM) - Configuration files (next.config.js, postcss.config.js, eslint.config.mjs)
- HTML5 - Markup via React JSX
- CSS3 - Via Tailwind CSS utility classes

## Runtime
**Environment:**
- Node.js (via Yarn 4.9.2 with node-modules linker)
- Next.js 16.0.7 - Full-stack React framework with App Router

## Frameworks & Libraries
**Core:**
- React 18.3.1 - UI component library
- Next.js 16.0.7 - React framework with SSR, SSG, API routes, and middleware
- TypeScript 5.9.3 - Static type checking

**State Management:**
- Zustand 4.5.7 - Lightweight state management for authStore, requestStore, profileStore, transitionStore
- TanStack React Query 5.90.11 - Server state management, data fetching, caching
- TanStack React Query DevTools 5.91.1 - Development debugging

**Styling & UI:**
- Tailwind CSS 3.4.18 - Utility-first CSS framework
- @tailwindcss/typography 0.5.19 - Prose styling plugin
- Tailwind Merge 3.4.0 - Merge conflicting Tailwind classes
- Class Variance Authority 0.7.1 - Component design system helper
- Shadcn 3.5.0 - Accessible component library
- Lucide React 0.555.0 - Icon component library
- React Icons 5.5.0 - Additional icon sets

**Animations & Motion:**
- GSAP 3.13.0 - Professional animation library
- @gsap/react 2.1.2 - GSAP React integration
- Motion 12.23.12 - Declarative animation library
- Lenis 1.3.15 - Smooth scrolling library
- @use-gesture/react 10.3.1 - Gesture recognition

**3D Graphics:**
- Three.js 0.167.1 - 3D JavaScript library
- @types/three 0.181.0 - TypeScript definitions

**Media & Image Processing:**
- browser-image-compression 2.0.2 - Client-side image compression
- next-themes 0.4.6 - Dark mode theming
- react-markdown 10.1.0 - Markdown rendering

**Notifications:**
- Sonner 2.0.7 - Toast notification library

**UI Component Utilities:**
- @radix-ui/react-slot 1.2.4 - Render delegation utility
- clsx 2.1.1 - Conditional className utility

## Backend & Data
**Database:**
- PostgreSQL (via Supabase)
- Supabase @supabase/supabase-js 2.86.0 - PostgreSQL database client

**Authentication:**
- Supabase Auth - Built-in authentication system
- @supabase/auth-helpers-nextjs 0.15.0 - Next.js authentication middleware

**Storage:**
- Supabase Storage - File storage backend
- Cloudflare R2 - Image CDN (configured in next.config.js via r2.dev domain)

## Build Tools & Linting
**Build:**
- Next.js 16.0.7 - Built-in webpack-based build system
- PostCSS 8.5.6 - CSS processing
- Autoprefixer 10.4.22 - Vendor prefixes

**Code Quality:**
- ESLint 9.39.1 - JavaScript/TypeScript linter
- ESLint Config Next 16.0.3 - Next.js ESLint config
- ESLint Config Prettier 10.1.8 - Disable conflicting rules
- ESLint Plugin Prettier 5.5.4 - Run Prettier as ESLint rule
- ESLint Plugin React - React best practices
- ESLint Plugin React Hooks - Hooks best practices
- Prettier 3.6.2 - Code formatter
- TypeScript 5.9.3 - Type checking

**Package Management:**
- Yarn 4.9.2 - Package manager with workspaces (monorepo)

## Development Dependencies
**Type Definitions:**
- @types/node 20.19.25
- @types/react 18.3.27
- @types/react-dom 18.3.7
- @types/three 0.181.0

## Monorepo Structure
**Workspaces:**
- @decoded/web (packages/web) - Main web application
- @decoded/shared (packages/shared) - Shared utilities, types, queries, hooks

## Configuration
**Environment:**
- .env.local - Local environment variables (gitignored)
- .env.local.example - Template for environment variables
- NEXT_PUBLIC_SUPABASE_URL - Supabase project URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY - Supabase public key
- SUPABASE_SERVICE_ROLE_KEY - Supabase admin key (server-only)
- API_BASE_URL - Backend API URL (server-only)
- NEXT_PUBLIC_API_BASE_URL - Client-side API URL (empty for proxy mode)

**TypeScript:**
- Strict mode enabled
- ES2017 target
- ESNext module system
- Bundler module resolution

**Next.js:**
- App Router (next/app directory)
- React Strict Mode enabled
- Remote image patterns: **.r2.dev, picsum.photos, api.dicebear.com
- Transpiled packages: @decoded/shared

---
*Stack analysis: 2026-01-23*
