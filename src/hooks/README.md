# Description Formatting Hooks

백엔드에서 받아온 description 텍스트의 줄바꿈(`\n`)을 올바르게 렌더링하기 위한 공통 훅과 컴포넌트입니다.

## 문제 상황

백엔드에서 받아온 description에 줄바꿈이 포함되어 있지만, React에서 직접 렌더링하면 줄바꿈이 표시되지 않는 문제가 있습니다.

```javascript
// 백엔드에서 받은 데이터
const description = '3줄 요약\n\n1. 첫 번째 줄\n2. 두 번째 줄\n3. 세 번째 줄';

// ❌ 문제: 줄바꿈이 표시되지 않음
<p>{description}</p>;
```

## 해결 방법

### 1. 훅 사용

#### `useFormattedDescription`

description을 HTML로 포맷팅합니다.

```typescript
import { useFormattedDescription } from '@/hooks/useFormattedDescription';

function MyComponent({ description }) {
  const formattedDescription = useFormattedDescription(description);
  // "3줄 요약<br><br>1. 첫 번째 줄<br>2. 두 번째 줄<br>3. 세 번째 줄"

  return <div dangerouslySetInnerHTML={{ __html: formattedDescription }} />;
}
```

#### `useDescriptionJSX`

JSX에서 사용할 수 있는 형태로 포맷팅합니다.

```typescript
import { useDescriptionJSX } from '@/hooks/useFormattedDescription';

function MyComponent({ description }) {
  const htmlDescription = useDescriptionJSX(description);

  return <div dangerouslySetInnerHTML={htmlDescription} />;
}
```

#### `usePlainTextDescription`

HTML 태그 없이 순수 텍스트로 변환합니다.

```typescript
import { usePlainTextDescription } from '@/hooks/useFormattedDescription';

function MyComponent({ description }) {
  const textDescription = usePlainTextDescription(description);
  // "3줄 요약 1. 첫 번째 줄 2. 두 번째 줄 3. 세 번째 줄"

  return <p>{textDescription}</p>;
}
```

### 2. 컴포넌트 사용

#### `HTMLDescription`

줄바꿈을 유지하여 HTML로 렌더링합니다.

```typescript
import { HTMLDescription } from '@/components/FormattedDescription';

function MyComponent({ description }) {
  return <HTMLDescription description={description} className="prose prose-invert" />;
}
```

#### `TextDescription`

줄바꿈을 제거하고 텍스트로 렌더링합니다.

```typescript
import { TextDescription } from '@/components/FormattedDescription';

function MyComponent({ description }) {
  return <TextDescription description={description} maxLines={3} className="line-clamp-3" />;
}
```

#### `FormattedDescription`

유연한 포맷팅 옵션을 제공합니다.

```typescript
import { FormattedDescription } from '@/components/FormattedDescription';

function MyComponent({ description }) {
  return (
    <FormattedDescription
      description={description}
      variant="html" // 또는 "text"
      maxLines={2}
      className="custom-styles"
    />
  );
}
```

## 실제 사용 예시

### 카드 컴포넌트에서 사용

```typescript
// DefaultContentCard.tsx
import { HTMLDescription } from '@/components/FormattedDescription';

export function DefaultContentCard({ content }) {
  return (
    <div>
      <h3>{content.title}</h3>
      {content.description && (
        <div className="text-gray-400 leading-relaxed line-clamp-3">
          <HTMLDescription
            description={content.description}
            className="prose prose-sm prose-invert max-w-none"
          />
        </div>
      )}
    </div>
  );
}
```

### 모달에서 사용

```typescript
// ContentModalBody.tsx
import { HTMLDescription } from '@/components/FormattedDescription';

export function ContentModalBody({ content }) {
  return (
    <div className="prose prose-invert max-w-none">
      <HTMLDescription
        description={content.description}
        className="prose prose-invert max-w-none"
      />
    </div>
  );
}
```

### 리스트에서 사용 (줄 수 제한)

```typescript
// PostCard.tsx
import { TextDescription } from '@/components/FormattedDescription';

export function PostCard({ description }) {
  return (
    <div className="text-zinc-400 text-sm line-clamp-3">
      <TextDescription description={description} maxLines={3} />
    </div>
  );
}
```

## 특징

- **자동 이스케이프 처리**: `\n`을 실제 줄바꿈으로 변환
- **HTML 변환**: 줄바꿈을 `<br>` 태그로 변환
- **텍스트 정리**: 연속된 공백을 하나로 정리
- **성능 최적화**: `useMemo`를 사용하여 불필요한 재계산 방지
- **타입 안전성**: TypeScript로 작성되어 타입 안전성 보장
- **유연한 사용**: 훅과 컴포넌트 두 가지 방식으로 사용 가능

## 주의사항

- `HTMLDescription`과 `FormattedDescription`의 `variant="html"`은 `dangerouslySetInnerHTML`을 사용합니다
- 신뢰할 수 있는 소스의 데이터만 사용하세요
- XSS 공격을 방지하기 위해 백엔드에서도 적절한 검증이 필요합니다
