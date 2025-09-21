# Decoded App - Project Overview

## Project Purpose
Decoded App is a React/Next.js web application focused on content discovery and sharing. It appears to be a social platform with channels, content browsing, user authentication, and content creation features.

## Tech Stack
- **Frontend**: Next.js 15.4.1, React 19.1.0, TypeScript 5.9.2
- **Styling**: Tailwind CSS 4.1.11 with custom design system
- **State Management**: Zustand 5.0.6, React Query 5.83.0
- **Animations**: Framer Motion 12.23.12, GSAP 3.13.0
- **Testing**: Playwright 1.55.0
- **Build Tools**: Yarn 4.9.2, ESLint, TypeScript
- **Deployment**: Vercel (based on vercel.json)

## Key Features
- User authentication and profiles
- Channel-based content organization
- Content upload and creation
- Search functionality (global and channel-specific)
- Mobile-responsive design with sidebar navigation
- Notification system
- Bookmarking
- Comment system
- Modal-based UI interactions

## Project Structure
```
src/
├── app/           # Next.js app router pages
├── domains/       # Feature-based modules (auth, channels, profile, etc.)
├── shared/        # Shared components and utilities
├── styles/        # Global styles and design tokens
├── lib/           # Library utilities and hooks
├── store/         # Zustand state management
├── constants/     # Application constants
└── types/         # TypeScript type definitions
```

## Current Focus
The project is undergoing a Design System v3 migration with emphasis on:
- Role-based design tokens
- Mobile optimization improvements
- Semantic color naming
- Legacy compatibility layer