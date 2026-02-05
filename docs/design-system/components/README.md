# Components Index

> Version: 2.0.0
> Last Updated: 2026-02-05

---

## Overview

Decoded Design System v2.0 컴포넌트 라이브러리입니다.
모든 컴포넌트는 `packages/web/lib/design-system/`에서 관리되며, CVA (class-variance-authority)를 사용한 variant 시스템을 지원합니다.

**Import Path**: `@/lib/design-system`

---

## Component Categories

### Typography Components

타이포그래피 시스템을 위한 Heading과 Text 컴포넌트입니다.

| Component | Purpose | Status |
|-----------|---------|--------|
| [Heading](./typography.md#heading) | 제목 컴포넌트 (hero, h1-h4) | ✅ Complete |
| [Text](./typography.md#text) | 본문 텍스트 (body, small, caption) | ✅ Complete |

**Quick Import**:
```tsx
import { Heading, Text } from "@/lib/design-system";
```

---

### Input Components

폼 입력 컴포넌트입니다.

| Component | Purpose | Status |
|-----------|---------|--------|
| [Input](./inputs.md#input) | 기본 입력 필드 (아이콘, 라벨, 에러 지원) | ✅ Complete |
| [SearchInput](./inputs.md#searchinput) | 검색 전용 입력 (Clear 버튼 포함) | ✅ Complete |

**Quick Import**:
```tsx
import { Input, SearchInput } from "@/lib/design-system";
```

---

### Card Components

카드 기반 레이아웃 컴포넌트입니다.

| Component | Purpose | Status |
|-----------|---------|--------|
| [Card](./cards.md#card) | 기본 카드 컨테이너 (variants, sizes) | ✅ Complete |
| [CardHeader](./cards.md#cardheader) | 카드 헤더 슬롯 | ✅ Complete |
| [CardContent](./cards.md#cardcontent) | 카드 콘텐츠 슬롯 | ✅ Complete |
| [CardFooter](./cards.md#cardfooter) | 카드 푸터 슬롯 | ✅ Complete |
| [CardSkeleton](./cards.md#cardskeleton) | 카드 로딩 스켈레톤 | ✅ Complete |
| [ProductCard](./cards.md#productcard) | 제품 카드 (이미지, 브랜드, 가격) | ✅ Complete |
| [GridCard](./cards.md#gridcard) | 그리드 레이아웃 카드 | ✅ Complete |
| [FeedCardBase](./cards.md#feedcardbase) | 소셜 피드 카드 | ✅ Complete |
| [ProfileHeaderCard](./cards.md#profileheadercard) | 프로필 헤더 카드 | ✅ Complete |

**Quick Import**:
```tsx
import {
  Card, CardHeader, CardContent, CardFooter, CardSkeleton,
  ProductCard, GridCard, FeedCardBase, ProfileHeaderCard
} from "@/lib/design-system";
```

---

### Header/Footer Components

레이아웃 헤더와 푸터 컴포넌트입니다.

| Component | Purpose | Status |
|-----------|---------|--------|
| [DesktopHeader](./headers.md#desktopheader) | 데스크탑 네비게이션 헤더 (md+) | ✅ Complete |
| [MobileHeader](./headers.md#mobileheader) | 모바일 네비게이션 헤더 (< md) | ✅ Complete |
| [DesktopFooter](./headers.md#desktopfooter) | 데스크탑 푸터 | ✅ Complete |

**Quick Import**:
```tsx
import { DesktopHeader, MobileHeader, DesktopFooter } from "@/lib/design-system";
```

---

## Import Pattern

### Individual Import (권장)

```tsx
// 사용할 컴포넌트만 import
import { Heading, Text, Card, CardHeader, CardContent } from "@/lib/design-system";
```

### Category Import

```tsx
// Typography
import { Heading, Text, headingVariants, textVariants } from "@/lib/design-system";
import type { HeadingProps, TextProps } from "@/lib/design-system";

// Inputs
import { Input, SearchInput, inputVariants } from "@/lib/design-system";
import type { InputProps, SearchInputProps } from "@/lib/design-system";

// Cards
import {
  Card, CardHeader, CardContent, CardFooter,
  ProductCard, GridCard
} from "@/lib/design-system";
import type { CardProps, ProductCardProps } from "@/lib/design-system";
```

---

## Usage Examples

### Basic Card Layout

```tsx
import { Card, CardHeader, CardContent, CardFooter, Heading, Text } from "@/lib/design-system";

function MyCard() {
  return (
    <Card variant="elevated" size="lg">
      <CardHeader>
        <Heading variant="h3">Card Title</Heading>
        <Text variant="small" textColor="muted">Subtitle</Text>
      </CardHeader>
      <CardContent>
        <Text>Main content goes here</Text>
      </CardContent>
      <CardFooter>
        <button>Action</button>
      </CardFooter>
    </Card>
  );
}
```

### Product Grid

```tsx
import { ProductCard } from "@/lib/design-system";

function ProductGrid({ products }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map(product => (
        <ProductCard
          key={product.id}
          imageUrl={product.image}
          brand={product.brand}
          name={product.name}
          price={product.price}
          link={`/items/${product.id}`}
        />
      ))}
    </div>
  );
}
```

### Form with Input

```tsx
import { Input, SearchInput } from "@/lib/design-system";

function MyForm() {
  return (
    <form>
      <Input
        label="Email"
        placeholder="you@example.com"
        type="email"
      />

      <SearchInput
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onClear={() => setQuery('')}
        placeholder="Search products..."
      />
    </form>
  );
}
```

---

## Component Guidelines

### 1. Variant 사용

모든 컴포넌트는 variant prop을 통해 스타일 변형을 지원합니다:

```tsx
// Heading variants
<Heading variant="hero">Hero</Heading>
<Heading variant="h1">H1</Heading>
<Heading variant="h2">H2</Heading>

// Card variants
<Card variant="default">Default</Card>
<Card variant="elevated">Elevated</Card>
<Card variant="outline">Outline</Card>
```

### 2. Composition 패턴

Card 컴포넌트는 slot composition을 사용합니다:

```tsx
<Card>
  <CardHeader>...</CardHeader>  {/* Optional */}
  <CardContent>...</CardContent>  {/* Required */}
  <CardFooter>...</CardFooter>  {/* Optional */}
</Card>
```

### 3. TypeScript Props

모든 컴포넌트는 TypeScript props와 variants를 export합니다:

```tsx
import type { HeadingProps, CardProps } from "@/lib/design-system";
import { headingVariants, cardVariants } from "@/lib/design-system";

// Props 확장
interface MyCardProps extends CardProps {
  title: string;
}

// Variants 직접 사용
const myClasses = cardVariants({ variant: "elevated", size: "lg" });
```

### 4. className Override

모든 컴포넌트는 `className` prop으로 커스터마이징 가능합니다:

```tsx
<Card className="mt-8 border-primary">
  {/* variant 스타일 + 추가 클래스 병합 */}
</Card>

<Heading variant="h2" className="text-primary">
  {/* h2 스타일 + primary 색상 */}
</Heading>
```

---

## Design Tokens Integration

모든 컴포넌트는 Design Tokens를 기반으로 구축되었습니다:

- **Typography**: `typography.sizes`, `responsiveTypography`
- **Colors**: `colors` (CSS variables)
- **Spacing**: `spacing` (4px 기준)
- **Shadows**: `shadows`
- **Border Radius**: `borderRadius`

자세한 내용: [tokens.md](../tokens.md)

---

## Component Status

| Status | Meaning |
|--------|---------|
| ✅ Complete | 프로덕션 사용 가능 |
| 🚧 In Progress | 개발 중 |
| 📝 Planned | 계획됨 |
| ⚠️ Deprecated | 사용 중단 예정 |

---

## Related Documentation

- [Design Tokens](../tokens.md) - 토큰 레퍼런스
- [Design Patterns](../patterns.md) - 디자인 패턴 가이드
- [decoded.pen](../decoded.pen) - 시각적 레퍼런스

---

## Component File Locations

```
packages/web/lib/design-system/
├── index.ts                    # Barrel export
├── tokens.ts                   # Design tokens
├── typography.tsx              # Heading, Text
├── input.tsx                   # Input, SearchInput
├── card.tsx                    # Card, CardHeader, CardContent, CardFooter, CardSkeleton
├── product-card.tsx            # ProductCard
├── grid-card.tsx               # GridCard
├── feed-card.tsx               # FeedCardBase
├── profile-header-card.tsx     # ProfileHeaderCard
├── desktop-header.tsx          # DesktopHeader
├── mobile-header.tsx           # MobileHeader
└── desktop-footer.tsx          # DesktopFooter
```

---

> **Note**: 컴포넌트 추가 시 이 인덱스를 업데이트하세요.
> 각 컴포넌트는 독립적인 문서 섹션을 가져야 합니다.
