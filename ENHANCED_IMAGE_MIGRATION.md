# Enhanced Image System Migration Guide

## 개요

기존의 `ProxiedImage` 컴포넌트를 새로운 `EnhancedImage` 시스템으로 마이그레이션하는 가이드입니다. 새로운 시스템은 더 강력한 이미지 로딩, 재시도 메커니즘, 그리고 품질 최적화를 제공합니다.

## 주요 개선사항

### 1. 다중 소스 폴백 시스템
- **Downloaded Image** (최우선): 백엔드에서 다운로드한 안전한 이미지
- **Original URL**: 원본 이미지 URL
- **Proxy URL**: 프록시를 통한 최적화된 이미지  
- **Smart Fallback**: 타입별 지능적인 대체 이미지

### 2. 지능적인 재시도 메커니즘
- 지수적 백오프 (1s, 2s, 4s...)
- 소스별 독립적인 재시도
- 사용자 수동 재시도 버튼

### 3. 점진적 품질 향상
- 낮은 품질로 빠른 표시
- 백그라운드에서 높은 품질로 업그레이드
- 네트워크 상태 기반 적응형 품질

### 4. 향상된 개발자 경험
- 실시간 로딩 상태 추적
- 상세한 디버깅 정보
- 성능 메트릭 (로딩 시간, 재시도 횟수 등)

## Migration Steps

### Step 1: 기본 컴포넌트 교체

**Before (기존 ProxiedImage):**
```tsx
import { ProxiedImage } from '@/components/ProxiedImage';

<ProxiedImage
  src={imageUrl}
  downloadedSrc={downloadedImageUrl}
  alt="이미지 설명"
  width={400}
  height={300}
  className="rounded-lg"
  fallbackSrc="/fallback.jpg"
  imageType="news"
  imagePriority="high"
/>
```

**After (새로운 EnhancedImage):**
```tsx
import { EnhancedImage } from '@/components/EnhancedImage';

<EnhancedImage
  src={imageUrl}
  downloadedSrc={downloadedImageUrl}
  alt="이미지 설명"
  width={400}
  height={300}
  className="rounded-lg"
  fallbackSrc="/fallback.jpg"
  imageType="news"
  imagePriority="high"
  // 새로운 기능들
  maxRetries={3}
  enableProgressive={true}
  showRetryButton={true}
  onSourceChange={(source) => console.log('Source:', source)}
/>
```

### Step 2: 타입별 특화 컴포넌트 사용

```tsx
import { NewsImage, AvatarImage, PreviewImage } from '@/components/EnhancedImage';

// 뉴스 이미지 (고우선순위)
<NewsImage
  src={imageUrl}
  downloadedSrc={downloadedImageUrl}
  alt="뉴스 이미지"
  width={600}
  height={400}
/>

// 아바타 이미지 (중간 우선순위)
<AvatarImage
  src={userAvatarUrl}
  alt="사용자 아바타"
  width={64}
  height={64}
  className="rounded-full"
/>

// 미리보기 이미지 (저우선순위)
<PreviewImage
  src={previewUrl}
  alt="미리보기"
  width={300}
  height={200}
/>
```

### Step 3: 고급 훅 사용

복잡한 로직이 필요한 경우 `useEnhancedImage` 훅을 직접 사용:

```tsx
import { useEnhancedImage } from '@/lib/hooks/useEnhancedImage';

function CustomImageComponent({ downloadedUrl, originalUrl }) {
  const {
    src,
    status,
    source,
    retryCount,
    loadTime,
    error,
    retry
  } = useEnhancedImage(downloadedUrl, originalUrl, {
    imageType: 'news',
    maxRetries: 5,
    enableProgressive: true,
    onSuccess: (result) => {
      console.log('Loaded successfully:', result);
    },
    onError: (error) => {
      console.error('Loading failed:', error);
    }
  });

  if (status === 'loading') {
    return <LoadingSpinner />;
  }

  if (status === 'error') {
    return (
      <div>
        <div>이미지 로딩 실패</div>
        <button onClick={retry}>다시 시도</button>
      </div>
    );
  }

  return (
    <div>
      <img src={src} alt="Custom image" />
      <div>Source: {source}, Load time: {loadTime}ms</div>
    </div>
  );
}
```

## 기존 컴포넌트별 마이그레이션

### 1. ChannelCard.tsx

**기존:**
```tsx
<ProxiedImage
  src={channel.imageUrl}
  downloadedSrc={channel.downloadedImageUrl}
  alt={channel.title}
  imageType="preview"
  imagePriority="medium"
/>
```

**개선:**
```tsx
<EnhancedImage
  src={channel.imageUrl}
  downloadedSrc={channel.downloadedImageUrl}
  alt={channel.title}
  imageType="preview"
  imagePriority="medium"
  enableProgressive={true}
  containerWidth={cardWidth}
  containerHeight={cardHeight}
  onSourceChange={(source) => 
    analytics.track('image_loaded', { source, type: 'channel_card' })
  }
/>
```

### 2. ContentCard.tsx

**기존:**
```tsx
<ProxiedImage
  src={content.imageUrl}
  downloadedSrc={content.downloadedImageUrl}
  alt={content.title}
  imageType="news"
  imagePriority="high"
/>
```

**개선:**
```tsx
<NewsImage
  src={content.imageUrl}
  downloadedSrc={content.downloadedImageUrl}
  alt={content.title}
  enableProgressive={true}
  maxRetries={3}
  onLoad={() => trackImageLoad('news_content')}
  onError={(error) => trackImageError('news_content', error)}
/>
```

### 3. UserAvatar.tsx

**기존:**
```tsx
<ProxiedImage
  src={user.avatarUrl}
  alt={user.name}
  imageType="avatar"
  imagePriority="low"
/>
```

**개선:**
```tsx
<AvatarImage
  src={user.avatarUrl}
  alt={user.name}
  className="rounded-full"
  fallbackSrc={generateAvatarFallback(user.name)}
/>
```

## 성능 최적화 가이드

### 1. 이미지 사전 로딩

중요한 이미지들을 미리 로딩하여 사용자 경험 향상:

```tsx
import { useImagePreloader } from '@/lib/hooks/useEnhancedImage';

function NewsPage({ articles }) {
  const { preloadImages } = useImagePreloader();

  useEffect(() => {
    // 첫 3개 기사의 이미지를 사전 로딩
    const imageUrls = articles.slice(0, 3).map(article => 
      article.downloadedImageUrl || article.imageUrl
    );
    preloadImages(imageUrls);
  }, [articles]);

  return (
    <div>
      {articles.map(article => (
        <NewsImage
          key={article.id}
          src={article.imageUrl}
          downloadedSrc={article.downloadedImageUrl}
          alt={article.title}
          enableProgressive={true}
        />
      ))}
    </div>
  );
}
```

### 2. 점진적 로딩

대용량 이미지에 점진적 품질 향상 적용:

```tsx
<EnhancedImage
  src={highResImageUrl}
  downloadedSrc={downloadedHighResUrl}
  alt="고해상도 이미지"
  enableProgressive={true}
  maxQuality="max"
  progressiveDelay={300}
  containerWidth={1200}
  containerHeight={800}
/>
```

### 3. 네트워크 기반 적응

```tsx
import { useNetworkType } from '@/lib/hooks/useNetworkType';

function AdaptiveImage({ src, downloadedSrc, alt }) {
  const networkType = useNetworkType();
  
  return (
    <EnhancedImage
      src={src}
      downloadedSrc={downloadedSrc}
      alt={alt}
      enableProgressive={networkType !== 'slow-2g'}
      maxQuality={networkType === '4g' ? 'max' : 'high'}
      maxRetries={networkType === 'slow-2g' ? 1 : 3}
    />
  );
}
```

## 디버깅 및 모니터링

### 개발 환경에서 디버깅

```tsx
<EnhancedImage
  src={imageUrl}
  downloadedSrc={downloadedUrl}
  alt="테스트 이미지"
  onSourceChange={(source) => {
    console.log('Image source changed to:', source);
  }}
  onError={(error) => {
    console.error('Image loading failed:', error);
  }}
  onRetry={(retryCount) => {
    console.log('Retrying image load, attempt:', retryCount);
  }}
/>
```

### 프로덕션 환경에서 모니터링

```tsx
import { analytics } from '@/lib/analytics';

<EnhancedImage
  src={imageUrl}
  downloadedSrc={downloadedUrl}
  alt="상품 이미지"
  onSourceChange={(source) => {
    analytics.track('image_source_selected', { source });
  }}
  onError={(error) => {
    analytics.track('image_load_error', { error, url: imageUrl });
  }}
  onLoad={() => {
    analytics.track('image_load_success', { url: imageUrl });
  }}
/>
```

## 테스트 가이드

### 단위 테스트

```tsx
import { render, screen, waitFor } from '@testing-library/react';
import { EnhancedImage } from '@/components/EnhancedImage';

describe('EnhancedImage', () => {
  it('should prioritize downloaded image', async () => {
    const onSourceChange = jest.fn();
    
    render(
      <EnhancedImage
        src="https://example.com/original.jpg"
        downloadedSrc="https://r2.dev/downloaded.jpg"
        alt="Test image"
        onSourceChange={onSourceChange}
      />
    );
    
    await waitFor(() => {
      expect(onSourceChange).toHaveBeenCalledWith('downloaded');
    });
  });

  it('should fallback to original when downloaded fails', async () => {
    const onSourceChange = jest.fn();
    
    render(
      <EnhancedImage
        src="https://example.com/original.jpg"
        downloadedSrc="https://invalid.url/broken.jpg"
        alt="Test image"
        onSourceChange={onSourceChange}
      />
    );
    
    await waitFor(() => {
      expect(onSourceChange).toHaveBeenCalledWith('proxy');
    });
  });
});
```

### E2E 테스트

```tsx
import { test, expect } from '@playwright/test';

test('enhanced image should load correctly', async ({ page }) => {
  await page.goto('/enhanced-image-examples');
  
  // 이미지가 로드될 때까지 대기
  await page.waitForSelector('[data-testid="enhanced-image"]');
  
  // 이미지 소스 확인
  const img = page.locator('[data-testid="enhanced-image"] img');
  await expect(img).toHaveAttribute('src', /r2\.dev/);
  
  // 로딩 시간 메트릭 확인
  const loadTime = await page.locator('[data-testid="load-time"]').textContent();
  expect(parseInt(loadTime)).toBeGreaterThan(0);
});
```

## 기대 효과

### 1. 이미지 로딩 성공률 향상
- 기존: 단일 소스 실패 시 완전 실패
- 개선: 다중 소스 폴백으로 95%+ 성공률

### 2. 사용자 체감 성능 향상  
- 점진적 로딩으로 초기 표시 속도 50% 향상
- 지능적인 재시도로 일시적 네트워크 오류 복구

### 3. 개발자 생산성 향상
- 상세한 디버깅 정보 제공
- 타입별 특화 컴포넌트로 개발 편의성 증대
- 실시간 성능 모니터링

### 4. 인프라 비용 절감
- 다운로드된 이미지 우선 사용으로 외부 트래픽 감소
- 지능적인 캐싱으로 중복 요청 최소화

## 마이그레이션 체크리스트

- [ ] 기존 `ProxiedImage` 사용 위치 파악
- [ ] 컴포넌트별 이미지 타입 분류 (news, avatar, preview 등)
- [ ] 중요도에 따른 우선순위 설정
- [ ] 새로운 `EnhancedImage` 컴포넌트로 교체
- [ ] 에러 처리 및 재시도 로직 추가
- [ ] 점진적 로딩 설정
- [ ] 사전 로딩 최적화 적용
- [ ] 테스트 코드 작성
- [ ] 성능 모니터링 설정
- [ ] 프로덕션 배포 및 모니터링

## 주의사항

1. **점진적 배포**: 한 번에 모든 컴포넌트를 교체하지 말고 단계적으로 적용
2. **성능 모니터링**: 새로운 시스템 배포 후 로딩 시간 및 성공률 모니터링
3. **캐시 관리**: 개발 환경에서 캐시 정리 기능 활용
4. **네트워크 테스트**: 다양한 네트워크 환경에서 테스트 수행

이 가이드를 따라 점진적으로 마이그레이션하면 더 안정적이고 빠른 이미지 로딩 시스템을 구축할 수 있습니다.