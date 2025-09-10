'use client';

import React, { useEffect, useCallback, useRef } from 'react';

import { UltraRobustImage } from '@/components/UltraRobustImage';

import { useImageColor } from './hooks/useImageColor';

interface ChannelImageSectionProps {
  imageUrl: string;
  downloadedImageUrl?: string; // 다운로드된 이미지 URL 추가
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
  downloadedImageUrl,
  channelName,
  colorShiftOnHover = false,
  onColorExtracted,
}) => {
  const { extractedColor, isExtracting, extractFromImgEl } = useImageColor();
  const hasExtractedRef = useRef(false);
  const lastImageUrlRef = useRef<string>('');
  const imgRef = useRef<HTMLImageElement>(null);

  // Memoize the callback to prevent infinite loops
  const handleColorExtracted = useCallback(
    (colorData: any) => {
      if (onColorExtracted && !hasExtractedRef.current) {
        onColorExtracted(colorData);
        hasExtractedRef.current = true;
      }
    },
    [onColorExtracted],
  );

  useEffect(() => {
    // Only extract colors if imageUrl changed and we haven't extracted yet
    if (imageUrl && imageUrl !== lastImageUrlRef.current && !hasExtractedRef.current) {
      console.log('🖼️ Starting color extraction for:', imageUrl);
      lastImageUrlRef.current = imageUrl;
      hasExtractedRef.current = false;

      // Next.js Image가 완전히 로드된 후 색상 추출
      if (imgRef.current?.complete) {
        console.log('🖼️ Image already complete, extracting colors immediately');
        // 중복 방지를 위해 hasExtractedRef 체크
        if (!hasExtractedRef.current) {
          hasExtractedRef.current = true; // 즉시 플래그 설정
          extractFromImgEl(imgRef.current)
            .then((colorData) => {
              console.log('🎨 Color extraction completed from useEffect:', colorData);
              // 색상 추출 완료 시 콜백 호출 (null 체크)
              if (colorData && onColorExtracted) {
                onColorExtracted(colorData);
              }
            })
            .catch((error) => {
              console.error('🎨 Color extraction failed from useEffect:', error);
              hasExtractedRef.current = false; // 실패 시 플래그 리셋
            });
        }
      } else {
        console.log('🖼️ Image not complete yet, waiting for onLoad...');
      }
    }
  }, [imageUrl, extractFromImgEl]); // hasExtractedRef.current 제거

  useEffect(() => {
    if (extractedColor && !hasExtractedRef.current) {
      console.log('🎨 Color extracted successfully:', extractedColor);
      handleColorExtracted(extractedColor);
      hasExtractedRef.current = true; // 색상 추출 완료 플래그 설정
    }
  }, [extractedColor, handleColorExtracted]);

  // Dynamic gradient styles based on extracted colors (always use extractedColor or fallback)
  const primaryGradientStyle = extractedColor
    ? `linear-gradient(180deg, transparent 0%, transparent 45%, rgba(${extractedColor.primary.rgb}, 0.02) 55%, rgba(${extractedColor.primary.rgb}, 0.04) 65%, rgba(${extractedColor.primary.rgb}, 0.08) 75%, rgba(${extractedColor.primary.rgb}, 0.15) 85%, rgba(${extractedColor.primary.rgb}, 0.25) 95%, rgba(${extractedColor.primary.rgb}, 0.35) 100%)`
    : 'linear-gradient(180deg, transparent 0%, transparent 45%, rgba(100, 116, 139, 0.02) 55%, rgba(100, 116, 139, 0.04) 65%, rgba(100, 116, 139, 0.08) 75%, rgba(100, 116, 139, 0.15) 85%, rgba(100, 116, 139, 0.25) 95%, rgba(100, 116, 139, 0.35) 100%)';

  const blurGradientStyle = extractedColor
    ? `linear-gradient(to top, rgba(${extractedColor.primary.rgb}, 0.08) 0%, rgba(${extractedColor.muted.rgb}, 0.04) 50%, transparent 100%)`
    : 'linear-gradient(to top, rgba(100, 116, 139, 0.08) 0%, rgba(100, 116, 139, 0.04) 50%, transparent 100%)';

  const atmosphericGradientStyle = extractedColor
    ? `linear-gradient(to top, rgba(${extractedColor.muted.rgb}, 0.06) 0%, rgba(${extractedColor.vibrant.rgb}, 0.03) 50%, transparent 100%)`
    : 'linear-gradient(to top, rgba(100, 116, 139, 0.06) 0%, rgba(100, 116, 139, 0.03) 50%, transparent 100%)';

  // 추가적인 색상 효과들
  const subtleGlowStyle = extractedColor
    ? `radial-gradient(circle at 50% 50%, rgba(${extractedColor.vibrant.rgb}, 0.03) 0%, transparent 70%)`
    : 'radial-gradient(circle at 50% 50%, rgba(100, 116, 139, 0.03) 0%, transparent 70%)';

  const edgeHighlightStyle = extractedColor
    ? `linear-gradient(45deg, transparent 30%, rgba(${extractedColor.primary.rgb}, 0.02) 50%, transparent 70%)`
    : 'linear-gradient(45deg, transparent 30%, rgba(100, 116, 139, 0.02) 50%, transparent 70%)';

  return (
    <div className="absolute inset-0">
      {/* Background Image - Ultra Robust Image 사용 (최강 안정성) */}
      <UltraRobustImage
        ref={imgRef as any}
        src={imageUrl}
        downloadedSrc={downloadedImageUrl}
        alt={channelName}
        fill
        className="object-cover transition-opacity duration-300"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        imageType="preview"
        quality={95}
        maxRetries={3}
        enableDomainRotation={true}
        enableFormatFallback={true}
        enableCorsWorkaround={true}
        customFallbacks={[
          // 기본 placeholder 이미지들
          'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop',
          'https://via.placeholder.com/800x600/374151/9CA3AF?text=Channel+Image'
        ]}
        useNextImage={true}
        onLoad={() => {
          // 이미지 완전 로드 후 색상 추출 (중복 방지)
          if (imgRef.current && !hasExtractedRef.current) {
            console.log('🖼️ Ultra robust image loaded, extracting colors...');
            
            // 색상 추출 실행 (중복 방지를 위해 hasExtractedRef 체크)
            if (!hasExtractedRef.current) {
              hasExtractedRef.current = true; // 즉시 플래그 설정
              extractFromImgEl(imgRef.current)
                .then((colorData) => {
                  console.log('🎨 Color extraction completed from ultra robust image:', colorData);
                  // 색상 추출 완료 시 콜백 호출 (null 체크)
                  if (colorData && onColorExtracted) {
                    onColorExtracted(colorData);
                  }
                })
                .catch((error) => {
                  console.error('🎨 Color extraction failed from ultra robust image:', error);
                  hasExtractedRef.current = false; // 실패 시 플래그 리셋
                });
            }
          }
        }}
        onError={(error) => {
          console.warn('Ultra robust image failed to load (this should rarely happen):', error);
          hasExtractedRef.current = false; // 에러 시 플래그 리셋
        }}
        onSourceChange={(source) => {
          console.log('🖼️ Ultra robust image source changed to:', source);
        }}
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

        {/* Subtle glow effect - 추출된 색상으로 은은한 빛 효과 */}
        <div
          className="absolute inset-0 transition-all duration-1000"
          style={{
            background: subtleGlowStyle,
            opacity: extractedColor ? 0.8 : 0.6,
          }}
        />

        {/* Edge highlight - 가장자리 은은한 하이라이트 */}
        <div
          className="absolute inset-0 transition-all duration-1000"
          style={{
            background: edgeHighlightStyle,
            opacity: extractedColor ? 0.6 : 0.4,
          }}
        />
      </div>

      {/* 색상 시프트 오버레이 (호버 시) */}
      {colorShiftOnHover && extractedColor && (
        <div
          className="absolute inset-0 opacity-0 hover:opacity-100 transition-all duration-700 ease-out"
          style={{
            background: `linear-gradient(45deg, 
              rgba(${extractedColor.vibrant.rgb}, 0.08) 0%, 
              rgba(${extractedColor.primary.rgb}, 0.04) 25%, 
              rgba(${extractedColor.muted.rgb}, 0.06) 50%, 
              rgba(${extractedColor.primary.rgb}, 0.03) 75%, 
              rgba(${extractedColor.vibrant.rgb}, 0.05) 100%)`,
            backdropFilter: 'blur(0.5px)',
          }}
        />
      )}

      {/* 로딩 상태 표시 */}
      {isExtracting && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20">
          <div className="text-white text-sm">색상 분석 중...</div>
        </div>
      )}
    </div>
  );
};

export default ChannelImageSection;
