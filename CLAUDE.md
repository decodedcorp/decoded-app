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
packages/web/
├── app/              # Next.js App Router pages
├── lib/              # Utilities, hooks, Supabase, Zustand stores
│   ├── api/          # API client functions
│   ├── components/   # React components (by feature)
│   ├── hooks/        # Custom React hooks
│   ├── stores/       # Zustand stores
│   ├── supabase/     # Supabase client + queries
│   └── utils/        # Utility functions
└── __tests__/        # Test files

packages/shared/      # Shared types, hooks, utilities

specs/                # Feature specifications
docs/                 # Implementation documentation
.planning/            # GSD workflow artifacts
.claude/              # Claude Code settings
```

## Key File Locations

| 영역 | 위치 | 설명 |
|------|------|------|
| **Auth** | `lib/stores/authStore.ts` | OAuth + 세션 관리 |
| **API Client** | `lib/api/posts.ts` | 백엔드 API 호출 |
| **API Routes** | `app/api/v1/` | Next.js API 프록시 |
| **Supabase** | `lib/supabase/queries/` | DB 쿼리 (server/client) |
| **Components** | `lib/components/` | 기능별 컴포넌트 |
| **Hooks** | `lib/hooks/` | 커스텀 훅 (useImages, usePosts) |
| **Stores** | `lib/stores/` | Zustand 상태 (auth, request, profile) |

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

## Codebase Documentation

상세한 코드베이스 분석은 `.planning/codebase/`에서 확인:

| 문서 | 내용 |
|------|------|
| [STACK.md](.planning/codebase/STACK.md) | 기술 스택, 의존성, 설정 |
| [ARCHITECTURE.md](.planning/codebase/ARCHITECTURE.md) | 시스템 아키텍처, 레이어, 데이터 흐름 |
| [STRUCTURE.md](.planning/codebase/STRUCTURE.md) | 디렉토리 구조, 파일 위치 |
| [CONVENTIONS.md](.planning/codebase/CONVENTIONS.md) | 코딩 컨벤션, 네이밍 패턴 |
| [TESTING.md](.planning/codebase/TESTING.md) | 테스트 구조, 패턴 |
| [INTEGRATIONS.md](.planning/codebase/INTEGRATIONS.md) | 외부 서비스, API 연동 |
| [CONCERNS.md](.planning/codebase/CONCERNS.md) | 기술 부채, 주의 사항 |

## GSD Workflow

프로젝트 관리 명령어:

```bash
# 현황 확인
/gsd:progress          # 전체 진행 상황

# 페이즈 작업
/gsd:discuss-phase N   # 페이즈 N 논의
/gsd:plan-phase N      # 페이즈 N 계획
/gsd:execute-phase N   # 페이즈 N 실행
/gsd:verify-work       # 작업 검증

# 기타
/gsd:help              # 전체 명령어 목록
/gsd:quick             # 빠른 작업 (계획 없이)
```

## SpecKit Integration
- Specs 위치: `specs/` (feature별 폴더)
- Commands: `/speckit.*` (in Claude Code)

## Documentation
- **[docs/README.md](docs/README.md)** - 문서 인덱스
- **[.planning/](.planning/)** - GSD 워크플로우 아티팩트
- docs/adr/ - Architecture Decision Records
- docs/api/ - API integration guides
- docs/ai-playbook/ - AI tool usage guides
- docs/design-system/ - Design tokens

<!-- Last Updated: 2026-02-05 -->

<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->
