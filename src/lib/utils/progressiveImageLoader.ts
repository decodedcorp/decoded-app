/**
 * Progressive Image Quality Loading System
 * 점진적 이미지 품질 향상 시스템
 * 
 * 낮은 품질로 빠르게 표시 → 높은 품질로 점진적 향상
 */

import { getProxiedImageUrl, type ImageSize, type ImageQuality } from './imageProxy';

export interface ProgressiveImageConfig {
  url: string;
  quality: ImageQuality;
  size?: ImageSize;
  delay?: number; // 다음 품질로 넘어가기까지의 지연 시간
}

export interface ProgressiveLoadingOptions {
  containerWidth?: number;
  containerHeight?: number;
  enableProgressive?: boolean;
  fastLoad?: boolean; // 빠른 로딩을 위해 낮은 품질부터 시작
  maxQuality?: ImageQuality;
  progressiveDelay?: number; // 각 단계 간 지연 시간
  preloadNextLevel?: boolean; // 다음 품질 레벨을 미리 로딩
}

export interface ProgressiveLoadResult {
  currentUrl: string;
  currentQuality: ImageQuality;
  isComplete: boolean;
  nextUrl?: string;
  progress: number; // 0-100 진행률
}

class ProgressiveImageLoader {
  private loadingPromises = new Map<string, Promise<ProgressiveLoadResult>>();
  private preloadCache = new Map<string, HTMLImageElement>();

  /**
   * 컨테이너 크기에 따른 점진적 품질 단계 생성
   */
  private createProgressiveStages(
    url: string,
    options: ProgressiveLoadingOptions
  ): ProgressiveImageConfig[] {
    const { containerWidth = 300, containerHeight = 200, maxQuality = 'max', fastLoad = true } = options;
    
    // 컨테이너 크기에 맞는 최적 사이즈 결정
    const maxDimension = Math.max(containerWidth, containerHeight);
    let optimalSize: ImageSize = 'medium';
    
    if (maxDimension <= 300) optimalSize = 'small';
    else if (maxDimension <= 600) optimalSize = 'medium';
    else if (maxDimension <= 1200) optimalSize = 'large';
    else optimalSize = 'original';

    const stages: ProgressiveImageConfig[] = [];

    if (fastLoad) {
      // 빠른 로딩 모드: 낮은 품질부터 시작
      stages.push({
        url,
        quality: 'low',
        size: 'small', // 작은 사이즈로 먼저 로딩
        delay: 0,
      });

      stages.push({
        url,
        quality: 'medium',
        size: optimalSize,
        delay: 200,
      });

      if (maxQuality === 'high' || maxQuality === 'max') {
        stages.push({
          url,
          quality: 'high',
          size: optimalSize,
          delay: 500,
        });
      }

      if (maxQuality === 'max') {
        stages.push({
          url,
          quality: 'max',
          size: optimalSize,
          delay: 1000,
        });
      }
    } else {
      // 일반 모드: 적정 품질부터 시작
      stages.push({
        url,
        quality: 'medium',
        size: optimalSize,
        delay: 0,
      });

      if (maxQuality === 'high' || maxQuality === 'max') {
        stages.push({
          url,
          quality: 'high',
          size: optimalSize,
          delay: 300,
        });
      }

      if (maxQuality === 'max') {
        stages.push({
          url,
          quality: 'max',
          size: optimalSize,
          delay: 800,
        });
      }
    }

    return stages;
  }

  /**
   * 이미지 사전 로딩
   */
  private async preloadImage(url: string): Promise<HTMLImageElement> {
    if (this.preloadCache.has(url)) {
      return this.preloadCache.get(url)!;
    }

    return new Promise((resolve, reject) => {
      const img = new Image();
      
      img.onload = () => {
        this.preloadCache.set(url, img);
        resolve(img);
      };
      
      img.onerror = reject;
      img.src = url;
    });
  }

  /**
   * 단일 품질 레벨 로딩
   */
  private async loadQualityLevel(config: ProgressiveImageConfig): Promise<string> {
    const proxiedUrl = getProxiedImageUrl(config.url, {
      quality: config.quality,
      size: config.size,
      format: 'webp',
    });

    await this.preloadImage(proxiedUrl);
    return proxiedUrl;
  }

  /**
   * 점진적 이미지 로딩 실행
   */
  async loadProgressively(
    url: string,
    options: ProgressiveLoadingOptions = {},
    onProgress?: (result: ProgressiveLoadResult) => void
  ): Promise<ProgressiveLoadResult> {
    const cacheKey = `${url}-${JSON.stringify(options)}`;

    // 이미 로딩 중인 요청이 있으면 재사용
    if (this.loadingPromises.has(cacheKey)) {
      return this.loadingPromises.get(cacheKey)!;
    }

    const { enableProgressive = true, progressiveDelay = 0, preloadNextLevel = true } = options;

    const loadingPromise = this.performProgressiveLoad(url, options, onProgress);
    this.loadingPromises.set(cacheKey, loadingPromise);

    try {
      return await loadingPromise;
    } finally {
      this.loadingPromises.delete(cacheKey);
    }
  }

  /**
   * 점진적 로딩 실행
   */
  private async performProgressiveLoad(
    url: string,
    options: ProgressiveLoadingOptions,
    onProgress?: (result: ProgressiveLoadResult) => void
  ): Promise<ProgressiveLoadResult> {
    const stages = this.createProgressiveStages(url, options);
    const { progressiveDelay = 0, preloadNextLevel = true } = options;

    let currentResult: ProgressiveLoadResult = {
      currentUrl: '',
      currentQuality: 'low',
      isComplete: false,
      progress: 0,
    };

    for (let i = 0; i < stages.length; i++) {
      const stage = stages[i];
      const isLastStage = i === stages.length - 1;

      try {
        // 현재 단계 로딩
        const stageUrl = await this.loadQualityLevel(stage);
        
        // 결과 업데이트
        currentResult = {
          currentUrl: stageUrl,
          currentQuality: stage.quality,
          isComplete: isLastStage,
          progress: Math.round(((i + 1) / stages.length) * 100),
          nextUrl: !isLastStage ? stages[i + 1].url : undefined,
        };

        // 진행 상황 콜백 호출
        onProgress?.(currentResult);

        // 개발 환경에서 로딩 정보 출력
        if (process.env.NODE_ENV === 'development') {
          console.log(
            `[ProgressiveImageLoader] Stage ${i + 1}/${stages.length} loaded:`,
            {
              quality: stage.quality,
              size: stage.size,
              progress: currentResult.progress,
            }
          );
        }

        // 마지막 단계가 아니라면 다음 단계 준비
        if (!isLastStage) {
          // 다음 레벨 사전 로딩 (옵션에 따라)
          if (preloadNextLevel && i + 1 < stages.length) {
            const nextStage = stages[i + 1];
            setTimeout(() => {
              this.loadQualityLevel(nextStage).catch(() => {
                // 사전 로딩 실패는 무시 (다음 단계에서 다시 시도)
              });
            }, Math.max(stage.delay || 0, progressiveDelay));
          }

          // 지연 시간 대기
          if (stage.delay || progressiveDelay) {
            await new Promise(resolve => 
              setTimeout(resolve, Math.max(stage.delay || 0, progressiveDelay))
            );
          }
        }

      } catch (error) {
        console.warn(
          `[ProgressiveImageLoader] Failed to load stage ${i + 1}:`,
          error
        );

        // 현재 단계 실패 시, 이전 결과가 있으면 그것을 유지하고 중단
        if (currentResult.currentUrl) {
          return { ...currentResult, isComplete: true };
        }

        // 첫 번째 단계부터 실패하면 에러 발생
        if (i === 0) {
          throw error;
        }
      }
    }

    return currentResult;
  }

  /**
   * 캐시 정리
   */
  clearCache(): void {
    this.loadingPromises.clear();
    this.preloadCache.clear();
  }

  /**
   * 캐시 상태 확인
   */
  getCacheStatus(): { loading: number; preloaded: number } {
    return {
      loading: this.loadingPromises.size,
      preloaded: this.preloadCache.size,
    };
  }
}

// 전역 인스턴스
export const progressiveImageLoader = new ProgressiveImageLoader();

// 편의 함수들
export async function loadImageProgressively(
  url: string,
  options?: ProgressiveLoadingOptions,
  onProgress?: (result: ProgressiveLoadResult) => void
): Promise<ProgressiveLoadResult> {
  return progressiveImageLoader.loadProgressively(url, options, onProgress);
}

// React 컴포넌트에서 사용하기 쉬운 헬퍼 함수
export function createProgressiveLoader(options: ProgressiveLoadingOptions = {}) {
  return {
    load: (url: string, onProgress?: (result: ProgressiveLoadResult) => void) =>
      progressiveImageLoader.loadProgressively(url, options, onProgress),
    clearCache: () => progressiveImageLoader.clearCache(),
  };
}

// 네트워크 상태에 따른 적응형 옵션 생성
export function getAdaptiveProgressiveOptions(
  connectionType?: string,
  containerWidth?: number,
  containerHeight?: number
): ProgressiveLoadingOptions {
  const options: ProgressiveLoadingOptions = {
    containerWidth,
    containerHeight,
    enableProgressive: true,
    preloadNextLevel: true,
  };

  switch (connectionType) {
    case 'slow-2g':
    case '2g':
      return {
        ...options,
        fastLoad: true,
        maxQuality: 'medium',
        progressiveDelay: 1000,
      };

    case '3g':
      return {
        ...options,
        fastLoad: true,
        maxQuality: 'high',
        progressiveDelay: 500,
      };

    case '4g':
      return {
        ...options,
        fastLoad: false,
        maxQuality: 'max',
        progressiveDelay: 200,
      };

    default:
      return {
        ...options,
        fastLoad: false,
        maxQuality: 'high',
        progressiveDelay: 300,
      };
  }
}