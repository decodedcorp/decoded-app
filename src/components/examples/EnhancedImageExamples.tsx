'use client';

import React, { useState } from 'react';
import { EnhancedImage, NewsImage, AvatarImage, PreviewImage } from '../EnhancedImage';
import { useEnhancedImage, useImagePreloader } from '@/lib/hooks/useEnhancedImage';
import { clearImageCache } from '@/lib/utils/enhancedImageLoader';

/**
 * EnhancedImage 컴포넌트 사용 예제
 * 
 * 이 파일은 개발/테스트 목적으로 생성되었으며,
 * 실제 프로덕션에서는 제거하거나 별도의 개발 환경에서만 사용해야 합니다.
 */

// 테스트용 이미지 URL들
const TEST_IMAGES = {
  // 다운로드된 이미지 (R2 CDN)
  downloaded: 'https://pub-83c5db439b40468498f97946200806f7.r2.dev/sample-news-1.jpg',
  
  // 원본 이미지 URL들
  original: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800',
  
  // 실패할 것으로 예상되는 URL (테스트용)
  broken: 'https://example.com/non-existent-image.jpg',
  
  // 한국 뉴스 사이트 이미지
  news: 'https://imgnews.pstatic.net/image/001/2024/01/15/PYH2024011507370001300_P4.jpg',
  
  // 소셜 미디어 이미지
  social: 'https://pbs.twimg.com/media/sample.jpg',
};

export default function EnhancedImageExamples() {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const { preloadImages, isPreloading, preloadedUrls } = useImagePreloader();

  // 기본 사용법 예제
  const BasicExample = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">기본 사용법</h3>
      
      {/* 다운로드된 이미지가 있는 경우 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h4 className="text-sm font-medium text-zinc-300 mb-2">다운로드된 이미지 우선 사용</h4>
          <EnhancedImage
            src={TEST_IMAGES.original}
            downloadedSrc={TEST_IMAGES.downloaded}
            alt="다운로드된 이미지 예제"
            width={400}
            height={300}
            className="rounded-lg border border-zinc-700"
            onSourceChange={(source) => console.log('Source changed to:', source)}
          />
        </div>

        <div>
          <h4 className="text-sm font-medium text-zinc-300 mb-2">원본 이미지만 사용</h4>
          <EnhancedImage
            src={TEST_IMAGES.original}
            alt="원본 이미지 예제"
            width={400}
            height={300}
            className="rounded-lg border border-zinc-700"
          />
        </div>
      </div>
    </div>
  );

  // 타입별 이미지 예제
  const TypeSpecificExample = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">타입별 특화 컴포넌트</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <h4 className="text-sm font-medium text-zinc-300 mb-2">뉴스 이미지 (고우선순위)</h4>
          <NewsImage
            src={TEST_IMAGES.news}
            alt="뉴스 이미지"
            width={300}
            height={200}
            className="rounded-lg border border-zinc-700"
          />
        </div>

        <div>
          <h4 className="text-sm font-medium text-zinc-300 mb-2">아바타 이미지</h4>
          <AvatarImage
            src={TEST_IMAGES.social}
            alt="아바타 이미지"
            width={300}
            height={200}
            className="rounded-lg border border-zinc-700"
          />
        </div>

        <div>
          <h4 className="text-sm font-medium text-zinc-300 mb-2">미리보기 이미지 (저우선순위)</h4>
          <PreviewImage
            src={TEST_IMAGES.original}
            alt="미리보기 이미지"
            width={300}
            height={200}
            className="rounded-lg border border-zinc-700"
          />
        </div>
      </div>
    </div>
  );

  // 에러 처리 예제
  const ErrorHandlingExample = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">에러 처리 & 재시도</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h4 className="text-sm font-medium text-zinc-300 mb-2">실패하는 이미지 (재시도 버튼 표시)</h4>
          <EnhancedImage
            src={TEST_IMAGES.broken}
            alt="실패하는 이미지"
            width={400}
            height={300}
            className="rounded-lg border border-zinc-700"
            showRetryButton={true}
            maxRetries={2}
            onError={(error) => console.error('Image failed:', error)}
            onRetry={(retryCount) => console.log('Retrying...', retryCount)}
          />
        </div>

        <div>
          <h4 className="text-sm font-medium text-zinc-300 mb-2">fallback 이미지 포함</h4>
          <EnhancedImage
            src={TEST_IMAGES.broken}
            fallbackSrc="/placeholder-news.jpg"
            alt="fallback이 있는 이미지"
            width={400}
            height={300}
            className="rounded-lg border border-zinc-700"
            imageType="news"
          />
        </div>
      </div>
    </div>
  );

  // 고급 기능 예제
  const AdvancedExample = () => {
    const {
      src,
      status,
      source,
      retryCount,
      loadTime,
      error,
    } = useEnhancedImage(
      TEST_IMAGES.downloaded,
      TEST_IMAGES.original,
      {
        imageType: 'news',
        containerWidth: 500,
        containerHeight: 300,
        enableProgressive: true,
        maxRetries: 3,
        onSuccess: (result) => {
          console.log('Advanced image loaded:', result);
        },
      }
    );

    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">고급 기능 (useEnhancedImage 훅)</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="text-sm font-medium text-zinc-300 mb-2">고급 훅 사용</h4>
            {src ? (
              <img
                src={src}
                alt="Advanced hook example"
                className="w-full h-48 object-cover rounded-lg border border-zinc-700"
              />
            ) : (
              <div className="w-full h-48 bg-zinc-800/30 border border-zinc-700/30 rounded-lg flex items-center justify-center">
                <div className="text-zinc-400">로딩 중...</div>
              </div>
            )}
          </div>

          <div>
            <h4 className="text-sm font-medium text-zinc-300 mb-2">로딩 상태 정보</h4>
            <div className="text-sm text-zinc-400 space-y-1 bg-zinc-900/50 p-3 rounded border border-zinc-700">
              <div>상태: <span className="text-white">{status}</span></div>
              <div>소스: <span className="text-white">{source || 'N/A'}</span></div>
              <div>재시도 횟수: <span className="text-white">{retryCount}</span></div>
              <div>로딩 시간: <span className="text-white">{loadTime ? `${loadTime}ms` : 'N/A'}</span></div>
              {error && <div>에러: <span className="text-red-400">{error}</span></div>}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // 사전 로딩 예제
  const PreloadingExample = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">이미지 사전 로딩</h3>
      
      <div className="flex flex-col space-y-4">
        <div className="flex space-x-4">
          <button
            onClick={() => preloadImages([TEST_IMAGES.original, TEST_IMAGES.news])}
            disabled={isPreloading}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded transition-colors"
          >
            {isPreloading ? '사전 로딩 중...' : '이미지 사전 로딩'}
          </button>
          
          <button
            onClick={() => clearImageCache()}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
          >
            캐시 정리
          </button>
        </div>

        <div className="text-sm text-zinc-400">
          사전 로딩된 이미지: {preloadedUrls.size}개
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <EnhancedImage
            src={TEST_IMAGES.original}
            alt="사전 로딩 테스트 1"
            width={400}
            height={300}
            className="rounded-lg border border-zinc-700"
            enablePreload={true}
          />
          
          <EnhancedImage
            src={TEST_IMAGES.news}
            alt="사전 로딩 테스트 2"
            width={400}
            height={300}
            className="rounded-lg border border-zinc-700"
            enablePreload={true}
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Enhanced Image System</h1>
          <p className="text-zinc-400">AI 생성 콘텐츠용 강화된 이미지 로딩 시스템</p>
        </div>

        <BasicExample />
        <TypeSpecificExample />
        <ErrorHandlingExample />
        <PreloadingExample />

        <div className="border-t border-zinc-800 pt-8">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="mb-4 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded transition-colors"
          >
            {showAdvanced ? '고급 예제 숨기기' : '고급 예제 보기'}
          </button>
          
          {showAdvanced && <AdvancedExample />}
        </div>

        <div className="bg-zinc-900/50 p-4 rounded-lg border border-zinc-700">
          <h3 className="text-lg font-semibold mb-2">주요 기능</h3>
          <ul className="text-sm text-zinc-300 space-y-1">
            <li>• 다운로드된 이미지 우선 사용 (백엔드 처리된 안전한 URL)</li>
            <li>• 지능적인 fallback 시스템 (여러 소스 자동 시도)</li>
            <li>• 재시도 메커니즘 (지수적 백오프)</li>
            <li>• 점진적 품질 향상 (낮은 품질 → 높은 품질)</li>
            <li>• 타입별 최적화 (뉴스, 아바타, 미리보기 등)</li>
            <li>• 이미지 사전 로딩 및 캐싱</li>
            <li>• 네트워크 상태 기반 적응형 로딩</li>
            <li>• 개발 환경에서 디버깅 정보 제공</li>
          </ul>
        </div>
      </div>
    </div>
  );
}