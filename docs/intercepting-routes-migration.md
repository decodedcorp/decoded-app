# Intercepting Routes 마이그레이션 가이드

## 🎯 목적

기존 모달 기반 콘텐츠 표시를 URL 경로 기반으로 변환하여 다음을 달성:
- SEO 최적화 (검색엔진 크롤링, 메타데이터)
- 모바일 최적화 (직접 링크, 공유 가능성)
- API 효율성 (URL 기반 데이터 fetching)
- UX 일관성 (브라우저 히스토리, 뒤로가기)

## 🏗️ 아키텍처

### Intercepting Routes 구조
```
app/channels/[channelId]/
├── layout.tsx                          # Parallel Routes 지원
├── page.tsx                           # 채널 메인 페이지
├── @modal/                            # 모달 슬롯
│   ├── default.tsx                    # 기본 상태 (null)
│   └── (..)contents/[contentId]/
│       ├── page.tsx                   # 모달 버전
│       ├── loading.tsx                # 모달 로딩
│       └── error.tsx                  # 모달 에러
└── contents/[contentId]/              # 풀페이지
    ├── page.tsx                       # 풀페이지 버전
    ├── loading.tsx                    # 페이지 로딩
    ├── error.tsx                      # 페이지 에러
    └── not-found.tsx                  # 404 처리
```

### 동작 방식
1. **카드 클릭**: Link 기반 네비게이션 → URL 변경
2. **Intercepting Routes**: 채널 페이지에서 클릭 시 모달 표시
3. **직접 접근**: URL 직접 입력 시 풀페이지 표시
4. **브라우저 히스토리**: 자연스러운 뒤로가기/앞으로가기

## 🔧 주요 컴포넌트

### 1. ContentsCardLink
기존 `ContentsCard`를 Link로 감싸는 래퍼 컴포넌트

```tsx
<ContentsCardLink
  channelId="channel-123"
  card={contentData}
  uniqueId="content-456"
  gridIndex={0}
  prefetchOnHover={true}      // 호버 시 prefetch
  prefetchOnViewport={false}  // 뷰포트 진입 시 prefetch
/>
```

### 2. ContentBody
모달/페이지에서 공통 사용하는 콘텐츠 바디

```tsx
<ContentBody
  content={contentItem}
  variant="modal"        // 'modal' | 'page'
  channelId={channelId}
/>
```

### 3. Modal
접근성이 개선된 모달 컴포넌트

```tsx
<Modal
  onCloseHref="/channels/123"  // 닫기 시 이동할 URL
  ariaLabel="콘텐츠 제목"
>
  {children}
</Modal>
```

## 📊 SEO & 메타데이터

### 메타데이터 생성
```tsx
export async function generateMetadata({ params }) {
  const content = await getContentWithValidation(params);
  return generateContentMetadata(content, params.channelId);
}
```

### 구조화된 데이터
```tsx
<StructuredData content={content} channelId={channelId} />
```

### 절대 URL 설정
```tsx
// app/layout.tsx
export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL),
  // ...
};
```

## ⚡ 성능 최적화

### 동적 Import
```tsx
const ContentSidebar = dynamic(
  () => import('./ContentSidebar'),
  {
    ssr: false,
    loading: () => <SidebarSkeleton />
  }
);
```

### Prefetch 전략
- **기본**: `prefetch={false}` (수동 제어)
- **호버**: `onMouseEnter` 시 prefetch
- **뷰포트**: `prefetch={true}` (필요시)

### 이미지 최적화
```tsx
<Image
  src={content.thumbnailUrl}
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
  priority={true}  // 첫 화면 이미지
  placeholder="blur"
/>
```

## 📱 접근성 개선

### 포커스 관리
- 모달 열림: 첫 번째 포커스 가능 요소로 이동
- 모달 닫힘: 원래 포커스 위치 복원
- 포커스 트랩: Tab 키 순환

### 키보드 네비게이션
- ESC: 모달 닫기
- Tab/Shift+Tab: 포커스 순환
- Enter/Space: 버튼 활성화

### ARIA 레이블
```tsx
<Modal
  role="dialog"
  aria-modal="true"
  aria-label={content.title}
>
```

## 🧪 테스트

### 테스트 페이지
`/test/intercepting-routes` - 기본 기능 테스트

### 테스트 시나리오
1. 카드 클릭 → 모달 열림 (URL 변경)
2. ESC/오버레이 클릭 → 모달 닫힘
3. 브라우저 뒤로가기 → 모달 닫힘
4. 직접 링크 → 풀페이지 표시
5. 새 탭 열기 → 풀페이지 표시

## 🔄 마이그레이션 가이드

### 기존 코드 변경 최소화
```tsx
// AS-IS: 기존 모달 방식
<ContentsCard
  onCardClick={(card) => openModal(card)}
/>

// TO-BE: Link 기반 (기존 코드 재사용)
<ContentsCardLink
  channelId={channelId}
  {...existingProps}
/>
```

### 점진적 적용
1. 새로운 컴포넌트부터 `ContentsCardLink` 사용
2. 기존 컴포넌트는 필요시 점진적 변경
3. A/B 테스트로 사용자 반응 확인

## 🎯 추후 개선 사항

### Analytics 통합
```tsx
const { trackContentInteraction } = useContentAnalytics({
  contentId,
  channelId,
  variant: 'modal'
});
```

### 캐싱 전략
```tsx
export async function getContent(id: string) {
  return fetch(`/api/contents/${id}`, {
    next: { tags: [`content:${id}`], revalidate: 60 }
  });
}
```

### 다국어 지원
```tsx
alternates: {
  canonical: `/channels/${channelId}/contents/${contentId}`,
  languages: {
    'ko': `/ko/channels/${channelId}/contents/${contentId}`,
    'en': `/en/channels/${channelId}/contents/${contentId}`
  }
}
```

---

## 🚀 결론

Intercepting Routes 기반 접근법으로:
- ✅ 모달 UX 유지하면서 URL 일관성 확보
- ✅ SEO 최적화 (메타데이터, 구조화 데이터)
- ✅ 모바일 최적화 (직접 링크, 공유)
- ✅ 코드 재사용성 (기존 컴포넌트 최대 활용)
- ✅ 점진적 마이그레이션 (리스크 최소화)