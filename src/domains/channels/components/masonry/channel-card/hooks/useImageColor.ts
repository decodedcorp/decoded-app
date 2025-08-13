'use client';

import { useState, useEffect, useCallback } from 'react';

// Dynamic import for Vibrant.js to avoid SSR issues
let Vibrant: any = null;

if (typeof window !== 'undefined') {
  try {
    // Try different import methods
    const VibrantModule = require('node-vibrant/browser');
    Vibrant = VibrantModule.default || VibrantModule;

    // If still not working, try the main module
    if (!Vibrant || typeof Vibrant.from !== 'function') {
      const MainVibrant = require('node-vibrant');
      Vibrant = MainVibrant.default || MainVibrant;
    }

    console.log('🎨 Vibrant.js loaded successfully:', Vibrant);
  } catch (error) {
    console.warn('⚠️ Failed to load Vibrant.js, falling back to basic color extraction:', error);
    Vibrant = null;
  }
}

interface ColorData {
  primary: {
    rgb: string;
    hex: string;
    hsl: string;
  };
  vibrant: {
    rgb: string;
    hex: string;
    hsl: string;
  };
  muted: {
    rgb: string;
    hex: string;
    hsl: string;
  };
}

interface UseImageColorReturn {
  colorData: ColorData;
  isColorLoaded: boolean;
  extractionStatus: 'idle' | 'loading' | 'success' | 'error';
  extractColor: (imageUrl: string) => Promise<void>;
}

// Convert RGB array to string format
const rgbArrayToString = (rgb: number[]): string => {
  return rgb.join(', ');
};

// Convert RGB array to hex
const rgbToHex = (rgb: number[]): string => {
  return `#${rgb.map((c) => c.toString(16).padStart(2, '0')).join('')}`;
};

// Convert RGB array to HSL
const rgbToHsl = (rgb: number[]): string => {
  const [r, g, b] = rgb.map((c) => c / 255);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0,
    s = 0,
    l = (max + min) / 2;

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
};

// Fallback color extraction using Canvas API
const fallbackColorExtraction = async (imageUrl: string): Promise<ColorData> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }

        // Optimize canvas size for performance
        canvas.width = 100;
        canvas.height = 100;
        ctx.drawImage(img, 0, 0, 100, 100);

        const imageData = ctx.getImageData(0, 0, 100, 100);
        const data = imageData.data;
        const colorMap: { [key: string]: number } = {};

        // Analyze pixels and group similar colors
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const alpha = data[i + 3];

          // Skip transparent or extreme colors
          if (alpha < 128 || r + g + b < 60 || r + g + b > 600) continue;

          // Group colors into buckets for better clustering
          const roundedR = Math.round(r / 15) * 15;
          const roundedG = Math.round(g / 15) * 15;
          const roundedB = Math.round(b / 15) * 15;

          const key = `${roundedR},${roundedG},${roundedB}`;
          colorMap[key] = (colorMap[key] || 0) + 1;
        }

        // Find the most frequent color
        let dominantRgb = '59, 130, 246'; // Default blue
        let maxCount = 0;

        for (const [color, count] of Object.entries(colorMap)) {
          if (count > maxCount) {
            maxCount = count;
            dominantRgb = color;
          }
        }

        // Convert to hex and HSL
        const [r, g, b] = dominantRgb.split(',').map((n) => parseInt(n.trim()));
        const hex = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b
          .toString(16)
          .padStart(2, '0')}`;
        const hsl = rgbToHsl([r, g, b]);

        // Create similar but varied colors for the palette
        const vibrantRgb = `${Math.min(255, r + 30)}, ${Math.min(255, g + 30)}, ${Math.min(
          255,
          b + 30,
        )}`;
        const mutedRgb = `${Math.max(0, r - 20)}, ${Math.max(0, g - 20)}, ${Math.max(0, b - 20)}`;

        resolve({
          primary: { rgb: dominantRgb, hex, hsl },
          vibrant: {
            rgb: vibrantRgb,
            hex: rgbToHex([r + 30, g + 30, b + 30]),
            hsl: rgbToHsl([r + 30, g + 30, b + 30]),
          },
          muted: {
            rgb: mutedRgb,
            hex: rgbToHex([r - 20, g - 20, b - 20]),
            hsl: rgbToHsl([r - 20, g - 20, b - 20]),
          },
        });
      } catch (error) {
        reject(error);
      }
    };

    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };

    img.src = imageUrl;
  });
};

// Default color fallbacks
const defaultColors = {
  primary: {
    rgb: '59, 130, 246',
    hex: '#3B82F6',
    hsl: '217, 91%, 60%',
  },
  vibrant: {
    rgb: '59, 130, 246',
    hex: '#3B82F6',
    hsl: '217, 91%, 60%',
  },
  muted: {
    rgb: '100, 116, 139',
    hex: '#64748B',
    hsl: '215, 16%, 47%',
  },
};

export const useImageColor = (): UseImageColorReturn => {
  const [colorData, setColorData] = useState<ColorData>(defaultColors);
  const [isColorLoaded, setIsColorLoaded] = useState(false);
  const [extractionStatus, setExtractionStatus] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle');

  // Memoize extractColor function to prevent infinite loops
  const extractColor = useCallback(
    async (imageUrl: string) => {
      if (!imageUrl) return;

      // Prevent duplicate extraction for the same URL
      if (extractionStatus === 'loading') {
        console.log('🔄 Color extraction already in progress, skipping...');
        return;
      }

      setExtractionStatus('loading');
      setIsColorLoaded(false);

      try {
        let newColorData: ColorData;

        // Try Vibrant.js first
        if (Vibrant && typeof Vibrant.from === 'function') {
          console.log('🎨 Using Vibrant.js for color extraction');
          const palette = await Vibrant.from(imageUrl).getPalette();

          // Extract colors from palette
          const primary = palette.Dominant || palette.Vibrant || palette.Muted;
          const vibrant = palette.Vibrant || palette.Dominant || palette.Muted;
          const muted = palette.Muted || palette.Dominant || palette.Vibrant;

          if (primary && vibrant && muted) {
            newColorData = {
              primary: {
                rgb: rgbArrayToString(primary.rgb),
                hex: primary.hex,
                hsl: rgbToHsl(primary.rgb),
              },
              vibrant: {
                rgb: rgbArrayToString(vibrant.rgb),
                hex: vibrant.hex,
                hsl: rgbToHsl(vibrant.rgb),
              },
              muted: {
                rgb: rgbArrayToString(muted.rgb),
                hex: muted.hex,
                hsl: rgbToHsl(muted.rgb),
              },
            };
          } else {
            throw new Error('Failed to extract color palette from Vibrant.js');
          }
        } else {
          // Fallback to Canvas API
          console.log('🎨 Using Canvas API fallback for color extraction');
          newColorData = await fallbackColorExtraction(imageUrl);
        }

        setColorData(newColorData);
        setIsColorLoaded(true);
        setExtractionStatus('success');
        console.log('🎨 Color extraction successful:', newColorData);
      } catch (error) {
        console.error('Color extraction failed:', error);
        setExtractionStatus('error');
        // Fallback to default colors
        setColorData(defaultColors);
      }
    },
    [extractionStatus],
  ); // Only depend on extractionStatus

  return {
    colorData,
    isColorLoaded,
    extractionStatus,
    extractColor,
  };
};
