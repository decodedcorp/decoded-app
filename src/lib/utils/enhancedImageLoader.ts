/**
 * Enhanced Image Loading System
 * 강화된 이미지 로딩 시스템 - AI 생성 콘텐츠용 최적화
 */

import { getProxiedImageUrl, type ImageSize, type ImageQuality } from './imageProxy';
import { getSmartFallback } from './defaultImages';

export type ImageSource = 'downloaded' | 'original' | 'proxy' | 'fallback';
export type ImageStatus = 'loading' | 'success' | 'error' | 'retrying';
export type ImagePriority = 'high' | 'medium' | 'low';

export interface ImageSourceConfig {
  url: string;
  source: ImageSource;
  priority: number;
  quality: ImageQuality;
  size?: ImageSize;
}

export interface ImageLoadingOptions {
  downloadedUrl?: string; // 백엔드 다운로드 URL (최우선)
  originalUrl: string;    // 원본 URL
  fallbackUrl?: string;   // 커스텀 fallback
  imageType?: 'news' | 'avatar' | 'logo' | 'preview' | 'general';
  containerWidth?: number;
  containerHeight?: number;
  priority?: ImagePriority;
  maxRetries?: number;
  retryDelay?: number;
  preload?: boolean;
  enableProgressive?: boolean;
}

export interface ImageLoadResult {
  url: string;
  source: ImageSource;
  status: ImageStatus;
  retryCount: number;
  loadTime?: number;
  error?: string;
}

class EnhancedImageLoader {
  private cache = new Map<string, ImageLoadResult>();
  private loadingPromises = new Map<string, Promise<ImageLoadResult>>();
  private retryTimeouts = new Map<string, NodeJS.Timeout>();
  
  /**
   * 이미지 소스들을 우선순위대로 정렬
   */
  private createImageSources(options: ImageLoadingOptions): ImageSourceConfig[] {
    const sources: ImageSourceConfig[] = [];
    const { downloadedUrl, originalUrl, fallbackUrl, imageType, containerWidth, containerHeight } = options;
    
    // 1순위: 다운로드된 이미지 (백엔드에서 처리됨)
    if (downloadedUrl && downloadedUrl.trim()) {
      sources.push({
        url: downloadedUrl,
        source: 'downloaded',
        priority: 1,
        quality: 'max', // 다운로드된 이미지는 최고 품질
      });
    }
    
    // 2순위: R2/CDN 직접 접근 (프록시 우회)
    if (this.isDirectAccessible(originalUrl)) {
      sources.push({
        url: originalUrl,
        source: 'original',
        priority: 2,
        quality: 'high',
      });
    }
    
    // 3순위: 프록시를 통한 원본 이미지 (품질 우선 설정)
    if (originalUrl) {
      const size = this.getOptimalSize(containerWidth, containerHeight);
      sources.push({
        url: originalUrl,
        source: 'proxy',
        priority: 3,
        quality: 'max', // high -> max로 품질 향상
        size,
      });
    }
    
    // 4순위: 원본 URL 직접 시도 (프록시 우회)
    if (originalUrl) {
      sources.push({
        url: originalUrl,
        source: 'original',
        priority: 4,
        quality: 'max',
      });
    }
    
    // 5순위: Fallback 이미지
    const fallback = fallbackUrl || getSmartFallback(
      imageType || 'general',
      containerWidth || 300,
      containerHeight || 200
    );
    if (fallback) {
      sources.push({
        url: fallback,
        source: 'fallback',
        priority: 5,
        quality: 'high', // medium -> high로 품질 향상
      });
    }
    
    return sources.sort((a, b) => a.priority - b.priority);
  }
  
  /**
   * 직접 접근 가능한 URL인지 확인 (CDN, R2 등)
   */
  private isDirectAccessible(url: string): boolean {
    if (!url) return false;
    
    try {
      const urlObj = new URL(url);
      const hostname = urlObj.hostname.toLowerCase();
      
      // R2/Cloudflare 도메인
      if (hostname.includes('.r2.dev') || hostname.includes('r2.cloudflarestorage.com')) {
        return true;
      }
      
      // 기타 신뢰할 수 있는 CDN들
      const trustedCdns = [
        'images.unsplash.com',
        'cdn.pixabay.com',
        'images.pexels.com',
        'amazonaws.com',
        'googleusercontent.com',
        'cloudinary.com',
      ];
      
      return trustedCdns.some(cdn => hostname.includes(cdn));
    } catch {
      return false;
    }
  }
  
  /**
   * 컨테이너 크기에 맞는 최적 이미지 크기 결정
   */
  private getOptimalSize(width?: number, height?: number): ImageSize {
    const maxDimension = Math.max(width || 0, height || 0);
    
    if (maxDimension <= 300) return 'small';
    if (maxDimension <= 600) return 'medium';
    if (maxDimension <= 1200) return 'large';
    return 'original';
  }
  
  /**
   * 이미지 로딩 시도 (향상된 에러 처리)
   */
  private async loadImageFromSource(config: ImageSourceConfig): Promise<ImageLoadResult> {
    const startTime = Date.now();
    
    return new Promise((resolve) => {
      const img = new Image();
      let hasResolved = false;
      
      const resolveOnce = (result: ImageLoadResult) => {
        if (!hasResolved) {
          hasResolved = true;
          resolve(result);
        }
      };
      
      // 타임아웃 설정 (10초)
      const timeout = setTimeout(() => {
        resolveOnce({
          url: config.url,
          source: config.source,
          status: 'error',
          retryCount: 0,
          error: `Timeout loading ${config.source} image (10s)`,
        });
      }, 10000);
      
      img.onload = () => {
        clearTimeout(timeout);
        const finalUrl = config.source === 'proxy' ? getProxiedImageUrl(config.url, {
          size: config.size,
          quality: config.quality,
          format: 'original', // webp -> original로 변경하여 품질 저하 방지
        }) : config.url;
        
        resolveOnce({
          url: finalUrl,
          source: config.source,
          status: 'success',
          retryCount: 0,
          loadTime: Date.now() - startTime,
        });
      };
      
      img.onerror = (event) => {
        clearTimeout(timeout);
        const errorMessage = this.getDetailedErrorMessage(config, event);
        
        resolveOnce({
          url: config.url,
          source: config.source,
          status: 'error',
          retryCount: 0,
          error: errorMessage,
        });
      };
      
      // CORS 설정
      img.crossOrigin = 'anonymous';
      
      // 실제 이미지 URL 설정
      try {
        if (config.source === 'proxy') {
          img.src = getProxiedImageUrl(config.url, {
            size: config.size,
            quality: config.quality,
            format: 'original', // webp -> original로 변경하여 품질 저하 방지
          });
        } else {
          img.src = config.url;
        }
      } catch (error) {
        clearTimeout(timeout);
        resolveOnce({
          url: config.url,
          source: config.source,
          status: 'error',
          retryCount: 0,
          error: `Failed to set image source: ${error instanceof Error ? error.message : 'Unknown error'}`,
        });
      }
    });
  }
  
  /**
   * 상세한 에러 메시지 생성
   */
  private getDetailedErrorMessage(config: ImageSourceConfig, event: any): string {
    const baseMessage = `Failed to load ${config.source} image`;
    
    if (config.source === 'proxy') {
      return `${baseMessage} (proxy may be blocked or server error)`;
    }
    
    if (config.source === 'original') {
      return `${baseMessage} (CORS or domain restriction)`;
    }
    
    if (config.source === 'downloaded') {
      return `${baseMessage} (downloaded file may be corrupted or moved)`;
    }
    
    return `${baseMessage} (network error or invalid URL)`;
  }
  
  /**
   * 재시도 로직이 포함된 이미지 로딩
   */
  private async loadWithRetry(
    config: ImageSourceConfig,
    maxRetries: number = 3, // 2 -> 3으로 재시도 횟수 증가
    baseDelay: number = 800  // 1000 -> 800으로 지연 시간 단축
  ): Promise<ImageLoadResult> {
    let retryCount = 0;
    let lastError: string = '';
    
    while (retryCount <= maxRetries) {
      try {
        const result = await this.loadImageFromSource(config);
        
        if (result.status === 'success') {
          result.retryCount = retryCount;
          return result;
        }
        
        lastError = result.error || 'Unknown error';
      } catch (error) {
        lastError = error instanceof Error ? error.message : 'Loading failed';
      }
      
      retryCount++;
      
      // 마지막 시도가 아니라면 대기
      if (retryCount <= maxRetries) {
        const delay = baseDelay * Math.pow(2, retryCount - 1); // 지수적 백오프
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    // 모든 재시도 실패
    return {
      url: config.url,
      source: config.source,
      status: 'error',
      retryCount: maxRetries,
      error: `Failed after ${maxRetries} retries: ${lastError}`,
    };
  }
  
  /**
   * 이미지 사전 로딩
   */
  async preloadImage(url: string): Promise<boolean> {
    if (this.cache.has(url)) {
      return this.cache.get(url)!.status === 'success';
    }
    
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        this.cache.set(url, {
          url,
          source: 'original',
          status: 'success',
          retryCount: 0,
        });
        resolve(true);
      };
      img.onerror = () => resolve(false);
      img.src = url;
    });
  }
  
  /**
   * 메인 로딩 함수
   */
  async loadImage(options: ImageLoadingOptions): Promise<ImageLoadResult> {
    const cacheKey = this.getCacheKey(options);
    
    // 캐시 확인
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey)!;
      if (cached.status === 'success' || cached.status === 'error') {
        return cached;
      }
    }
    
    // 이미 로딩 중인 요청 확인
    if (this.loadingPromises.has(cacheKey)) {
      return this.loadingPromises.get(cacheKey)!;
    }
    
    // 새로운 로딩 시작
    const loadingPromise = this.performLoad(options);
    this.loadingPromises.set(cacheKey, loadingPromise);
    
    try {
      const result = await loadingPromise;
      this.cache.set(cacheKey, result);
      return result;
    } finally {
      this.loadingPromises.delete(cacheKey);
    }
  }
  
  /**
   * 실제 로딩 수행
   */
  private async performLoad(options: ImageLoadingOptions): Promise<ImageLoadResult> {
    const sources = this.createImageSources(options);
    const { maxRetries = 3, retryDelay = 800, preload = false } = options; // 기본값 개선
    
    // 사전 로딩 (옵션)
    if (preload && sources.length > 1) {
      // 백그라운드에서 다음 소스들을 미리 로딩
      sources.slice(1, 3).forEach(source => {
        setTimeout(() => this.preloadImage(source.url), 100);
      });
    }
    
    // 순차적으로 소스들 시도
    for (const source of sources) {
      const result = await this.loadWithRetry(source, maxRetries, retryDelay);
      
      if (result.status === 'success') {
        return result;
      }
      
      // 로그 출력 (개발 환경에서만)
      if (process.env.NODE_ENV === 'development') {
        console.warn(
          `[EnhancedImageLoader] ${source.source} failed:`,
          result.error
        );
      }
    }
    
    // 모든 소스가 실패한 경우 - 기본 placeholder를 대신 사용
    const placeholderUrl = getSmartFallback('general', 300, 200);
    return {
      url: placeholderUrl || options.originalUrl,
      source: 'fallback',
      status: 'error',
      retryCount: maxRetries,
      error: 'All image sources failed to load, using placeholder',
    };
  }
  
  /**
   * 캐시 키 생성
   */
  private getCacheKey(options: ImageLoadingOptions): string {
    const {
      downloadedUrl,
      originalUrl,
      fallbackUrl,
      containerWidth,
      containerHeight,
      priority,
    } = options;
    
    return JSON.stringify({
      downloadedUrl,
      originalUrl,
      fallbackUrl,
      containerWidth,
      containerHeight,
      priority,
    });
  }
  
  /**
   * 캐시 정리
   */
  clearCache(): void {
    this.cache.clear();
    this.loadingPromises.clear();
    
    // 타임아웃 정리
    this.retryTimeouts.forEach(timeout => clearTimeout(timeout));
    this.retryTimeouts.clear();
  }
  
  /**
   * 캐시 상태 확인
   */
  getCacheStats(): { size: number; loading: number } {
    return {
      size: this.cache.size,
      loading: this.loadingPromises.size,
    };
  }
}

// 전역 인스턴스
export const enhancedImageLoader = new EnhancedImageLoader();

// 편의 함수들
export async function loadOptimizedImage(
  downloadedUrl: string | undefined,
  originalUrl: string,
  options?: Partial<ImageLoadingOptions>
): Promise<ImageLoadResult> {
  return enhancedImageLoader.loadImage({
    downloadedUrl,
    originalUrl,
    ...options,
  });
}

export function preloadImages(urls: string[]): Promise<boolean[]> {
  return Promise.all(urls.map(url => enhancedImageLoader.preloadImage(url)));
}

export function clearImageCache(): void {
  enhancedImageLoader.clearCache();
}