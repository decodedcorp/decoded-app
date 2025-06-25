'use client';

import React, { useState, useCallback, useEffect, useMemo } from 'react';
import Image from 'next/image';
import type { ImageItemData, ImageDetail, DecodedItem } from '../_types/image-grid';
import type { ItemConfig } from './ThiingsGrid';
import { ITEM_WIDTH, ITEM_HEIGHT } from '../_constants/image-grid';
import { ArtistBadge } from './ArtistBadge';
import { LikeDisplay } from './image-action/LikeDisplay';
import { ItemMarker } from './image-action/ItemMarker';
import { ItemDetailCard } from './image-action/ItemDetailCard';

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

const ImageGridItem: React.FC<ImageGridItemProps> = React.memo(({
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
  const [expandedMarkerKey, setExpandedMarkerKey] = useState<string | null>(null);

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

  // 아이템 디테일 카드 초기화 - hover 상태나 선택 상태가 변경될 때
  useEffect(() => {
    const isCurrentlyHovered = hoveredItemId === image.id;
    const shouldShowMarkers = (isCurrentlyHovered || isHovered || isSelected) && hoveredImageDetailData;
    
    // 더 이상 마커를 표시하지 않아야 할 때 expandedMarkerKey 초기화
    if (!shouldShowMarkers) {
      setExpandedMarkerKey(null);
    }
  }, [hoveredItemId, isHovered, isSelected, hoveredImageDetailData, image.id]);

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

  const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    // 마커나 마커 관련 요소를 클릭한 경우 이미지 클릭 이벤트를 방지
    const target = e.target as HTMLElement;
    const isMarkerClick = target.closest('[data-marker="true"]') || 
                         target.closest('[data-detail-card="true"]') ||
                         target.closest('[data-marker-container="true"]') ||
                         target.closest('[style*="z-index: 40"]');
    
    if (isMarkerClick) {
      e.stopPropagation();
      return;
    }
    
    console.log('ImageGridItem handleClick called:', { image, hoveredImageDetailData });
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

  const isCurrentlyHovered = hoveredItemId === image.id;
  const isAnotherImageHovered = hoveredItemId !== null && !isCurrentlyHovered;
  const showDetail = (isCurrentlyHovered || isSelected) && hoveredImageDetailData && !isFetchingDetail && !detailError;

  // 아티스트 이름 추출 - hover 상태일 때만 (메모이제이션)
  const primaryArtistName = useMemo(() => {
    if ((isCurrentlyHovered || isHovered) && hoveredImageDetailData && 
        hoveredImageDetailData.doc_id === image.image_doc_id) {
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
          return metadata[artistKey] as string;
        }
        
        // 2. 아직 찾지 못했다면, profile_image_url이 있는 경우 해당 키의 이름 사용
        if (metadata.profile_image_url) {
          const profileKey = Object.keys(metadata).find(key => 
            key !== 'profile_image_url' && 
            metadata[key] && 
            typeof metadata[key] === 'string'
          );
          if (profileKey) {
            return metadata[profileKey] as string;
          }
        }
        
        // 3. 여전히 없다면 upload_by 정보 사용
        if (hoveredImageDetailData.upload_by) {
          return hoveredImageDetailData.upload_by;
        }
      }
    }
    return null;
  }, [isCurrentlyHovered, isHovered, hoveredImageDetailData, image.image_doc_id]);

  // 동적 클래스 생성 (메모이제이션)
  const itemClasses = useMemo(() => {
    let classes = `absolute bg-black box-border flex justify-center items-center transition-all duration-300 ease-out group opacity-100`;

    if (isCurrentlyHovered || isHovered) {
      classes += ' overflow-visible';
    } else {
      classes += ' overflow-hidden';
    }

    if (isImageLoaded) {
      classes += ' opacity-100';
    } else {
      classes += ' opacity-0';
    }

    // 호버 효과
    if (isMobile) {
      if (isHovered) {
        classes += ' scale-105 z-30 brightness-110';
      } else if (isAnotherImageHovered) {
        classes += ' opacity-40 scale-95 z-0 brightness-75';
      } else {
        classes += ' z-10';
      }
    } else {
      if (isCurrentlyHovered) {
        classes += ' scale-105 z-30 brightness-110';
      } else if (isAnotherImageHovered) {
        classes += ' opacity-40 scale-95 z-0 brightness-75';
      } else {
        classes += ' z-10';
      }
    }

    // 선택 상태
    if (isSelected) {
      classes += ' ring-4 ring-yellow-400';
    }

    return classes;
  }, [
    isCurrentlyHovered, 
    isHovered, 
    isImageLoaded, 
    isMobile, 
    isAnotherImageHovered, 
    isSelected
  ]);

  // 스타일 객체 메모이제이션
  const itemStyle = useMemo(() => ({
    transform: config.isMoving ? 'scale(0.98)' : undefined,
    width: ITEM_WIDTH,
    height: ITEM_HEIGHT,
    willChange: 'transform, opacity',
    backfaceVisibility: 'hidden' as const,
    // 스크롤 중일 때는 더 적극적인 최적화
    ...(config.isMoving && {
      transition: 'none',
      filter: 'none',
      transform: 'scale(0.98)',
    }),
  }), [config.isMoving]);

  return (
    <div
      className={itemClasses}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      style={itemStyle}
    >
      {/* 이미지 */}
      <div className="relative w-full h-full">
        {!imageError ? (
          <Image
            src={image.src}
            alt={image.alt}
            fill
            className="object-cover transition-opacity duration-300"
            style={{ 
              opacity: isImageLoaded ? 1 : 0,
              willChange: 'opacity',
            }}
            onLoad={handleImageLoad}
            onError={handleImageError}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={false}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}

        {/* 로딩 인디케이터 - 이미지가 로딩되지 않았을 때만 표시 */}
        {!isImageLoaded && !imageError && (
          <div className="absolute inset-0 bg-black flex items-center justify-center border border-gray-800">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#EAFD66] border-t-transparent"></div>
          </div>
        )}

        {/* 아티스트 배지 - 좌측 하단 */}
        {primaryArtistName && (isCurrentlyHovered || isHovered) && (
          <div className="absolute bottom-4 left-4 z-20">
            <ArtistBadge
              artistName={primaryArtistName}
              onClick={handleArtistClick}
            />
          </div>
        )}

        {/* 좋아요 표시 - 우측 하단 */}
        {(isCurrentlyHovered || isHovered) && !isFetchingDetail && hoveredImageDetailData && (
          <div className="absolute bottom-4 right-4 z-20">
            <LikeDisplay
              likeCount={hoveredImageDetailData.like || 0}
              isLiked={isLiked}
              onLikeClick={handleLikeClick}
            />
          </div>
        )}

        {/* 로딩 스피너 - 우측 상단 (로딩 중일 때만) */}
        {(isCurrentlyHovered || isHovered) && isFetchingDetail && !isSelected && (
          <div className="absolute top-4 right-4 z-20">
            <div className="flex items-center justify-center w-6 h-6 bg-black/60 rounded-full backdrop-blur-sm">
              <div className="animate-spin rounded-full h-3 w-3 border-2 border-[#EAFD66] border-t-transparent"></div>
            </div>
          </div>
        )}

        {/* 상세 정보 오버레이 */}
        {showDetail && !isSelected && (
          <div className="absolute inset-0 bg-black/60 text-white p-4 flex flex-col justify-end">
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
        {isCurrentlyHovered && isFetchingDetail && !isSelected && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
          </div>
        )}

        {/* 에러 상태 */}
        {isCurrentlyHovered && detailError && !isSelected && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <p className="text-white text-xs text-center px-2">
              Failed to load details
            </p>
          </div>
        )}

        {/* 호버 시 확대 효과 */}
        {(isCurrentlyHovered || isHovered) && !isSelected && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
        )}

        {/* 아이템 마커들 - hover 시에만 표시 */}
        {(isCurrentlyHovered || isHovered) && hoveredImageDetailData && hoveredImageDetailData.items && (
          <>
            {Object.entries(hoveredImageDetailData.items).flatMap(
              ([key, decodedItems]) =>
                decodedItems.map((decodedItem: DecodedItem, index: number) => {
                  const markerKey = `${hoveredImageDetailData.doc_id}-marker-${key}-${index}`;
                  const isExpanded = expandedMarkerKey === markerKey;

                  // 마커 위치 계산
                  const position = decodedItem.position;
                  const parsedTop = typeof position?.top === 'string' ? parseFloat(position.top) : position?.top;
                  const parsedLeft = typeof position?.left === 'string' ? parseFloat(position.left) : position?.left;
                  const itemPctTop = parsedTop;
                  const itemPctLeft = parsedLeft;
                  const markerX = (itemPctLeft / 100) * ITEM_WIDTH;
                  const markerY = (itemPctTop / 100) * ITEM_HEIGHT;

                  const sharedStyle: React.CSSProperties = {
                    position: 'absolute',
                    left: `${markerX - 24 / 2}px`,
                    top: `${markerY - 24 / 2}px`,
                    zIndex: 40,
                    pointerEvents: 'auto',
                    transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
                  };

                  return isExpanded ? (
                    <div key={markerKey} style={sharedStyle} data-marker-container="true">
                      <ItemDetailCard decodedItem={decodedItem} />
                    </div>
                  ) : (
                    <ItemMarker
                      key={markerKey}
                      decodedItem={decodedItem}
                      itemContainerWidth={ITEM_WIDTH}
                      itemContainerHeight={ITEM_HEIGHT}
                      detailDocId={hoveredImageDetailData.doc_id}
                      itemIndex={index}
                      onExpand={() => setExpandedMarkerKey(markerKey)}
                    />
                  );
                })
            )}
          </>
        )}
      </div>
    </div>
  );
});

ImageGridItem.displayName = 'ImageGridItem';

export default ImageGridItem; 