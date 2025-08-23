'use client';

import { useEffect } from 'react';
import { getThumbnailImageUrl } from '@/lib/utils/imageProxy';

interface ImagePreloaderProps {
  images: string[];
  priority?: 'high' | 'medium' | 'low';
  maxConcurrent?: number;
}

/**
 * 이미지 프리로딩 컴포넌트
 * 중요한 이미지들을 미리 로딩하여 사용자 경험 향상
 */
export const ImagePreloader: React.FC<ImagePreloaderProps> = ({
  images,
  priority = 'medium',
  maxConcurrent = 3,
}) => {
  useEffect(() => {
    if (!images.length) return;

    const loadImages = async () => {
      // 우선순위에 따른 지연 시간
      const delay = priority === 'high' ? 0 : priority === 'medium' ? 100 : 500;
      
      if (delay > 0) {
        await new Promise(resolve => setTimeout(resolve, delay));
      }

      // 동시 로딩 제한을 위한 청크 분할
      const chunks = [];
      for (let i = 0; i < images.length; i += maxConcurrent) {
        chunks.push(images.slice(i, i + maxConcurrent));
      }

      // 순차적으로 청크 처리
      for (const chunk of chunks) {
        await Promise.allSettled(
          chunk.map(url => {
            return new Promise<void>((resolve, reject) => {
              const img = new Image();
              img.onload = () => resolve();
              img.onerror = () => reject();
              img.src = getThumbnailImageUrl(url);
            });
          })
        );
      }
    };

    loadImages();
  }, [images, priority, maxConcurrent]);

  return null; // 렌더링하지 않는 컴포넌트
};

/**
 * 중요 이미지들을 Head에 preload link로 추가
 */
export const CriticalImagePreloader: React.FC<{ images: string[] }> = ({ images }) => {
  if (typeof window !== 'undefined') return null; // 클라이언트에서는 렌더링하지 않음

  return (
    <>
      {images.slice(0, 3).map((url, index) => (
        <link
          key={index}
          rel="preload"
          as="image"
          href={getThumbnailImageUrl(url)}
          fetchPriority="high"
        />
      ))}
    </>
  );
};