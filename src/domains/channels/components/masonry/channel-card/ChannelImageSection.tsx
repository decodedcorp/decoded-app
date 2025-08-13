'use client';

import React, { useEffect, useCallback, useRef } from 'react';
import { useImageColor } from './hooks/useImageColor';

interface ChannelImageSectionProps {
  imageUrl: string;
  channelName: string;
  colorShiftOnHover?: boolean;
  onColorExtracted?: (colorData: { 
    primary: { rgb: string; hex: string; hsl: string };
    vibrant: { rgb: string; hex: string; hsl: string };
    muted: { rgb: string; hex: string; hsl: string };
  }) => void;
}

const ChannelImageSection: React.FC<ChannelImageSectionProps> = ({
  imageUrl,
  channelName,
  colorShiftOnHover = false,
  onColorExtracted,
}) => {
  const { colorData, isColorLoaded, extractionStatus, extractColor } = useImageColor();
  const hasExtractedRef = useRef(false);
  const lastImageUrlRef = useRef<string>('');

  // Memoize the callback to prevent infinite loops
  const handleColorExtracted = useCallback((colorData: any) => {
    if (onColorExtracted && !hasExtractedRef.current) {
      onColorExtracted(colorData);
      hasExtractedRef.current = true;
    }
  }, [onColorExtracted]);

  useEffect(() => {
    // Only extract colors if imageUrl changed and we haven't extracted yet
    if (imageUrl && imageUrl !== lastImageUrlRef.current && !hasExtractedRef.current) {
      console.log('🖼️ Starting color extraction for:', imageUrl);
      lastImageUrlRef.current = imageUrl;
      hasExtractedRef.current = false;
      extractColor(imageUrl);
    }
  }, [imageUrl, extractColor]);

  useEffect(() => {
    if (isColorLoaded && !hasExtractedRef.current) {
      handleColorExtracted(colorData);
    }
  }, [isColorLoaded, colorData, handleColorExtracted]);

  // Dynamic gradient styles based on extracted colors
  const primaryGradientStyle = isColorLoaded 
    ? `linear-gradient(180deg, transparent 0%, transparent 45%, rgba(${colorData.primary.rgb}, 0.03) 55%, rgba(${colorData.primary.rgb}, 0.08) 65%, rgba(${colorData.primary.rgb}, 0.25) 75%, rgba(${colorData.primary.rgb}, 0.6) 85%, rgba(${colorData.primary.rgb}, 0.8) 95%, rgba(${colorData.primary.rgb}, 0.9) 100%)`
    : 'linear-gradient(180deg, transparent 0%, transparent 45%, rgba(0,0,0,0.03) 55%, rgba(0,0,0,0.08) 65%, rgba(0,0,0,0.25) 75%, rgba(0,0,0,0.6) 85%, rgba(0,0,0,0.8) 95%, rgba(0,0,0,0.9) 100%)';

  const blurGradientStyle = isColorLoaded
    ? `linear-gradient(to top, rgba(${colorData.primary.rgb}, 0.1) 0%, transparent 70%)`
    : 'linear-gradient(to top, rgba(0,0,0,0.1) 0%, transparent 70%)';

  const atmosphericGradientStyle = isColorLoaded
    ? `linear-gradient(to top, rgba(${colorData.primary.rgb}, 0.05) 0%, transparent 100%)`
    : 'linear-gradient(to top, rgba(0,0,0,0.05) 0%, transparent 100%)';

  return (
    <div className="absolute inset-0">
      {/* Background Image */}
      <img
        src={imageUrl}
        alt={channelName}
        className="w-full h-full object-cover"
      />
      
      {/* Enhanced Gradient Overlay with Blur Effect */}
      <div className="absolute inset-0">
        {/* Primary gradient - 자연스러운 하단 그라디언트 */}
        <div
          className="absolute inset-0 transition-all duration-1000"
          style={{
            background: primaryGradientStyle,
          }}
        />
        
        {/* Subtle backdrop blur for text readability */}
        <div
          className="absolute bottom-0 left-0 right-0 h-32 backdrop-blur-[1px] transition-all duration-1000"
          style={{
            background: blurGradientStyle,
            maskImage:
              'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.7) 50%, rgba(0,0,0,0.2) 80%, transparent 100%)',
            WebkitMaskImage:
              'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.7) 50%, rgba(0,0,0,0.2) 80%, transparent 100%)',
          }}
        />
        
        {/* Ultra-light atmospheric effect */}
        <div
          className="absolute bottom-0 left-0 right-0 h-24 backdrop-blur-[0.5px] transition-all duration-1000"
          style={{
            background: atmosphericGradientStyle,
            maskImage:
              'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.3) 60%, transparent 100%)',
            WebkitMaskImage:
              'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.3) 60%, transparent 100%)',
          }}
        />
      </div>
      
      {/* 색상 시프트 오버레이 (호버 시) */}
      {colorShiftOnHover && (
        <div className="color-overlay absolute inset-0 rounded-2xl bg-gradient-to-tr from-pink-500/30 to-sky-500/30 opacity-0 pointer-events-none transition-opacity duration-300" />
      )}
    </div>
  );
};

export default ChannelImageSection;
