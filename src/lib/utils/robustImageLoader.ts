/**
 * Robust Image Loading System
 * 견고한 이미지 로딩 시스템 - 모든 실패 상황을 처리
 */

import { enhancedImageLoader, type ImageLoadingOptions, type ImageLoadResult } from './enhancedImageLoader';
import { getSmartFallback } from './defaultImages';

export interface RobustImageOptions extends ImageLoadingOptions {
  enableDomainRotation?: boolean;
  enableFormatFallback?: boolean;
  enableCorsWorkaround?: boolean;
  customFallbacks?: string[];
}

export class RobustImageLoader {
  private static domainAlternatives = new Map<string, string[]>([
    // Instagram alternatives
    ['scontent-ssn1-1.cdninstagram.com', [
      'scontent.cdninstagram.com',
      'instagram.com',
    ]],
    // News site alternatives
    ['image.imnews.imbc.com', [
      'img.imbc.com',
      'news.imbc.com/images',
    ]],
    ['cdn.kstarfashion.com', [
      'kstarfashion.com',
      'img.kstarfashion.com',
    ]],
  ]);

  /**
   * 견고한 이미지 로딩
   */
  static async loadWithFullFallback(options: RobustImageOptions): Promise<ImageLoadResult> {
    const {
      downloadedUrl,
      originalUrl,
      fallbackUrl,
      enableDomainRotation = true,
      enableFormatFallback = true,
      enableCorsWorkaround = true,
      customFallbacks = [],
      ...restOptions
    } = options;

    // 1단계: 기본 로딩 시도
    try {
      const result = await enhancedImageLoader.loadImage(options);
      if (result.status === 'success') {
        return result;
      }
    } catch (error) {
      console.warn('[RobustImageLoader] Basic loading failed:', error);
    }

    // 2단계: 도메인 대안 시도
    if (enableDomainRotation && originalUrl) {
      const alternativeResults = await this.tryDomainAlternatives(originalUrl, restOptions);
      const successResult = alternativeResults.find(r => r.status === 'success');
      if (successResult) {
        return successResult;
      }
    }

    // 3단계: CORS 우회 시도
    if (enableCorsWorkaround) {
      const corsResult = await this.tryCorsWorkaround(originalUrl, restOptions);
      if (corsResult && corsResult.status === 'success') {
        return corsResult;
      }
    }

    // 4단계: 커스텀 fallback 시도
    if (customFallbacks.length > 0) {
      for (const fallbackUrl of customFallbacks) {
        try {
          const result = await enhancedImageLoader.loadImage({
            ...restOptions,
            originalUrl: fallbackUrl,
          });
          if (result.status === 'success') {
            return { ...result, source: 'fallback' as any };
          }
        } catch (error) {
          console.warn('[RobustImageLoader] Custom fallback failed:', fallbackUrl, error);
        }
      }
    }

    // 5단계: 스마트 fallback 시도
    const smartFallback = getSmartFallback(
      options.imageType || 'general',
      options.containerWidth || 400,
      options.containerHeight || 300
    );

    if (smartFallback) {
      try {
        const result = await enhancedImageLoader.loadImage({
          ...restOptions,
          originalUrl: smartFallback,
        });
        if (result.status === 'success') {
          return { ...result, source: 'fallback' as any };
        }
      } catch (error) {
        console.warn('[RobustImageLoader] Smart fallback failed:', error);
      }
    }

    // 6단계: 마지막 수단 - 로컬 placeholder
    return this.getLocalPlaceholder(options);
  }

  /**
   * 도메인 대안들 시도
   */
  private static async tryDomainAlternatives(
    originalUrl: string,
    options: Partial<ImageLoadingOptions>
  ): Promise<ImageLoadResult[]> {
    const results: ImageLoadResult[] = [];

    try {
      const url = new URL(originalUrl);
      const alternatives = this.domainAlternatives.get(url.hostname) || [];

      for (const altDomain of alternatives) {
        try {
          const alternativeUrl = originalUrl.replace(url.hostname, altDomain);
          const result = await enhancedImageLoader.loadImage({
            ...options,
            originalUrl: alternativeUrl,
            maxRetries: 1, // 빠른 시도
          });
          results.push(result);

          if (result.status === 'success') {
            break; // 성공하면 중단
          }
        } catch (error) {
          console.warn('[RobustImageLoader] Alternative domain failed:', altDomain, error);
        }
      }
    } catch (error) {
      console.warn('[RobustImageLoader] Domain alternatives failed:', error);
    }

    return results;
  }

  /**
   * CORS 우회 시도
   */
  private static async tryCorsWorkaround(
    originalUrl: string,
    options: Partial<ImageLoadingOptions>
  ): Promise<ImageLoadResult | null> {
    // 다양한 CORS 우회 방법들 시도
    const corsWorkarounds = [
      // 1. 프록시 서버를 통한 우회 (이미 시도했지만 다른 파라미터로)
      () => enhancedImageLoader.loadImage({
        ...options,
        originalUrl: `/api/proxy/image?url=${encodeURIComponent(originalUrl)}&format=original&quality=max`,
        maxRetries: 1,
      }),
      
      // 2. 다른 포맷으로 시도
      () => enhancedImageLoader.loadImage({
        ...options,
        originalUrl: `/api/proxy/image?url=${encodeURIComponent(originalUrl)}&format=jpeg&quality=high`,
        maxRetries: 1,
      }),
      
      // 3. 작은 사이즈로 시도
      () => enhancedImageLoader.loadImage({
        ...options,
        originalUrl: `/api/proxy/image?url=${encodeURIComponent(originalUrl)}&size=small&format=original`,
        maxRetries: 1,
      }),
    ];

    for (const workaround of corsWorkarounds) {
      try {
        const result = await workaround();
        if (result.status === 'success') {
          return result;
        }
      } catch (error) {
        console.warn('[RobustImageLoader] CORS workaround failed:', error);
      }
    }

    return null;
  }

  /**
   * 로컬 placeholder 반환
   */
  private static getLocalPlaceholder(options: RobustImageOptions): ImageLoadResult {
    const { imageType = 'general', containerWidth = 400, containerHeight = 300 } = options;
    
    // SVG placeholder 생성
    const svgPlaceholder = this.createSvgPlaceholder(containerWidth, containerHeight, imageType);
    
    return {
      url: svgPlaceholder,
      source: 'fallback' as any,
      status: 'success',
      retryCount: 0,
      loadTime: 0,
    };
  }

  /**
   * SVG placeholder 생성
   */
  private static createSvgPlaceholder(width: number, height: number, type: string): string {
    const icons = {
      news: `<path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>`,
      avatar: `<path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>`,
      logo: `<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>`,
      preview: `<path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>`,
      general: `<path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>`,
    };

    const icon = icons[type as keyof typeof icons] || icons.general;
    const color = '#64748b'; // zinc-500
    const bgColor = '#18181b'; // zinc-900
    
    const svg = `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <rect width="100%" height="100%" fill="${bgColor}" rx="4"/>
        <g transform="translate(${width/2 - 12}, ${height/2 - 12})">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="${color}">
            ${icon}
          </svg>
        </g>
        <text x="50%" y="75%" text-anchor="middle" fill="${color}" font-family="system-ui, sans-serif" font-size="12" opacity="0.8">
          이미지를 불러올 수 없습니다
        </text>
      </svg>
    `;

    return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`;
  }

  /**
   * 이미지 URL의 건강 상태 확인
   */
  static async checkImageHealth(url: string): Promise<boolean> {
    try {
      const response = await fetch(url, { 
        method: 'HEAD',
        mode: 'no-cors',
        signal: AbortSignal.timeout(5000)
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  /**
   * 대량 이미지 health check
   */
  static async checkBatchImageHealth(urls: string[]): Promise<Map<string, boolean>> {
    const results = new Map<string, boolean>();
    
    const checks = urls.map(async (url) => {
      const isHealthy = await this.checkImageHealth(url);
      results.set(url, isHealthy);
      return { url, isHealthy };
    });

    await Promise.allSettled(checks);
    return results;
  }
}

// 편의 함수들
export async function loadRobustImage(
  downloadedUrl: string | undefined,
  originalUrl: string,
  options?: Partial<RobustImageOptions>
) {
  return RobustImageLoader.loadWithFullFallback({
    downloadedUrl,
    originalUrl,
    enableDomainRotation: true,
    enableFormatFallback: true,
    enableCorsWorkaround: true,
    ...options,
  });
}

export async function preloadRobustImages(urls: string[]) {
  const healthCheck = await RobustImageLoader.checkBatchImageHealth(urls);
  const healthyUrls = urls.filter(url => healthCheck.get(url));
  
  return Promise.all(
    healthyUrls.map(url => loadRobustImage(undefined, url, { preload: true }))
  );
}