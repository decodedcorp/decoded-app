import React from "react";
import Image from "next/image";
import type { ImageItemData, ImageDetail, DecodedItem } from "../_types/image-grid";
import { ITEM_WIDTH, ITEM_HEIGHT } from "../_constants/image-grid";

interface ImageItemProps {
  image: ImageItemData;
  hoveredItemId: string | null;
  hoveredImageDetailData: ImageDetail | null;
  isFetchingDetail: boolean;
  detailError: string | null;
  onImageLoaded: (id: string) => void;
  onMouseEnterItem: (itemId: string, imageDocId: string) => void;
  onMouseLeaveItem: () => void;
}

interface HoverDetailEffectProps {
  itemContainerWidth: number;
  itemContainerHeight: number;
  detailData: ImageDetail | null;
}

const INFO_BOX_WIDTH_PX = 170; 
const INFO_BOX_MIN_HEIGHT_PX = 90; // Min height, will adjust if item image is taller
const INFO_BOX_PADDING_Y = 8; 
const INFO_BOX_OFFSET_X_FROM_IMAGE = 15;
const BRAND_LOGO_MAX_HEIGHT = 24;
const ITEM_IMAGE_MAX_HEIGHT = 60; // Max height for the item image inside info box

function HoverDetailEffect({
  itemContainerWidth,
  itemContainerHeight,
  detailData,
}: HoverDetailEffectProps) {
  if (!detailData || !detailData.items) {
    return null;
  }

  const allDecodedItems: DecodedItem[] = Object.values(detailData.items).flat().filter(Boolean) as DecodedItem[];
  if (allDecodedItems.length === 0) return null;

  const midPointX = itemContainerWidth / 2;
  const leftItems: DecodedItem[] = [];
  const rightItems: DecodedItem[] = [];

  allDecodedItems.forEach(item => {
    const itemPctLeft = typeof item.position?.left === 'string' ? parseFloat(item.position.left) : item.position?.left;
    if (itemPctLeft === undefined || isNaN(itemPctLeft)) return; // Skip if position is invalid
    
    if ((itemPctLeft / 100) * itemContainerWidth < midPointX) {
      leftItems.push(item);
    } else {
      rightItems.push(item);
    }
  });

  let accTopLeft = INFO_BOX_PADDING_Y;
  let accTopRight = INFO_BOX_PADDING_Y;

  const renderItemInfo = (decodedItem: DecodedItem, index: number, isLeftGroup: boolean) => {
    const position = decodedItem.position;
    const parsedTop = typeof position?.top === 'string' ? parseFloat(position.top) : position?.top;
    const parsedLeft = typeof position?.left === 'string' ? parseFloat(position.left) : position?.left;

    if (!position || typeof parsedTop !== 'number' || typeof parsedLeft !== 'number' || isNaN(parsedTop) || isNaN(parsedLeft)) {
      return null;
    }

    const itemPctTop = parsedTop;
    const itemPctLeft = parsedLeft;
    const lineOriginX = (itemPctLeft / 100) * itemContainerWidth;
    const lineOriginY = (itemPctTop / 100) * itemContainerHeight;
    const lineStart = { x: lineOriginX, y: lineOriginY };

    const currentInfoBoxTop = isLeftGroup ? accTopLeft : accTopRight;
    const infoBoxCalculatedLeftPx =
      isLeftGroup
        ? -INFO_BOX_WIDTH_PX - INFO_BOX_OFFSET_X_FROM_IMAGE
        : itemContainerWidth + INFO_BOX_OFFSET_X_FROM_IMAGE;

    const brandName = decodedItem?.item?.brand_name ?? "브랜드 없음";
    const brandLogoUrl = decodedItem?.item?.brand_logo_image_url;
    const itemImageUrl = decodedItem?.item?.item?.img_url;
    const itemNameFallback = decodedItem?.item?.item?.metadata?.name ?? "아이템 정보 없음";

    // Dynamically calculate info box height based on content
    let actualInfoBoxHeight = INFO_BOX_MIN_HEIGHT_PX;
    // Add more precise height calculation if needed, e.g. based on text lines or image aspect ratio
    // For now, assume ITEM_IMAGE_MAX_HEIGHT and brand name section contribute to MIN_HEIGHT

    if (isLeftGroup) {
      accTopLeft += actualInfoBoxHeight + INFO_BOX_PADDING_Y;
    } else {
      accTopRight += actualInfoBoxHeight + INFO_BOX_PADDING_Y;
    }

    const infoBoxStyle: React.CSSProperties = {
      position: 'absolute',
      top: `${currentInfoBoxTop}px`,
      left: `${infoBoxCalculatedLeftPx}px`,
      width: `${INFO_BOX_WIDTH_PX}px`,
      minHeight: `${INFO_BOX_MIN_HEIGHT_PX}px`, // Use minHeight
      padding: '10px 12px',
      backgroundColor: 'rgba(40, 40, 40, 0.95)',
      backdropFilter: 'blur(8px)',
      color: '#EAEAEA',
      borderRadius: '8px',
      zIndex: 40,
      pointerEvents: 'none',
      boxShadow: '0 6px 18px rgba(0,0,0,0.5)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
    };

    const infoBoxCenterY = currentInfoBoxTop + actualInfoBoxHeight / 2;
    const lineEnd = {
      x: isLeftGroup ? 1 : itemContainerWidth - 1, // Line ends at image edge
      y: infoBoxCenterY,
    };
    
    const key = `${detailData!.doc_id}-effect-${decodedItem?.item?.item?._id || index}-${isLeftGroup ? 'left' : 'right'}`;

    return (
      <React.Fragment key={key}>
        <div style={infoBoxStyle}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
            {brandLogoUrl && (
              <img 
                src={brandLogoUrl} 
                alt={`${brandName} 로고`} 
                style={{ 
                  maxHeight: `${BRAND_LOGO_MAX_HEIGHT}px`, 
                  maxWidth: '40px', // Limit width too
                  objectFit: 'contain',
                  marginRight: '8px',
                  borderRadius: '3px',
                }} 
              />
            )}
            <p style={{ fontWeight: '600', fontSize:'13px', color: '#E0E0E0', flexGrow: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={brandName}>
              {brandName}
            </p>
          </div>
          {itemImageUrl ? (
            <img 
              src={itemImageUrl} 
              alt={itemNameFallback} 
              style={{ 
                width: '100%', // Take full width of info box padding
                maxHeight: `${ITEM_IMAGE_MAX_HEIGHT}px`, 
                objectFit: 'cover', // or 'contain' depending on desired look
                borderRadius: '4px', 
                marginTop: 'auto', // Push to bottom if space allows
              }} 
            />
          ) : (
            <p style={{ fontSize: '11px', color: '#A0A0A0', textAlign:'center', marginTop:'auto', fontStyle:'italic' }}>{itemNameFallback} (이미지 없음)</p>
          )}
        </div>
        <svg
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: itemContainerWidth,
            height: itemContainerHeight,
            pointerEvents: 'none',
            zIndex: 39,
          }}
        >
          <line
            x1={lineStart.x} y1={lineStart.y}
            x2={lineEnd.x} y2={lineEnd.y}
            stroke="rgba(250, 204, 21, 0.75)"
            strokeWidth="1.5"
            strokeDasharray="5 2"
          />
        </svg>
      </React.Fragment>
    );
  };

  return (
    <>
      {leftItems.map((item, idx) => renderItemInfo(item, idx, true))}
      {rightItems.map((item, idx) => renderItemInfo(item, idx, false))}
    </>
  );
}

const ImageItem = React.memo(function ImageItem({
  image,
  hoveredItemId,
  hoveredImageDetailData,
  isFetchingDetail,
  detailError,
  onImageLoaded,
  onMouseEnterItem,
  onMouseLeaveItem,
}: ImageItemProps) {
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

  let itemClasses = `absolute bg-neutral-800 box-border flex justify-center items-center transition-all duration-300 ease-in-out`;
  
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
    itemClasses += " scale-105 -rotate-y-3 z-20 brightness-110";
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

  return (
    <div
      key={image.id}
      className={`${itemClasses}`}
      style={{
        width: `${ITEM_WIDTH}px`,
        height: `${ITEM_HEIGHT}px`,
        left: `${image.left}px`,
        top: `${image.top}px`,
      }}
      onMouseEnter={() => onMouseEnterItem(image.id, image.image_doc_id)}
      onMouseLeave={onMouseLeaveItem}
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
          onLoadingComplete={() => onImageLoaded(image.id)}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          quality={75}
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
                          const brandLogoUrl = decodedItem?.item?.brand_logo_image_url;
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
                                className="flex flex-row items-center bg-black/70 rounded-full py-0.5 pl-0.5 pr-1.5 shadow-lg transform -translate-x-1/2 -translate-y-1/2 cursor-default"
                                title={`${brandName} - ${itemName}`}
                                style={{ position: 'relative' }}
                              >
                                {brandLogoUrl && (
                                  <img
                                    src={brandLogoUrl}
                                    alt={`${brandName} logo`}
                                    className="h-4 w-4 rounded-full object-cover bg-white/80 mr-1"
                                  />
                                )}
                                <span className="text-[10px] font-medium text-white truncate max-w-[70px]">
                                  {brandName}
                                </span>
                              </div>
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
              <div className="px-4 pb-4 pt-12 pointer-events-none"> 
                <div className="flex justify-between items-center">
                  {primaryArtistName && (
                    <div className="border border-white/40 rounded-full px-3 py-1 bg-white/10 backdrop-blur-sm">
                      <p className="text-sm text-white font-medium truncate drop-shadow-sm max-w-[150px]">
                        {primaryArtistName}
                      </p>
                    </div>
                  )}
                  {hoveredImageDetailData &&
                    hoveredImageDetailData.doc_id === image.image_doc_id &&
                    typeof hoveredImageDetailData.like === "number" && (
                      <div className="flex items-center">
                        <svg
                          className="w-5 h-5 text-white/70 mr-1.5 drop-shadow-sm"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                            clipRule="evenodd"
                          ></path>
                        </svg>
                        <span className="text-sm text-white font-semibold drop-shadow-sm">
                          {hoveredImageDetailData.like.toLocaleString()}
                        </span>
                      </div>
                    )}
                </div>
              </div>
            )}
          </div>
        )}
        
        {isCurrentlyHovered && hoveredImageDetailData && hoveredImageDetailData.doc_id === image.image_doc_id && (
          <HoverDetailEffect
            itemContainerWidth={ITEM_WIDTH}
            itemContainerHeight={ITEM_HEIGHT}
            detailData={hoveredImageDetailData} 
          />
        )}
      </div>
    </div>
  );
});

export default ImageItem; 