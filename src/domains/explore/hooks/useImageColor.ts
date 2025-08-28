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

  const extractFromImgEl = useCallback(async (el: HTMLImageElement | null): Promise<ColorData> => {
    if (!el || typeof window === 'undefined') {
      return defaultColors;
    }

    const imageUrl = el.currentSrc || el.src || '';
    
    if (!imageUrl) {
      return defaultColors;
    }

    // 캐시 체크
    const cached = colorCache.get(imageUrl);
    if (cached) {
      if (aliveRef.current) {
        setExtractedColor(cached);
      }
      return cached;
    }

    // 이미지가 아직 로드되지 않은 경우 대기
    if (!el.complete || el.naturalWidth === 0) {
      return new Promise((resolve) => {
        const onLoad = () => {
          el.removeEventListener('load', onLoad);
          extractFromImgEl(el).then(resolve);
        };
        el.addEventListener('load', onLoad);
      });
    }

    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        return defaultColors;
      }

      // 성능을 위해 적절한 크기로 분석
      canvas.width = 150;
      canvas.height = 150;

      try {
        ctx.drawImage(el, 0, 0, 150, 150);
      } catch (drawError) {
        return defaultColors;
      }

      let imageData: ImageData;
      try {
        imageData = ctx.getImageData(0, 0, 150, 150);
      } catch (e) {
        return defaultColors;
      }

      // 색상 분석 및 추출
      const data = imageData.data;
      const colorMap: { [key: string]: number } = {};

      // 픽셀 분석 및 색상 그룹화
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const alpha = data[i + 3];

        if (alpha < 100) continue;
        const brightness = r + g + b;
        if (brightness < 30 || brightness > 700) continue;

        const roundedR = Math.round(r / 10) * 10;
        const roundedG = Math.round(g / 10) * 10;
        const roundedB = Math.round(b / 10) * 10;

        const key = `${roundedR},${roundedG},${roundedB}`;
        colorMap[key] = (colorMap[key] || 0) + 1;
      }

      if (Object.keys(colorMap).length === 0) {
        return defaultColors;
      }

      // 대표 색상 찾기
      let dominantRgb = '100, 116, 139';
      let maxScore = 0;

      for (const [color, count] of Object.entries(colorMap)) {
        const [r, g, b] = color.split(',').map((n) => parseInt(n.trim(), 10));
        const brightness = r + g + b;
        const saturation = Math.max(r, g, b) - Math.min(r, g, b);

        const frequencyScore = count;
        const brightnessScore = brightness > 200 && brightness < 500 ? 2 : 1;
        const saturationScore = saturation > 50 ? 1.5 : 1;

        const totalScore = frequencyScore * brightnessScore * saturationScore;

        if (totalScore > maxScore) {
          maxScore = totalScore;
          dominantRgb = color;
        }
      }

      // 색상 팔레트 생성
      const [r, g, b] = dominantRgb.split(',').map((n) => parseInt(n.trim(), 10));

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

      const vibrantR = clamp(r + Math.round((255 - r) * 0.3));
      const vibrantG = clamp(g + Math.round((255 - g) * 0.3));
      const vibrantB = clamp(b + Math.round((255 - b) * 0.3));
      const vibrantRgb = `${vibrantR}, ${vibrantG}, ${vibrantB}`;

      const mutedR = clamp(r - Math.round(r * 0.2));
      const mutedG = clamp(g - Math.round(g * 0.2));
      const mutedB = clamp(b - Math.round(b * 0.2));
      const mutedRgb = `${mutedR}, ${mutedG}, ${mutedB}`;

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

      // 상태 업데이트
      if (aliveRef.current) {
        setExtractedColor(colorData);
        setIsExtracting(false);
      }

      return colorData;
    } catch (error) {
      return defaultColors;
    }
  }, []);

  return { extractedColor, isExtracting, extractFromImgEl };
};

// RGB to HSL 변환 함수
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