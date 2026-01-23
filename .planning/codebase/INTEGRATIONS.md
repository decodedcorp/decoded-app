# External Integrations
**Analysis Date:** 2026-01-23

## APIs & External Services
**Backend API:**
- API_BASE_URL = https://dev.decoded.style (server-side proxy)
- NEXT_PUBLIC_API_BASE_URL (empty by default, uses Next.js API routes as proxy)
- Used for forwarding requests to backend server

**Image CDN & Hosting:**
- Cloudflare R2 - Image storage and CDN (**.r2.dev domain)
  - Configured in next.config.js as remote image pattern
  - Supports all R2 bucket subdomains
- Picsum.photos - Placeholder images for mock data
- Unsplash - Fallback images embedded in utilities

**Avatar & Profile:**
- DiceBear API (api.dicebear.com) - Generated avatar SVGs
  - Used for profile mock data (Avataaars style)
  - Configured in next.config.js as remote image pattern

## Data Storage
**Databases:**
- PostgreSQL (via Supabase)
  - Primary data store for application
  - Connection managed via Supabase client (@supabase/supabase-js)
  - Server queries via createSupabaseServerClient()
  - Client queries via supabaseBrowserClient

**Storage Buckets:**
- Supabase Storage - File uploads and retrieval
  - Image storage functionality
  - Integration via @supabase/supabase-js

## Authentication & Identity
**Auth Provider:**
- Supabase Auth - OAuth2/JWT-based authentication
  - Email/password authentication
  - Session management via cookies
  - @supabase/auth-helpers-nextjs middleware for Next.js 15+
  - Cookie-based state in Server Components and Route Handlers
  - Managed via authStore (Zustand)

## Client Libraries & SDKs
**Supabase Suite:**
- @supabase/supabase-js 2.86.0 - Main client library
  - Database queries (from/select/where/order/limit)
  - Real-time subscriptions
  - Authentication
  - Storage operations
- @supabase/auth-helpers-nextjs 0.15.0 - Next.js integration
  - Server Component authentication
  - Route Handler auth support
  - Cookie management

**React Query:**
- @tanstack/react-query 5.90.11 - Server state management
  - Data fetching, caching, synchronization
  - Configured via React Query client (lib/react-query/client.ts)
  - Default: 5-minute stale time, no refetch on window focus

**State Management:**
- Zustand 4.5.7 - Client state stores
  - authStore - Authentication state
  - requestStore - Request/form modal state
  - profileStore - User profile data
  - transitionStore - Route transition state

## Media & Files
**Image Processing:**
- browser-image-compression 2.0.2
  - Client-side image compression before upload
  - Used in useImageUpload hook

**Image Optimization:**
- Next.js Image component - Built-in optimization
  - Automatic format conversion (WebP, AVIF)
  - Responsive image sizing
  - Lazy loading
  - Blur-up placeholder support

## Development Services
**Error Tracking & Monitoring:**
- TanStack React Query DevTools 5.91.1 - Query debugging

**Theme & Styling:**
- next-themes 0.4.6 - Dark mode management
  - System preference detection
  - Manual override support
  - SSR-safe theme switching

## Analytics & SEO (Potential)
- Configured but not actively used:
  - react-markdown 10.1.0 - For potential content rendering
  - Tailwind CSS @tailwindcss/typography - For prose styling

## Third-Party Icon Libraries
- lucide-react 0.555.0 - Modern icon system
- react-icons 5.5.0 - Additional icon sets

## Notification System
- sonner 2.0.7 - Toast notifications
  - Non-blocking user feedback
  - Customizable toast messages

## Animation Libraries
- GSAP 3.13.0 - Professional animations
  - Complex animation sequences
  - Timeline control
  - Plugin ecosystem
- Motion 12.23.12 - Declarative animations
  - Component-based animation API
  - Gesture-driven animations
- Lenis 1.3.15 - Smooth scroll behavior
  - Enhanced scrolling experience
  - Momentum scrolling
- @use-gesture/react 10.3.1 - Gesture recognition
  - Drag, pinch, wheel, scroll gestures
  - Touch event handling

## 3D Graphics
- Three.js 0.167.1 - WebGL 3D library
  - 3D visualizations (potential feature)
  - Not actively used in current codebase

## URL & Domains
**Configured Remote Patterns (next.config.js):**
- `**.r2.dev` - All Cloudflare R2 buckets
- `picsum.photos/**` - Placeholder service
- `api.dicebear.com/**` - Avatar generation

**Backend URL:**
- Development: https://dev.decoded.style

---
*Integration audit: 2026-01-23*
