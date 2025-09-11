'use client';

import React, { useRef, useState } from 'react';

import { ProxiedImage } from '@/components/ProxiedImage';
import { compressImage, validateImageFile } from '@/lib/utils/imageUtils';
import { useChannelTranslation, useCommonTranslation } from '@/lib/i18n/hooks';

interface EditableImageProps {
  src?: string | null;
  alt: string;
  width: number;
  height: number;
  className?: string;
  type: 'thumbnail' | 'banner';
  isOwner: boolean;
  onImageUpdate: (base64: string) => void;
  isUploading?: boolean;
  onHoverChange?: (isHovered: boolean) => void;
}

export function EditableImage({
  src,
  alt,
  width,
  height,
  className = '',
  type,
  isOwner,
  onImageUpdate,
  isUploading = false,
  onHoverChange,
}: EditableImageProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { images } = useChannelTranslation();
  const { status } = useCommonTranslation();

  const handleFileSelect = () => {
    if (!isOwner || isUploading) return;
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError(null);

    // Validate file
    const validation = validateImageFile(file, {
      maxSizeBytes: 10 * 1024 * 1024, // 10MB
      allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
    });

    if (!validation.isValid) {
      setError(validation.error || `Invalid ${type} file`);
      return;
    }

    try {
      // Different compression settings for thumbnail vs banner
      const compressionOptions =
        type === 'thumbnail'
          ? {
              maxSizeBytes: 500 * 1024, // 500KB
              maxWidth: 800,
              maxHeight: 800,
              quality: 0.8,
              format: 'jpeg' as const,
              includeDataPrefix: false, // API expects base64 without data prefix
            }
          : {
              maxSizeBytes: 800 * 1024, // 800KB for banner
              maxWidth: 1200,
              maxHeight: 300,
              quality: 0.85,
              format: 'jpeg' as const,
              includeDataPrefix: false, // API expects base64 without data prefix
            };

      const compressedBase64 = await compressImage(file, compressionOptions);

      if (compressedBase64) {
        // Remove data prefix if it exists
        const base64Data = compressedBase64.replace(/^data:image\/[a-z]+;base64,/, '');
        onImageUpdate(base64Data);
      }
    } catch (error) {
      console.error(`${type} processing error:`, error);
      setError(images.processError());
    }
  };

  const imageElement = src ? (
    <div
      onMouseEnter={() => console.log('Image element mouse enter')}
      onMouseLeave={() => console.log('Image element mouse leave')}
    >
      <ProxiedImage
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={`object-cover ${className}`}
      />
    </div>
  ) : (
    <div className={`bg-zinc-700 flex items-center justify-center ${className}`}>
      <svg className="w-8 h-8 text-zinc-500" fill="none" viewBox="0 0 24 24">
        <path
          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );

  if (!isOwner) {
    console.log('EditableImage: not owner, returning imageElement only, type:', type);
    return (
      <div
        onMouseEnter={() => console.log('Non-owner image mouse enter')}
        onMouseLeave={() => console.log('Non-owner image mouse leave')}
      >
        {imageElement}
      </div>
    );
  }

  return (
    <div
      className={`relative cursor-pointer ${
        type === 'banner' ? 'group' : '' // 배너에만 group 클래스 추가
      }`}
      onMouseEnter={() => {
        setIsHovered(true);
        onHoverChange?.(true);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        onHoverChange?.(false);
      }}
      onClick={handleFileSelect}
    >
      {imageElement}

      {/* Edit overlay */}
      {(isHovered || isUploading) && (
        <div
          className={`absolute inset-0 flex items-center justify-center transition-opacity ${
            type === 'banner'
              ? 'bg-black/70' // 배너는 더 진한 오버레이
              : 'bg-black/50' // 썸네일은 기존 투명도
          }`}
        >
          {isUploading ? (
            <div className="text-white text-center">
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <span className="text-sm">{images.uploading()}</span>
            </div>
          ) : (
            <div className="text-white text-center">
              <svg
                className={`mx-auto mb-2 ${
                  type === 'banner' ? 'w-10 h-10' : 'w-8 h-8' // 배너는 더 큰 아이콘
                }`}
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" stroke="currentColor" strokeWidth="2" />
              </svg>
              <span
                className={`font-medium ${
                  type === 'banner' ? 'text-base' : 'text-sm' // 배너는 더 큰 텍스트
                }`}
              >
                {type === 'thumbnail' ? images.thumbnail() : images.banner()}
              </span>
              <span
                className={`text-xs opacity-80 ${
                  type === 'banner' ? 'text-sm' : 'text-xs' // 배너는 더 큰 텍스트
                }`}
              >
                {images.uploadInstruction()}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="absolute bottom-0 left-0 right-0 bg-red-500/90 text-white text-xs p-2 rounded-b">
          {error}
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        disabled={isUploading}
      />
    </div>
  );
}
