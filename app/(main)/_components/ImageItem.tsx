"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { ImageItemData, ImageDetail, DecodedItem } from "../_types/image-grid";
import { ITEM_WIDTH, ITEM_HEIGHT } from "../_constants/image-grid";
import { LikeDisplay } from "./LikeDisplay"; 
import { ArtistBadge } from "./ArtistBadge"; 
import { HoverDetailEffect } from "./HoverDetailEffect";

interface ImageItemProps {
  image: ImageItemData;
  hoveredItemId: string | null;
  hoveredImageDetailData: ImageDetail | null;
  isFetchingDetail: boolean;
  detailError: string | null;
  onImageLoaded: (id: string) => void;
  onMouseEnterItem: (itemId: string, imageDocId: string) => void;
  onMouseLeaveItem: () => void;
  onToggleLike: (imageDocId: string) => Promise<void>;
  isLiked: boolean;
}

const INFO_BOX_WIDTH_PX = 170; 
const INFO_BOX_MIN_HEIGHT_PX = 135; // Min height, will adjust if item image is taller
const INFO_BOX_PADDING_Y = 8; 
const INFO_BOX_OFFSET_X_FROM_IMAGE = 15;
const BRAND_LOGO_MAX_HEIGHT = 24;
const ITEM_IMAGE_MAX_HEIGHT = 80; // Max height for the item image inside info box

const ImageItem = React.memo(function ImageItem({
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
}: ImageItemProps) {
  const router = useRouter();
  const isCurrentlyHovered = hoveredItemId === image.id;
  const isAnotherImageHovered =
    hoveredItemId !== null && !isCurrentlyHovered;

  const displayWidth =
    typeof image.width === "number" && image.width > 0
      ? image.width
      : ITEM_WIDTH;
  const displayHeight =
    typeof image.height === "number" && image.height > 0
      ? image.height
      : ITEM_HEIGHT;

  let itemClasses = `absolute bg-neutral-800 box-border flex justify-center items-center transition-all duration-300 ease-in-out group`;
  
  if (isCurrentlyHovered) {
    itemClasses += " overflow-visible"; 
  } else {
    itemClasses += " overflow-hidden";
  }

  if (image.loaded) {
    itemClasses += " opacity-100";
  } else {
    itemClasses += " opacity-30";
  }

  if (isCurrentlyHovered) {
    itemClasses += " scale-105 -rotate-y-3 z-30 brightness-110";
  } else if (isAnotherImageHovered) {
    itemClasses += " opacity-40 blur-xs scale-95 z-0 brightness-75";
  } else {
    itemClasses += " z-10";
  }

  let primaryArtistName: string | null = null;
  if (
    isCurrentlyHovered &&
    hoveredImageDetailData &&
    hoveredImageDetailData.doc_id === image.image_doc_id
  ) {
    if (hoveredImageDetailData.metadata) {
      const metadataEntries = Object.entries(
        hoveredImageDetailData.metadata
      );
      const personEntry = metadataEntries.find(
        ([key, value]) =>
          typeof value === "string" &&
          key !== "profile_image_url" &&
          !key.startsWith("http") && 
          value.length > 0 && value.length < 30
      );
      if (personEntry) {
        primaryArtistName = personEntry[1] as string;
      }
    }
  }

  const handleImageClick = () => {
    router.push(`/details-update/${image.image_doc_id}`);
  };

  const handleArtistClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (primaryArtistName) {
      console.log("Artist badge clicked in ImageItem:", primaryArtistName);
      // router.push(`/artist/${primaryArtistName}`); // Example navigation
    }
  };

  const handleLikeToggle = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    console.log("Like clicked in ImageItem for image:", image.image_doc_id);
    onToggleLike(image.image_doc_id);
  };

  const isPriorityImage = image.id === '0_0'; // 예시 조건입니다. 실제 조건에 맞게 수정 필요합니다.

  const handleImageLoad = () => {
    onImageLoaded(image.id);
  };

  return (
    <div
      key={image.id}
      className={`${itemClasses} cursor-pointer`}
      style={{
        width: `${ITEM_WIDTH}px`,
        height: `${ITEM_HEIGHT}px`,
        left: `${image.left}px`,
        top: `${image.top}px`,
        perspective: '1000px',
        transformStyle: 'preserve-3d',
      }}
      onMouseEnter={() => onMouseEnterItem(image.id, image.image_doc_id)}
      onMouseLeave={onMouseLeaveItem}
      onClick={handleImageClick}
    >
      <div className="relative w-full h-full">
        <Image
          src={image.src}
          alt={image.alt || `Image ${image.id}`}
          width={displayWidth}
          height={displayHeight}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
            isCurrentlyHovered || !isAnotherImageHovered
              ? "opacity-100"
              : "opacity-50"
          }`}
          style={{
            filter:
              isCurrentlyHovered || !isAnotherImageHovered
                ? "none"
                : "grayscale(80%) brightness(0.7)",
            transition:
              "opacity 300ms ease-in-out, filter 300ms ease-in-out",
          }}
          onLoad={handleImageLoad}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          quality={75}
          priority={isPriorityImage}
        />
        {isCurrentlyHovered && (
          <div className="absolute inset-0 w-full h-full flex flex-col justify-between pointer-events-none bg-gradient-to-t from-black/70 via-black/40 to-transparent">
            <div className="p-3 pointer-events-none"> 
              {isFetchingDetail &&
                hoveredImageDetailData?.doc_id !== image.image_doc_id && (
                  <div className="absolute top-2 right-2 p-1 bg-black/50 rounded-full">
                    <div className="w-3 h-3 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              {detailError &&
                hoveredImageDetailData?.doc_id !== image.image_doc_id && (
                  <div className="absolute top-2 right-2 p-1 text-red-500 text-xs bg-black/50 rounded">
                    Error!
                  </div>
                )}
              {hoveredImageDetailData &&
                hoveredImageDetailData.doc_id === image.image_doc_id && (
                  <>
                    {Object.values(hoveredImageDetailData.items || {}).flatMap(
                      (itemArray: DecodedItem[] | undefined, arrayIndex: number) => {
                        if (!itemArray || itemArray.length === 0) {
                          return [];
                        }
                        return itemArray.map((decodedItem, itemIndex) => {
                          const itemName = decodedItem?.item?.item?.metadata?.name ?? "Unknown Item";
                          const brandName = decodedItem?.item?.brand_name ?? "Unknown Brand";
                          const itemId = decodedItem?.item?.item?._id ?? `fallback-id-${arrayIndex}-${itemIndex}`;
                          const decodedItemKey = `${image.id}-dot-${arrayIndex}-${itemIndex}-${itemId}`;
                          
                          const positionTop = decodedItem?.position?.top ?? 50;
                          const positionLeft = decodedItem?.position?.left ?? 50;
                          const parsedTop = typeof positionTop === 'string' ? parseFloat(positionTop) : positionTop;
                          const parsedLeft = typeof positionLeft === 'string' ? parseFloat(positionLeft) : positionLeft;

                          if (isNaN(parsedTop) || isNaN(parsedLeft)) return null;

                          return (
                            <div 
                              key={decodedItemKey}
                              className="absolute pointer-events-none"
                              style={{
                                top: `${parsedTop}%`,
                                left: `${parsedLeft}%`,
                                transform: 'translate(-50%, -50%)',
                              }}
                            >
                              <div
                                className="absolute left-1/2 top-full transform -translate-x-1/2 mt-1 w-2 h-2 bg-yellow-400 rounded-full border border-white/70 shadow-md"
                                title={`${itemName} by ${brandName}`}
                              ></div>
                            </div>
                          );
                        });
                      }
                    )}
                  </>
                )}
            </div>
            {(primaryArtistName ||
              (hoveredImageDetailData &&
                hoveredImageDetailData.doc_id === image.image_doc_id &&
                typeof hoveredImageDetailData.like === "number")) && (
              <div className="px-4 pb-4 pt-12">
                <div className="flex justify-between items-center">
                  {primaryArtistName && (
                    <ArtistBadge 
                      artistName={primaryArtistName} 
                      onClick={handleArtistClick}
                      className="pointer-events-auto"
                    />
                  )}
                  {hoveredImageDetailData &&
                    hoveredImageDetailData.doc_id === image.image_doc_id &&
                    typeof hoveredImageDetailData.like === "number" && (
                      <LikeDisplay
                        likeCount={hoveredImageDetailData.like}
                        isLiked={isLiked}
                        onLikeClick={handleLikeToggle}
                        className="pointer-events-auto"
                      />
                    )}
                </div>
              </div>
            )}
          </div>
        )}
        
        {isCurrentlyHovered && hoveredImageDetailData && hoveredImageDetailData.doc_id === image.image_doc_id && (
          <div 
            className="absolute inset-0 w-full h-full pointer-events-none" 
            style={{transformStyle: 'preserve-3d'}}
          >
            <HoverDetailEffect
              itemContainerWidth={ITEM_WIDTH}
              itemContainerHeight={ITEM_HEIGHT}
              detailData={hoveredImageDetailData} 
            />
          </div>
        )}
      </div>
    </div>
  );
});

export default ImageItem; 