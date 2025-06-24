'use client';

import React, { useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import type { ImageItemData, ImageDetail } from '../_types/image-grid';
import type { ItemConfig } from './ThiingsGrid';
import { ITEM_WIDTH, ITEM_HEIGHT } from '../_constants/image-grid';
import { ArtistBadge } from './ArtistBadge';
import { LikeDisplay } from './image-action/LikeDisplay';

interface ImageGridItemProps {
  image: ImageItemData;
  config: ItemConfig;
  hoveredItemId: string | null;
  hoveredImageDetailData: ImageDetail | null;
  isFetchingDetail: boolean;
  detailError: string | null;
  onImageLoaded: (imageId: string) => void;
  onMouseEnterItem: (itemId: string) => void;
  onMouseLeaveItem: () => void;
  onToggleLike: (imageDocId: string) => void;
  isLiked: boolean;
  onClick: (imageItem: ImageItemData, imageDetailFromItem: ImageDetail | null) => void;
  isSelected: boolean;
}

const ImageGridItem: React.FC<ImageGridItemProps> = ({
  image,
  config,
  hoveredItemId,
  hoveredImageDetailData,
  isFetchingDetail,
  detailError,
  onImageLoaded,
  onMouseEnterItem,
  onMouseLeaveItem,
  onToggleLike,
  isLiked,
  onClick,
  isSelected,
}) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // 모바일 감지
  useEffect(() => {
    const checkMobile = () => {
      if (typeof window === 'undefined') return;
      
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      const isMobileWidth = window.innerWidth <= 768;
      setIsMobile(isTouchDevice || isMobileWidth);
    };
    
    checkMobile();
    
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', checkMobile);
      return () => window.removeEventListener('resize', checkMobile);
    }
  }, []);

  const handleImageLoad = useCallback(() => {
    setIsImageLoaded(true);
    onImageLoaded(image.id);
  }, [image.id, onImageLoaded]);

  const handleImageError = useCallback(() => {
    setImageError(true);
  }, []);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
    onMouseEnterItem(image.image_doc_id);
  }, [image.image_doc_id, onMouseEnterItem]);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    onMouseLeaveItem();
  }, [onMouseLeaveItem]);

  const handleClick = useCallback(() => {
    onClick(image, hoveredImageDetailData);
  }, [image, hoveredImageDetailData, onClick]);

  const handleLikeClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (image.image_doc_id) {
      onToggleLike(image.image_doc_id);
    }
  }, [image.image_doc_id, onToggleLike]);

  const handleArtistClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    // 아티스트 클릭 처리 로직
    console.log('Artist clicked:', image.image_doc_id);
  }, [image.image_doc_id]);

  const isCurrentlyHovered = hoveredItemId === image.image_doc_id;
  const isAnotherImageHovered = hoveredItemId !== null && !isCurrentlyHovered;
  const showDetail = isCurrentlyHovered && hoveredImageDetailData && !isFetchingDetail && !detailError;
  const shouldShowHoverInfo = isCurrentlyHovered || isHovered;

  // 아티스트 이름 추출 - 더 간단한 방식으로 수정
  let primaryArtistName: string | null = null;
  if (shouldShowHoverInfo && hoveredImageDetailData && hoveredImageDetailData.doc_id === image.image_doc_id) {
    // metadata에서 아티스트 정보 찾기
    if (hoveredImageDetailData.metadata) {
      // 여러 방법으로 아티스트 정보 찾기
      const metadata = hoveredImageDetailData.metadata;
      
      // 1. profile_image_url이 있는 키 찾기 (보통 아티스트 정보)
      const artistKey = Object.keys(metadata).find(key => 
        key !== 'profile_image_url' && 
        metadata[key] && 
        typeof metadata[key] === 'string' &&
        (metadata[key] as string).length > 0 &&
        (metadata[key] as string).length < 50
      );
      
      if (artistKey) {
        primaryArtistName = metadata[artistKey] as string;
      }
      
      // 2. 아직 찾지 못했다면, profile_image_url이 있는 경우 해당 키의 이름 사용
      if (!primaryArtistName && metadata.profile_image_url) {
        const profileKey = Object.keys(metadata).find(key => 
          key !== 'profile_image_url' && 
          metadata[key] && 
          typeof metadata[key] === 'string'
        );
        if (profileKey) {
          primaryArtistName = metadata[profileKey] as string;
        }
      }
      
      // 3. 여전히 없다면 upload_by 정보 사용
      if (!primaryArtistName && hoveredImageDetailData.upload_by) {
        primaryArtistName = hoveredImageDetailData.upload_by;
      }
    }
  }

  // 동적 클래스 생성
  let itemClasses = `absolute bg-black box-border flex justify-center items-center transition-all duration-300 ease-out group opacity-100`;

  if (isCurrentlyHovered || isHovered) {
    itemClasses += ' overflow-visible';
  } else {
    itemClasses += ' overflow-hidden';
  }

  if (isImageLoaded) {
    itemClasses += ' opacity-100';
  } else {
    itemClasses += ' opacity-30';
  }

  // 호버 효과
  if (isMobile) {
    if (isHovered) {
      itemClasses += ' scale-105 z-30 brightness-110';
    } else if (isAnotherImageHovered) {
      itemClasses += ' opacity-40 scale-95 z-0 brightness-75';
    } else {
      itemClasses += ' z-10';
    }
  } else {
    if (isCurrentlyHovered) {
      itemClasses += ' scale-105 z-30 brightness-110';
    } else if (isAnotherImageHovered) {
      itemClasses += ' opacity-40 scale-95 z-0 brightness-75';
    } else {
      itemClasses += ' z-10';
    }
  }

  // 선택 상태
  if (isSelected) {
    itemClasses += ' ring-4 ring-yellow-400';
  }

  return (
    <div
      className={itemClasses}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      style={{
        transform: config.isMoving ? 'scale(0.95)' : undefined,
        width: ITEM_WIDTH,
        height: ITEM_HEIGHT,
      }}
    >
      {/* 이미지 */}
      <div className="relative w-full h-full">
        {!imageError ? (
          <Image
            src={image.src}
            alt={image.alt}
            fill
            className="object-cover transition-opacity duration-300"
            style={{ opacity: isImageLoaded ? 1 : 0 }}
            onLoad={handleImageLoad}
            onError={handleImageError}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}

        {/* 로딩 인디케이터 */}
        {!isImageLoaded && !imageError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600"></div>
          </div>
        )}

        {/* 아티스트 배지 - 좌측 하단 */}
        {primaryArtistName && shouldShowHoverInfo && (
          <div className="absolute bottom-4 left-4 z-20">
            <ArtistBadge
              artistName={primaryArtistName}
              onClick={handleArtistClick}
            />
          </div>
        )}

        {/* 좋아요 표시 - 우측 하단 */}
        {shouldShowHoverInfo && (
          <div className="absolute bottom-4 right-4 z-20">
            <LikeDisplay
              likeCount={hoveredImageDetailData?.like || 0}
              isLiked={isLiked}
              onLikeClick={handleLikeClick}
            />
          </div>
        )}

        {/* 상세 정보 오버레이 */}
        {showDetail && (
          <div className="absolute inset-0 bg-black/60 text-white p-4 flex flex-col justify-end backdrop-blur-sm">
            <div className="space-y-2">
              <h3 className="font-semibold text-sm line-clamp-2">
                {hoveredImageDetailData.title || 'Untitled'}
              </h3>
              {hoveredImageDetailData.description && (
                <p className="text-xs text-gray-300 line-clamp-2">
                  {hoveredImageDetailData.description}
                </p>
              )}
              {hoveredImageDetailData.style && (
                <p className="text-xs text-gray-300">
                  {hoveredImageDetailData.style}
                </p>
              )}
            </div>
          </div>
        )}

        {/* 로딩 상태 */}
        {isCurrentlyHovered && isFetchingDetail && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
          </div>
        )}

        {/* 에러 상태 */}
        {isCurrentlyHovered && detailError && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <p className="text-white text-xs text-center px-2">
              Failed to load details
            </p>
          </div>
        )}

        {/* 호버 시 확대 효과 */}
        {(isCurrentlyHovered || isHovered) && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
        )}
      </div>
    </div>
  );
};

export default ImageGridItem; 