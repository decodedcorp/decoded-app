/**
 * Advanced Image Loading System
 * 고급 이미지 로딩 시스템 - 품질 최우선 설정
 */

import { enhancedImageLoader, type ImageLoadResult } from './enhancedImageLoader';

export interface AdvancedImageOptions {
  downloadedUrl?: string;
  originalUrl: string;
  fallbackUrl?: string;
  imageType?: 'news' | 'avatar' | 'logo' | 'preview' | 'general';
  priority?: 'high' | 'medium' | 'low';
  containerWidth?: number;
  containerHeight?: number;
  enableQualityUpgrade?: boolean;
  enableSmartRetry?: boolean;
  maxRetries?: number;
  retryDelay?: number;
}

export class AdvancedImageLoader {
  private static qualityUpgradeTimeouts = new Map<string, NodeJS.Timeout>();
  private static loadAttempts = new Map<string, number>();

  /**
   * 품질 우선 로딩 전략
   */
  static async loadWithQualityPriority(options: AdvancedImageOptions): Promise<ImageLoadResult> {
    const {
      downloadedUrl,
      originalUrl,
      fallbackUrl,
      imageType = 'general',
      priority = 'medium',
      containerWidth,
      containerHeight,
      enableQualityUpgrade = true,
      enableSmartRetry = true,
      maxRetries = 4,
      retryDelay = 800,
    } = options;

    // 캐시 키 생성
    const cacheKey = this.generateCacheKey(options);

    try {
      // 첫 번째 시도
      const result = await enhancedImageLoader.loadImage({
        downloadedUrl,
        originalUrl,
        fallbackUrl,
        imageType,
        priority,
        containerWidth,
        containerHeight,
        maxRetries,
        retryDelay,
        enableProgressive: true,
      });

      if (result.status === 'success') {
        // 성공 시 품질 업그레이드 시도 (백그라운드)
        if (enableQualityUpgrade && result.source !== 'downloaded') {
          this.scheduleQualityUpgrade(options, result);
        }

        this.loadAttempts.delete(cacheKey);
        return result;
      }

      // 실패 시 스마트 재시도
      if (enableSmartRetry) {
        return this.performSmartRetry(options, cacheKey);
      }

      return result;
    } catch (error) {
      console.error('[AdvancedImageLoader] Loading failed:', error);

      if (enableSmartRetry) {
        return this.performSmartRetry(options, cacheKey);
      }

      throw error;
    }
  }

  /**
   * 스마트 재시도 로직
   */
  private static async performSmartRetry(
    options: AdvancedImageOptions,
    cacheKey: string,
  ): Promise<ImageLoadResult> {
    const currentAttempts = this.loadAttempts.get(cacheKey) || 0;
    const maxSmartRetries = 3;

    if (currentAttempts >= maxSmartRetries) {
      this.loadAttempts.delete(cacheKey);
      throw new Error(`Max smart retry attempts (${maxSmartRetries}) reached`);
    }

    this.loadAttempts.set(cacheKey, currentAttempts + 1);

    // 재시도 전 네트워크 상태 확인
    const isOnline = navigator.onLine;
    if (!isOnline) {
      // 오프라인인 경우 잠시 대기 후 재시도
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }

    // 품질을 한 단계 낮춰서 재시도
    const fallbackOptions = {
      ...options,
      enableQualityUpgrade: false, // 재시도에서는 품질 업그레이드 비활성화
      maxRetries: 2, // 재시도에서는 횟수 줄임
    };

    return this.loadWithQualityPriority(fallbackOptions);
  }

  /**
   * 품질 업그레이드 스케줄링
   */
  private static scheduleQualityUpgrade(options: AdvancedImageOptions, initialResult: any) {
    const cacheKey = this.generateCacheKey(options);

    // 기존 타임아웃 정리
    const existingTimeout = this.qualityUpgradeTimeouts.get(cacheKey);
    if (existingTimeout) {
      clearTimeout(existingTimeout);
    }

    // 1초 후 품질 업그레이드 시도
    const timeout = setTimeout(async () => {
      try {
        // 다운로드된 이미지가 있다면 그것을 우선 시도
        if (options.downloadedUrl) {
          const upgradeResult = await enhancedImageLoader.loadImage({
            downloadedUrl: options.downloadedUrl,
            originalUrl: options.originalUrl,
            maxRetries: 2,
            retryDelay: 500,
          });

          if (upgradeResult.status === 'success') {
            // 품질 업그레이드 성공 이벤트 발생
            this.notifyQualityUpgrade(upgradeResult, initialResult);
          }
        }
      } catch (error) {
        console.warn('[AdvancedImageLoader] Quality upgrade failed:', error);
      } finally {
        this.qualityUpgradeTimeouts.delete(cacheKey);
      }
    }, 1000);

    this.qualityUpgradeTimeouts.set(cacheKey, timeout);
  }

  /**
   * 품질 업그레이드 알림
   */
  private static notifyQualityUpgrade(upgradeResult: any, initialResult: any) {
    // 커스텀 이벤트로 품질 업그레이드 알림
    if (typeof window !== 'undefined') {
      const event = new CustomEvent('imageQualityUpgrade', {
        detail: {
          upgraded: upgradeResult,
          original: initialResult,
        },
      });
      window.dispatchEvent(event);
    }
  }

  /**
   * 캐시 키 생성
   */
  private static generateCacheKey(options: AdvancedImageOptions): string {
    const { downloadedUrl, originalUrl, containerWidth, containerHeight } = options;
    return `${downloadedUrl || ''}|${originalUrl}|${containerWidth || 0}|${containerHeight || 0}`;
  }

  /**
   * 정리 함수
   */
  static cleanup() {
    // 모든 타임아웃 정리
    this.qualityUpgradeTimeouts.forEach((timeout) => clearTimeout(timeout));
    this.qualityUpgradeTimeouts.clear();
    this.loadAttempts.clear();
  }
}

// 편의 함수들
export async function loadHighQualityImage(
  downloadedUrl: string | undefined,
  originalUrl: string,
  options?: Partial<AdvancedImageOptions>,
) {
  return AdvancedImageLoader.loadWithQualityPriority({
    downloadedUrl,
    originalUrl,
    enableQualityUpgrade: true,
    enableSmartRetry: true,
    ...options,
  });
}

export function useImageQualityUpgrade() {
  if (typeof window === 'undefined') return null;

  const handleUpgrade = (callback: (event: CustomEvent) => void) => {
    window.addEventListener('imageQualityUpgrade', callback as EventListener);
    return () => window.removeEventListener('imageQualityUpgrade', callback as EventListener);
  };

  return { onQualityUpgrade: handleUpgrade };
}
