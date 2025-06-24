'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import type {
  ImageItemData,
  ImageDetail,
  DecodedItem,
} from '../_types/image-grid';
import { ITEM_WIDTH, ITEM_HEIGHT } from '../_constants/image-grid';
import { LikeDisplay } from './image-action/LikeDisplay';
import { ArtistBadge } from './ArtistBadge';
import { HoverDetailEffect } from './image-action/HoverDetailEffect';
import { TypeAnimation } from 'react-type-animation';
import { TypeWriter } from './TypeWriter';
import dynamic from 'next/dynamic';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

interface ImageItemProps {
  image: ImageItemData;
  hoveredItemId: string | null;
  hoveredImageDetailData: ImageDetail | null;
  isFetchingDetail: boolean;
  detailError: string | null;
  onImageLoaded: (imageId: string) => void;
  onMouseEnterItem: (itemId: string, imageDocId: string) => void;
  onMouseLeaveItem: () => void;
  onToggleLike: (imageDocId: string) => void;
  isLiked: boolean;
  onClick: (imageItem: ImageItemData, imageDetailFromItem: ImageDetail | null) => void;
  isSelected: boolean;
  gridConfig: {
    cellWidth: number;
    cellHeight: number;
    gap: number;
  };
}

const ImageItem: React.FC<ImageItemProps> = React.memo(
  ({
    image,
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
    gridConfig,
  }) => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [isOverlayOpen, setIsOverlayOpen] = React.useState(false);
    const [isPreviewOpen, setIsPreviewOpen] = React.useState(false);
    const [previewData, setPreviewData] = React.useState<any>(null);
    const [modalData, setModalData] = useState<any>(null);
    const [isHovered, setIsHovered] = useState(false);
    const [isTouched, setIsTouched] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const imageRef = useRef<HTMLImageElement>(null);
    const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
    const longPressTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    
    const isCurrentlyHovered = hoveredItemId === image.id;
    const isAnotherImageHovered = hoveredItemId !== null && !isCurrentlyHovered;

    // 모바일 감지
    useEffect(() => {
      const checkMobile = () => {
        // SSR 안전성 체크
        if (typeof window === 'undefined') {
          return;
        }
        
        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        const isMobileWidth = window.innerWidth <= 768;
        setIsMobile(isTouchDevice || isMobileWidth);
      };
      
      checkMobile();
      
      // SSR 안전성 체크
      if (typeof window !== 'undefined') {
        window.addEventListener('resize', checkMobile);
        
        return () => window.removeEventListener('resize', checkMobile);
      }
    }, []);

    const displayWidth =
      typeof image.width === 'number' && image.width > 0
        ? image.width
        : ITEM_WIDTH;
    const displayHeight =
      typeof image.height === 'number' && image.height > 0
        ? image.height
        : ITEM_HEIGHT;

    let itemClasses = `absolute bg-black box-border flex justify-center items-center transition-all duration-200 ease-out group opacity-100`;

    if (isCurrentlyHovered || isTouched) {
      itemClasses += ' overflow-visible';
    } else {
      itemClasses += ' overflow-hidden';
    }

    if (image.loaded) {
      itemClasses += ' opacity-100';
    } else {
      itemClasses += ' opacity-30';
    }

    // 더 부드러운 hover 효과
    if (isMobile) {
      if (isTouched) {
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

    let primaryArtistName: string | null = null;
    if (
      (isCurrentlyHovered || isTouched) &&
      hoveredImageDetailData &&
      hoveredImageDetailData.doc_id === image.image_doc_id
    ) {
      if (hoveredImageDetailData.metadata) {
        const metadataEntries = Object.entries(hoveredImageDetailData.metadata);
        const personEntry = metadataEntries.find(
          ([key, value]) =>
            typeof value === 'string' &&
            key !== 'profile_image_url' &&
            !key.startsWith('http') &&
            value.length > 0 &&
            value.length < 30
        );
        if (personEntry) {
          primaryArtistName = personEntry[1] as string;
        }
      }
    }

    const handleImageClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      console.log('Header clicked, setting overlay to true');
      setIsOverlayOpen(true);
    };

    const handleMainImageClick = async (e: React.MouseEvent) => {
      e.stopPropagation();
      try {
        const response = await fetch(`/api/details-update/${image.image_doc_id}`);
        const data = await response.json();
        setPreviewData(data);
        setIsPreviewOpen(true);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };

    const handleViewDetails = async () => {
      try {
        const response = await fetch(`/api/details-update/${image.image_doc_id}`);
        const data = await response.json();
        setModalData(data);
        const params = new URLSearchParams(searchParams.toString());
        params.set('modal', image.image_doc_id);
        router.push(`?${params.toString()}`, { scroll: false });
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };

    const handleArtistClick = (e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation();
      if (primaryArtistName) {
        console.log('Artist badge clicked in ImageItem:', primaryArtistName);
        // router.push(`/artist/${primaryArtistName}`); // Example navigation
      }
    };

    const handleLikeToggle = (e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation();
      console.log('Like clicked in ImageItem for image:', image.image_doc_id);
      onToggleLike(image.image_doc_id);
    };

    const handleImageLoad = () => {
      console.log('이미지 로드됨:', image.id);
      setIsLoaded(true);
      onImageLoaded(image.id);
    };

    // 라우트 프리페칭을 위한 함수
    const prefetchRoute = async () => {
      try {
        // 해당 라우트의 데이터를 미리 가져옵니다
        const response = await fetch(`/api/details-update/${image.image_doc_id}`);
        const data = await response.json();
        setPreviewData(data);
        setIsPreviewOpen(true);
      } catch (error) {
        console.error('Failed to prefetch route:', error);
      }
    };

    // 현재 모달이 열려있는지 확인
    const isModalOpen = searchParams.get('modal') === image.image_doc_id;

    const handleCloseModal = () => {
      const params = new URLSearchParams(searchParams.toString());
      params.delete('modal');
      router.push(`?${params.toString()}`, { scroll: false });
    };

    const handleMouseEnter = () => {
      if (!isMobile) {
        setIsHovered(true);
        // 스크롤 중에도 hover 허용 (thiings.co 스타일)
        requestAnimationFrame(() => {
          onMouseEnterItem(image.id, image.image_doc_id);
        });
      }
    };

    const handleMouseLeave = () => {
      if (!isMobile) {
        setIsHovered(false);
        requestAnimationFrame(() => {
          onMouseLeaveItem();
        });
      }
    };

    // 터치 이벤트 핸들러들
    const handleTouchStart = (e: React.TouchEvent) => {
      if (isMobile) {
        e.preventDefault(); // 기본 터치 동작 방지
        const touch = e.touches[0];
        touchStartRef.current = {
          x: touch.clientX,
          y: touch.clientY,
          time: Date.now()
        };

        // 롱프레스 감지
        longPressTimeoutRef.current = setTimeout(() => {
          setIsTouched(true);
          onMouseEnterItem(image.id, image.image_doc_id);
        }, 500);
      }
    };

    const handleTouchMove = (e: React.TouchEvent) => {
      if (isMobile && touchStartRef.current) {
        const touch = e.touches[0];
        const deltaX = Math.abs(touch.clientX - touchStartRef.current.x);
        const deltaY = Math.abs(touch.clientY - touchStartRef.current.y);
        
        // 터치가 너무 많이 움직이면 롱프레스 취소
        if (deltaX > 10 || deltaY > 10) {
          if (longPressTimeoutRef.current) {
            clearTimeout(longPressTimeoutRef.current);
            longPressTimeoutRef.current = null;
          }
          // 스크롤 허용을 위해 기본 동작 방지 해제
          e.stopPropagation();
        }
      }
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
      if (isMobile) {
        if (longPressTimeoutRef.current) {
          clearTimeout(longPressTimeoutRef.current);
          longPressTimeoutRef.current = null;
        }

        if (touchStartRef.current) {
          const touch = e.changedTouches[0];
          const deltaX = Math.abs(touch.clientX - touchStartRef.current.x);
          const deltaY = Math.abs(touch.clientY - touchStartRef.current.y);
          const deltaTime = Date.now() - touchStartRef.current.time;

          // 탭으로 간주할 수 있는 조건 (짧은 시간, 작은 이동)
          if (deltaTime < 300 && deltaX < 10 && deltaY < 10) {
            e.preventDefault();
            handleClick(e as any);
          }
        }

        // 터치 상태 해제
        setTimeout(() => {
          setIsTouched(false);
          onMouseLeaveItem();
        }, 1000); // 1초 후 터치 상태 해제
      }
    };

    const getOverlayPosition = () => {
      // SSR 안전성 체크
      if (typeof window === 'undefined') {
        return 'center';
      }
      
      const screenWidth = window.innerWidth;
      const sectionWidth = screenWidth / 3;
      const imageCenter = image.left + ITEM_WIDTH / 2;

      // 1번째 영역 (왼쪽)
      if (imageCenter < sectionWidth) {
        return 'right';
      }
      // 2번째 영역 (가운데)
      else if (imageCenter < sectionWidth * 2) {
        return 'center';
      }
      // 3번째 영역 (오른쪽)
      else {
        return 'left';
      }
    };

    const handleClick = (e: React.MouseEvent | React.TouchEvent) => {
      e.preventDefault();
      e.stopPropagation();
      console.log('Image clicked:', image);
      onClick(image, hoveredImageDetailData);
    };

    // 디버깅 팁: 아래 로그를 추가하면 React.memo 덕분에
    // 이 컴포넌트가 훨씬 덜 렌더링되는 것을 확인할 수 있습니다.
    console.log(`Rendering Item: ${image.id}`);

    return (
      <div
        data-image-id={image.id}
        key={image.id}
        className={`${itemClasses} relative h-full w-full cursor-pointer touch-manipulation select-none`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={!isMobile ? handleClick : undefined}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        tabIndex={0}
        role="button"
        aria-label={`Image ${image.id} - ${image.alt || 'Decoded image'}`}
        aria-pressed={isSelected}
      >
        {/* <Image
          ref={imageRef}
          src={image.src}
          alt={image.alt || 'Decoded image'}
          width={displayWidth}
          height={displayHeight}
          className="absolute inset-0 h-full w-full object-cover transition-opacity duration-300 opacity-100"
          onLoad={handleImageLoad}
          onError={(e) => console.error(`Image failed to load: ${image.src}`, e)}
          priority={image.id === '0_0'}
          unoptimized
        /> */}

        <div
          className="absolute inset-0 flex h-full w-full items-center justify-center border border-dashed border-red-500 font-mono text-lg text-black"
          style={{
            backgroundColor: 'white',
          }}
        >
          {image.id}
        </div>

        {/* ArtistBadge 추가 */}
        {primaryArtistName && (
          <div className="absolute bottom-4 left-4 z-20">
            <ArtistBadge
              artistName={primaryArtistName}
              onClick={handleArtistClick}
            />
          </div>
        )}

        {/* LikeDisplay 추가 */}
        {(isHovered || isTouched) && (
          <div className="absolute bottom-4 right-4 z-20">
            <LikeDisplay
              likeCount={image.likes || 0}
              isLiked={isLiked}
              onLikeClick={handleLikeToggle}
            />
          </div>
        )}

        {/* 기존 hover 효과들 */}
        {(isCurrentlyHovered || isTouched) &&
          !isOverlayOpen &&
          hoveredImageDetailData &&
          hoveredImageDetailData.doc_id === image.image_doc_id && (
            <div
              className="absolute inset-0 w-full h-full pointer-events-none"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <HoverDetailEffect
                itemContainerWidth={ITEM_WIDTH}
                itemContainerHeight={ITEM_HEIGHT}
                detailData={hoveredImageDetailData}
              />
            </div>
          )}
      </div>
    );
  },
);

ImageItem.displayName = 'ImageItem'; // React 개발자 도구에서 디버깅하기 쉽도록 이름을 지정해줍니다.

export default ImageItem;
