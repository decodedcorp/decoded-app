import React from "react";
import Image from "next/image";
import type { ImageItemData, ImageDetail, DecodedItem } from "../_types/image-grid"; // DecodedItem 추가
import { ITEM_WIDTH, ITEM_HEIGHT } from "../_constants/image-grid";

interface ImageItemProps {
  image: ImageItemData;
  hoveredItemId: string | null;
  hoveredImageDetailData: ImageDetail | null;
  isFetchingDetail: boolean;
  detailError: string | null;
  onImageLoaded: (id: string) => void;
  onMouseEnterItem: (itemId: string, imageDocId: string) => void; // 타입 변경
  onMouseLeaveItem: () => void;
}

// React.memo로 컴포넌트를 감싸서 불필요한 리렌더링 방지
const ImageItem = React.memo(function ImageItem({
  image,
  hoveredItemId,
  hoveredImageDetailData,
  isFetchingDetail,
  detailError,
  onImageLoaded,
  onMouseEnterItem, // 안정적인 콜백을 받음
  onMouseLeaveItem,
}: ImageItemProps) {
  const isCurrentlyHovered = hoveredItemId === image.id;
  const isAnotherImageHovered =
    hoveredItemId !== null && !isCurrentlyHovered;

  // next/image에 전달될 width와 height를 안전하게 처리
  // image 객체에 width/height가 없거나 유효하지 않은 경우, ITEM_WIDTH/ITEM_HEIGHT를 사용
  const displayWidth =
    typeof image.width === "number" && image.width > 0
      ? image.width
      : ITEM_WIDTH;
  const displayHeight =
    typeof image.height === "number" && image.height > 0
      ? image.height
      : ITEM_HEIGHT;

  let itemClasses = `absolute bg-neutral-800 box-border flex justify-center items-center transition-all duration-300 ease-in-out overflow-hidden`;

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
          !key.startsWith("http") && // 간단한 URL 패턴 방지
          value.length > 0 && value.length < 30 // 이름 길이에 대한 휴리스틱
      );
      if (personEntry) {
        primaryArtistName = personEntry[1] as string;
      }
    }
  }

  return (
    <div
      key={image.id}
      className={itemClasses}
      style={{
        width: `${ITEM_WIDTH}px`,
        height: `${ITEM_HEIGHT}px`,
        left: `${image.left}px`,
        top: `${image.top}px`,
      }}
      onMouseEnter={() => onMouseEnterItem(image.id, image.image_doc_id)} // 내부에서 인자 전달
      onMouseLeave={onMouseLeaveItem}
    >
      <div className="relative w-full h-full">
        <Image
          src={image.src}
          alt={image.alt || `Image ${image.id}`}
          width={displayWidth} // 수정된 width 사용
          height={displayHeight} // 수정된 height 사용
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
            <div className="p-3">
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
                      (itemArray: DecodedItem[] | undefined, arrayIndex: number) => { // undefined 가능성 추가
                        if (!itemArray || itemArray.length === 0) { // itemArray가 비었거나 없는 경우 처리
                          return [];
                        }
                        return itemArray.map((decodedItem, itemIndex) => {
                          // decodedItem 및 내부 속성 접근 시 옵셔널 체이닝 강화
                          const itemName = decodedItem?.item?.item?.metadata?.name ?? "Unknown Item";
                          const brandName = decodedItem?.item?.brand_name ?? "?";
                          const brandLogoUrl = decodedItem?.item?.brand_logo_image_url;
                          const itemId = decodedItem?.item?.item?._id ?? `fallback-id-${arrayIndex}-${itemIndex}`;

                          const decodedItemKey = `${image.id}-item-${arrayIndex}-${itemIndex}-${itemId}`;
                          const tagHalfHeight = 10;
                          const gapBetweenTagAndDot = 2;
                          const dotTopPosition = tagHalfHeight + gapBetweenTagAndDot;

                          // decodedItem.position이 없을 경우를 대비한 기본값 설정
                          const positionTop = decodedItem?.position?.top ?? 50;
                          const positionLeft = decodedItem?.position?.left ?? 50;

                          return (
                            <div
                              key={decodedItemKey}
                              className="absolute pointer-events-auto"
                              style={{
                                top: `${positionTop}%`,
                                left: `${positionLeft}%`,
                              }}
                            >
                              <div
                                className="flex flex-row items-center bg-black/70 rounded-full py-0.5 pl-0.5 pr-1.5 shadow-lg transform -translate-x-1/2 -translate-y-1/2 cursor-default"
                                title={`${brandName} - ${itemName}`}
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
                                className="absolute left-1/2 transform -translate-x-1/2 w-2 h-2 bg-yellow-400 rounded-full border border-white/70 shadow-md hover:scale-125 transition-transform duration-150 animate-pulse hover:animate-none cursor-pointer"
                                style={{ top: `${dotTopPosition}px` }}
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
      </div>
    </div>
  );
}); // React.memo HOC 사용

export default ImageItem; 