'use client';

import { useState, useCallback, useRef, useEffect } from 'react';

// Accept either a URL string or an <img> element
type ImageSource = string | HTMLImageElement;

const isSameOrigin = (u: string) => {
  try {
    const url = new URL(
      u,
      typeof window !== 'undefined' ? window.location.origin : 'http://localhost',
    );
    return typeof window !== 'undefined' && url.origin === window.location.origin;
  } catch {
    return false;
  }
};

interface ColorData {
  primary: { rgb: string; hex: string; hsl: string };
  vibrant: { rgb: string; hex: string; hsl: string };
  muted: { rgb: string; hex: string; hsl: string };
}

// 기본 색상 fallback (회색 계열)
const defaultColors: ColorData = {
  primary: { rgb: '100, 116, 139', hex: '#64748B', hsl: '215, 16%, 47%' },
  vibrant: { rgb: '148, 163, 184', hex: '#94A3B8', hsl: '215, 16%, 64%' },
  muted: { rgb: '71, 85, 105', hex: '#475569', hsl: '215, 16%, 35%' },
};

// 유틸리티 함수들
const clamp = (n: number): number => Math.max(0, Math.min(255, n));

const isAllowedSrc = (url: string): boolean => {
  return (
    /^https?:\/\//.test(url) ||
    url.startsWith('/') ||
    url.startsWith('blob:') ||
    url.startsWith('data:') ||
    url.startsWith('/_next/image') ||
    url.startsWith('/api/image-proxy')
  );
};

// 이미지 프록시 URL로 변환 (외부 URL인 경우)
const getProxiedUrl = (imageUrl: string): string => {
  // No mandatory proxy – keep original URL. If it is same-origin already (e.g., from next/image currentSrc), it's safe for canvas.
  return imageUrl;
};

const CORS_ALLOWED_HOSTS = new Set<string>([
  // Add hosts that you KNOW return Access-Control-Allow-Origin: *
  // Examples: 'images.unsplash.com', 'i.imgur.com'
]);

const canAttemptCrossOrigin = (u: string) => {
  try {
    const { hostname } = new URL(
      u,
      typeof window !== 'undefined' ? window.location.origin : 'http://localhost',
    );
    return CORS_ALLOWED_HOSTS.has(hostname);
  } catch {
    return false;
  }
};

// 전역 색상 캐시 (메모리 효율성)
const colorCache = new Map<string, ColorData>();

export const useImageColor = () => {
  const [extractedColor, setExtractedColor] = useState<ColorData | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);

  // 생존 가드 ref
  const aliveRef = useRef(true);
  const currentRequestRef = useRef<AbortController | null>(null);

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      aliveRef.current = false;
      if (currentRequestRef.current) {
        currentRequestRef.current.abort();
      }
    };
  }, []);

  const extractColors = useCallback(async (source: ImageSource): Promise<ColorData | null> => {
    if (!source || typeof window === 'undefined') {
      return defaultColors;
    }

    // Derive URL from string or <img> element; prefer same-origin currentSrc from next/image when available.
    let imageUrl = typeof source === 'string' ? source : source.currentSrc || source.src || '';

    if (!imageUrl) {
      return defaultColors;
    }

    // If the URL is not allowed by scheme/path, bail early.
    if (!isAllowedSrc(imageUrl)) {
      console.warn('Invalid image URL:', imageUrl);
      return defaultColors;
    }

    // 캐시 히트 체크
    const cached = colorCache.get(imageUrl);
    if (cached) {
      if (aliveRef.current) {
        setExtractedColor(cached);
      }
      return cached;
    }

    // 이전 요청 취소
    if (currentRequestRef.current) {
      currentRequestRef.current.abort();
    }

    // 새로운 AbortController 생성
    const abortController = new AbortController();
    currentRequestRef.current = abortController;

    setIsExtracting(true);

    try {
      return new Promise((resolve) => {
        // 생존 체크
        if (!aliveRef.current) {
          setIsExtracting(false);
          resolve(defaultColors);
          return;
        }

        const img = new Image();

        const finalImageUrl = getProxiedUrl(imageUrl);

        // Prefer same-origin (e.g., next/image currentSrc). Only set crossOrigin when we know the host allows it.
        if (
          !isSameOrigin(imageUrl) &&
          /^https?:\/\//.test(imageUrl) &&
          canAttemptCrossOrigin(imageUrl)
        ) {
          img.crossOrigin = 'anonymous';
        }

        // 이미지 로드 타임아웃 설정
        const timeoutId = setTimeout(() => {
          if (aliveRef.current) {
            console.warn('Image load timeout for:', imageUrl);
            setIsExtracting(false);
          }
          resolve(defaultColors);
        }, 15000); // 15초로 증가

        img.onload = () => {
          clearTimeout(timeoutId);

          if (process.env.NODE_ENV !== 'production') {
            console.log('✅ Image loaded successfully:', imageUrl);
            console.log('📏 Image dimensions:', img.naturalWidth, 'x', img.naturalHeight);
          }

          // 생존 체크
          if (!aliveRef.current) {
            setIsExtracting(false);
            resolve(defaultColors);
            return;
          }

          try {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            if (!ctx) {
              console.warn('Could not get canvas context for image:', imageUrl);
              if (aliveRef.current) setIsExtracting(false);
              resolve(defaultColors);
              return;
            }

            // 성능을 위해 적절한 크기로 분석 (정확도와 성능의 균형)
            canvas.width = 150; // 100 → 150으로 증가
            canvas.height = 150; // 더 많은 픽셀로 색상 분석 정확도 향상

            try {
              ctx.drawImage(img, 0, 0, 150, 150);
            } catch (drawError) {
              console.warn('Failed to draw image to canvas:', drawError);
              if (aliveRef.current) setIsExtracting(false);
              resolve(defaultColors);
              return;
            }

            let imageData: ImageData;
            try {
              imageData = ctx.getImageData(0, 0, 150, 150);
              if (process.env.NODE_ENV !== 'production') {
                console.log('🎨 Canvas pixel data extracted successfully');
              }
            } catch (e) {
              // Likely a tainted canvas due to CORS. Fall back.
              console.warn('Tainted canvas (CORS) – falling back to defaultColors for:', imageUrl);
              if (aliveRef.current) setIsExtracting(false);
              resolve(defaultColors);
              return;
            }
            const data = imageData.data;
            const colorMap: { [key: string]: number } = {};

            // 픽셀 분석 및 색상 그룹화
            for (let i = 0; i < data.length; i += 4) {
              const r = data[i];
              const g = data[i + 1];
              const b = data[i + 2];
              const alpha = data[i + 3];

              // 투명하거나 극단적인 색상 제외 (기준 완화)
              if (alpha < 100) continue; // 투명도 기준 완화

              // 색상 범위 기준 완화 (너무 어둡거나 밝은 색상만 제외)
              const brightness = r + g + b;
              if (brightness < 30 || brightness > 700) continue; // 30-700 범위로 확장

              // 색상 그룹화 정밀도 향상 (더 세밀한 색상 구분)
              const roundedR = Math.round(r / 10) * 10; // 15 → 10으로 정밀도 향상
              const roundedG = Math.round(g / 10) * 10;
              const roundedB = Math.round(b / 10) * 10;

              const key = `${roundedR},${roundedG},${roundedB}`;
              colorMap[key] = (colorMap[key] || 0) + 1;
            }

            // 디버깅: 색상 분포 확인
            if (process.env.NODE_ENV !== 'production') {
              console.log('Color extraction debug:', {
                totalPixels: data.length / 4,
                validColors: Object.keys(colorMap).length,
                colorDistribution: Object.entries(colorMap)
                  .sort(([, a], [, b]) => b - a)
                  .slice(0, 5)
                  .map(([color, count]) => ({ color, count })),
              });
            }

            // 유효한 색상이 없는 경우 기본값 사용
            if (Object.keys(colorMap).length === 0) {
              console.warn('No valid colors extracted from image:', imageUrl);
              if (aliveRef.current) setIsExtracting(false);
              resolve(defaultColors);
              return;
            }

            // 가장 적절한 대표 색상 찾기 (빈도 + 색상 품질 고려)
            let dominantRgb = '100, 116, 139'; // 기본 회색
            let maxScore = 0;

            for (const [color, count] of Object.entries(colorMap)) {
              const [r, g, b] = color.split(',').map((n) => parseInt(n.trim(), 10));

              // 색상 품질 점수 계산
              const brightness = r + g + b;
              const saturation = Math.max(r, g, b) - Math.min(r, g, b);

              // 빈도 + 밝기 + 채도 종합 점수
              const frequencyScore = count;
              const brightnessScore = brightness > 200 && brightness < 500 ? 2 : 1; // 적당한 밝기 선호
              const saturationScore = saturation > 50 ? 1.5 : 1; // 채도 있는 색상 선호

              const totalScore = frequencyScore * brightnessScore * saturationScore;

              if (totalScore > maxScore) {
                maxScore = totalScore;
                dominantRgb = color;
              }
            }

            if (process.env.NODE_ENV !== 'production') {
              console.log('Selected dominant color:', { color: dominantRgb, score: maxScore });
            }

            // RGB를 hex와 HSL로 변환 (안전한 클램프 적용)
            const [r, g, b] = dominantRgb.split(',').map((n) => parseInt(n.trim(), 10));

            // 안전한 색상 변환 함수들
            const safeRgbToHex = (r: number, g: number, b: number): string => {
              const safeR = clamp(r);
              const safeG = clamp(g);
              const safeB = clamp(b);
              return `#${safeR.toString(16).padStart(2, '0')}${safeG
                .toString(16)
                .padStart(2, '0')}${safeB.toString(16).padStart(2, '0')}`;
            };

            const safeRgbToHsl = (r: number, g: number, b: number): string => {
              return rgbToHsl(clamp(r), clamp(g), clamp(b));
            };

            const hex = safeRgbToHex(r, g, b);
            const hsl = safeRgbToHsl(r, g, b);

            // 더 자연스러운 색상 변형
            const vibrantR = clamp(r + Math.round((255 - r) * 0.3)); // 30% 밝게
            const vibrantG = clamp(g + Math.round((255 - g) * 0.3));
            const vibrantB = clamp(b + Math.round((255 - b) * 0.3));
            const vibrantRgb = `${vibrantR}, ${vibrantG}, ${vibrantB}`;

            const mutedR = clamp(r - Math.round(r * 0.2)); // 20% 어둡게
            const mutedG = clamp(g - Math.round(g * 0.2));
            const mutedB = clamp(b - Math.round(b * 0.2));
            const mutedRgb = `${mutedR}, ${mutedG}, ${mutedB}`;

            // 보조 색상 (보색 기반)
            const complementaryR = clamp(255 - r);
            const complementaryG = clamp(255 - g);
            const complementaryB = clamp(255 - b);
            const complementaryRgb = `${complementaryR}, ${complementaryG}, ${complementaryB}`;

            if (process.env.NODE_ENV !== 'production') {
              console.log('Generated color palette:', {
                primary: dominantRgb,
                vibrant: vibrantRgb,
                muted: mutedRgb,
                complementary: complementaryRgb,
              });
            }

            const colorData: ColorData = {
              primary: { rgb: dominantRgb, hex, hsl },
              vibrant: {
                rgb: vibrantRgb,
                hex: safeRgbToHex(vibrantR, vibrantG, vibrantB),
                hsl: safeRgbToHsl(vibrantR, vibrantG, vibrantB),
              },
              muted: {
                rgb: mutedRgb,
                hex: safeRgbToHex(mutedR, mutedG, mutedB),
                hsl: safeRgbToHsl(mutedR, mutedG, mutedB),
              },
            };

            // 캐시에 저장
            colorCache.set(imageUrl, colorData);

            // 생존 체크 후 상태 업데이트
            if (aliveRef.current) {
              setExtractedColor(colorData);
              setIsExtracting(false);
            }

            resolve(colorData);
          } catch (error) {
            console.warn('Color extraction failed for image:', imageUrl, error);
            clearTimeout(timeoutId);
            if (aliveRef.current) setIsExtracting(false);
            resolve(defaultColors);
          }
        };

        img.onerror = (error) => {
          clearTimeout(timeoutId);
          console.warn('Failed to load image for color extraction:', imageUrl, error);
          if (aliveRef.current) setIsExtracting(false);
          resolve(defaultColors);
        };

        // 이미지 로드 시작
        if (process.env.NODE_ENV !== 'production') {
          console.log('🖼️ Starting color extraction for:', imageUrl);
          console.log('🔗 Final URL:', finalImageUrl);
          console.log('🌐 Same origin:', isSameOrigin(imageUrl));
          console.log('🔓 CORS allowed:', canAttemptCrossOrigin(imageUrl));
        }
        img.src = finalImageUrl;
      });
    } catch (error) {
      console.warn('Color extraction setup failed for image:', imageUrl, error);
      if (aliveRef.current) setIsExtracting(false);
      return defaultColors;
    }
  }, []);

  const extractFromImgEl = (el: HTMLImageElement | null) =>
    el ? extractColors(el) : Promise.resolve(defaultColors);
  return { extractedColor, isExtracting, extractColors, extractFromImgEl };
};

// RGB to HSL 변환 함수 (0-255 입력 가정)
function rgbToHsl(r: number, g: number, b: number): string {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }

    h /= 6;
  }

  return `${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%`;
}
