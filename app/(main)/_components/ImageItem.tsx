'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import type {
  ImageItemData,
  ImageDetail,
  DecodedItem,
} from '../_types/image-grid';
import { ITEM_WIDTH, ITEM_HEIGHT } from '../_constants/image-grid';
import { LikeDisplay } from './LikeDisplay';
import { ArtistBadge } from './ArtistBadge';
import { HoverDetailEffect } from './HoverDetailEffect';
import { TypeAnimation } from 'react-type-animation';
import { TypeWriter } from './TypeWriter';
import { ImageOverlay } from './ImageOverlay';
import dynamic from 'next/dynamic';
import { Dialog, DialogContent } from '@/components/ui/dialog';
const DetailsUpdateModal = dynamic(() => import('./DetailsUpdateModal'));

interface ImageItemProps {
  image: ImageItemData;
  hoveredItemId: string | null;
  hoveredImageDetailData: ImageDetail | null;
  isFetchingDetail: boolean;
  detailError: string | null;
  onImageLoaded: (id: string) => void;
  onMouseEnterItem: (itemId: string, imageDocId: string) => void;
  onMouseLeaveItem: () => void;
  onToggleLike: (imageDocId: string) => void;
  isLiked: boolean;
  onClick: (image: ImageItemData, detail: ImageDetail | null) => void;
}

const INFO_BOX_WIDTH_PX = 170;
const INFO_BOX_MIN_HEIGHT_PX = 135; // Min height, will adjust if item image is taller
const INFO_BOX_PADDING_Y = 8;
const INFO_BOX_OFFSET_X_FROM_IMAGE = 15;
const BRAND_LOGO_MAX_HEIGHT = 24;
const ITEM_IMAGE_MAX_HEIGHT = 80; // Max height for the item image inside info box

const ENABLE_FLIP_EFFECT = true; // true로 설정하면 플립 효과 활성화

const ImageItem: React.FC<ImageItemProps> = ({
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
}) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isOverlayOpen, setIsOverlayOpen] = React.useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = React.useState(false);
  const [previewData, setPreviewData] = React.useState<any>(null);
  const [modalData, setModalData] = useState<any>(null);
  const [isHovered, setIsHovered] = useState(false);
  const isCurrentlyHovered = hoveredItemId === image.id;
  const isAnotherImageHovered = hoveredItemId !== null && !isCurrentlyHovered;

  const displayWidth =
    typeof image.width === 'number' && image.width > 0
      ? image.width
      : ITEM_WIDTH;
  const displayHeight =
    typeof image.height === 'number' && image.height > 0
      ? image.height
      : ITEM_HEIGHT;

  let itemClasses = `absolute bg-black box-border flex justify-center items-center transition-all duration-300 ease-in-out group`;

  if (isCurrentlyHovered) {
    itemClasses += ' overflow-visible';
  } else {
    itemClasses += ' overflow-hidden';
  }

  if (image.loaded) {
    itemClasses += ' opacity-100';
  } else {
    itemClasses += ' opacity-30';
  }

  if (isCurrentlyHovered) {
    itemClasses += ' scale-105 -rotate-y-3 z-30 brightness-110';
  } else if (isAnotherImageHovered) {
    itemClasses += ' opacity-40 blur-xs scale-95 z-0 brightness-75';
  } else {
    itemClasses += ' z-10';
  }

  let primaryArtistName: string | null = null;
  if (
    isCurrentlyHovered &&
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

  const isPriorityImage = image.id === '0_0'; // 예시 조건입니다. 실제 조건에 맞게 수정 필요합니다.

  const handleImageLoad = () => {
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
    setIsHovered(true);
    onMouseEnterItem(image.id, image.image_doc_id);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    onMouseLeaveItem();
  };

  const getOverlayPosition = () => {
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

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Image clicked:', image);
    onClick(image, hoveredImageDetailData);
  };

  return (
    <div
      data-image-id={image.id}
      key={image.id}
      className={`${itemClasses} cursor-pointer`}
      style={{
        width: `${ITEM_WIDTH}px`,
        height: `${ITEM_HEIGHT}px`,
        left: `${image.left}px`,
        top: `${image.top}px`,
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      <Image
        src={image.src}
        alt={image.alt || `Image ${image.id}`}
        width={displayWidth}
        height={displayHeight}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
          isHovered || !isAnotherImageHovered ? 'opacity-100' : 'opacity-50'
        }`}
        style={{
          filter:
            isHovered || !isAnotherImageHovered
              ? 'none'
              : 'grayscale(80%) brightness(0.7)',
          transition: 'opacity 300ms ease-in-out, filter 300ms ease-in-out',
        }}
        onLoad={handleImageLoad}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        quality={75}
        priority={isPriorityImage}
      />

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
      {isHovered && (
        <div className="absolute bottom-4 right-4 z-20">
          <LikeDisplay
            likeCount={image.likes || 0}
            isLiked={isLiked}
            onLikeClick={handleLikeToggle}
          />
        </div>
      )}

      {/* ImageOverlay */}
      <ImageOverlay
        isOpen={isOverlayOpen}
        isCurrentlyHovered={isCurrentlyHovered}
        onClose={() => {
          setIsOverlayOpen(false);
        }}
      />

      {/* 기존 hover 효과들 */}
      {isCurrentlyHovered &&
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
};

export default ImageItem;
