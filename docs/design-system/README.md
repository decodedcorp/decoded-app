# Decoded Design System

> Version: 1.0.0
> Last Updated: 2026-01-08

---

## Overview

Decoded Design System은 웹과 모바일 앱 전반에 걸쳐 일관된 사용자 경험을 제공하기 위한 디자인 토큰, 컴포넌트, 패턴을 정의합니다.

---

## Document Index

### Foundation

| Document | Description | Status |
|----------|-------------|--------|
| [colors.md](./colors.md) | 컬러 시스템 (Semantic + Categorical) | Complete |
| [typography.md](./typography.md) | 타이포그래피 시스템 | Complete |
| [spacing.md](./spacing.md) | 간격 및 레이아웃 시스템 | Complete |
| [icons.md](./icons.md) | 아이콘 시스템 | Complete |

### Components

| Document | Description | Status |
|----------|-------------|--------|
| [components/README.md](./components/README.md) | 컴포넌트 개요 | Complete |
| [components/buttons.md](./components/buttons.md) | 버튼 시스템 | Complete |
| [components/inputs.md](./components/inputs.md) | 입력 필드 | Complete |
| [components/cards.md](./components/cards.md) | 카드 컴포넌트 | Complete |
| [components/modals.md](./components/modals.md) | 모달/다이얼로그 | Complete |
| [components/navigation.md](./components/navigation.md) | 네비게이션 | Complete |
| [components/filters.md](./components/filters.md) | 필터 UI | Complete |
| [components/feedback.md](./components/feedback.md) | 토스트/알림/로딩 | Complete |

---

## Quick Reference

### Color Tokens

```css
/* Primary */
--primary: oklch(0.21 0.006 285.75);
--primary-foreground: oklch(0.98 0 0);

/* Secondary */
--secondary: oklch(0.96 0.001 286.38);
--secondary-foreground: oklch(0.21 0.006 285.75);

/* Destructive */
--destructive: oklch(0.57 0.23 27);
--destructive-foreground: oklch(0.98 0 0);
```

### Typography Scale

| Class | Size | Line Height |
|-------|------|-------------|
| text-xs | 12px | 16px |
| text-sm | 14px | 20px |
| text-base | 16px | 24px |
| text-lg | 18px | 28px |
| text-xl | 20px | 28px |
| text-2xl | 24px | 32px |
| text-3xl | 30px | 36px |

### Spacing Scale

| Token | Value |
|-------|-------|
| space-1 | 4px |
| space-2 | 8px |
| space-3 | 12px |
| space-4 | 16px |
| space-6 | 24px |
| space-8 | 32px |

### Breakpoints

| Name | Width | Usage |
|------|-------|-------|
| Mobile | < 640px | 모바일 레이아웃 |
| Tablet | 640-1024px | 태블릿 레이아웃 |
| Desktop | > 1024px | 데스크톱 레이아웃 |

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| CSS | Tailwind CSS 3.4 |
| Color System | OKLCH |
| Theme | next-themes (Light/Dark) |
| Animations | GSAP, Motion |
| Icons | Lucide Icons |

---

## Usage Guidelines

### 1. 색상 사용

- **Primary**: 주요 액션 (저장, 구매, 제출)
- **Secondary**: 보조 액션, 비활성 상태
- **Destructive**: 삭제, 위험한 액션
- **Muted**: 보조 텍스트, 비활성 상태

### 2. 타이포그래피

- **제목**: Playfair Display (font-serif)
- **본문**: Inter (font-sans)
- **코드**: Monospace

### 3. 간격

- 4px 기준 스케일 사용
- 컴포넌트 내부: space-2 ~ space-4
- 섹션 간: space-6 ~ space-8

### 4. 반응형

- Mobile First 접근
- Breakpoint별 레이아웃 조정
- 터치 타겟 최소 44px (모바일)

---

## Related Documentation

- Feature Specs: [specs/feature-spec/](../../specs/feature-spec/)
- Wireframes: [specs/feature-spec/wireframes/](../../specs/feature-spec/wireframes/)
- Database Schema: [docs/database/](../database/)
