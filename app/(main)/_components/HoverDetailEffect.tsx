"use client";

import React from "react";
import type { ImageDetail, DecodedItem } from "../_types/image-grid";

// Constants migrated from ImageItem.tsx
const INFO_BOX_WIDTH_PX = 170;
const INFO_BOX_MIN_HEIGHT_PX = 175;
const INFO_BOX_PADDING_Y = 8;
const INFO_BOX_OFFSET_X_FROM_IMAGE = 15;
const BRAND_LOGO_MAX_HEIGHT = 24;
const ITEM_IMAGE_MAX_HEIGHT = 120;

interface ItemInfoBoxProps {
  decodedItem: DecodedItem;
  itemContainerWidth: number;
  itemContainerHeight: number;
  isLeftGroup: boolean;
  currentInfoBoxTop: number;
  infoBoxCalculatedLeftPx: number;
  detailDocId: string;
  itemIndex: number;
}

function ItemInfoBox({
  decodedItem,
  itemContainerWidth,
  itemContainerHeight,
  isLeftGroup,
  currentInfoBoxTop,
  infoBoxCalculatedLeftPx,
  detailDocId,
  itemIndex,
}: ItemInfoBoxProps) {
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

  const brandName = decodedItem?.item?.brand_name ?? "브랜드 없음";
  const brandLogoUrl = decodedItem?.item?.brand_logo_image_url;
  const itemImageUrl = decodedItem?.item?.item?.img_url;
  const itemNameFallback = decodedItem?.item?.item?.metadata?.name ?? "아이템 정보 없음";
  
  const actualInfoBoxHeight = INFO_BOX_MIN_HEIGHT_PX;

  const infoBoxStyle: React.CSSProperties = {
    position: 'absolute',
    top: `${currentInfoBoxTop}px`,
    left: `${infoBoxCalculatedLeftPx}px`,
    width: `${INFO_BOX_WIDTH_PX}px`,
    minHeight: `${INFO_BOX_MIN_HEIGHT_PX}px`,
    padding: '10px 12px',
    backgroundColor: 'rgba(40, 40, 40, 0.95)',
    backdropFilter: 'blur(8px)',
    color: '#EAEAEA',
    borderRadius: '8px',
    zIndex: 40,
    pointerEvents: 'auto',
    boxShadow: '0 6px 18px rgba(0,0,0,0.5)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  };

  const infoBoxCenterY = currentInfoBoxTop + actualInfoBoxHeight / 2;
  const lineEnd = {
    x: isLeftGroup ? infoBoxCalculatedLeftPx + INFO_BOX_WIDTH_PX : infoBoxCalculatedLeftPx,
    y: infoBoxCenterY,
  };

  const key = `${detailDocId}-infobox-${decodedItem?.item?.item?._id || itemIndex}-${isLeftGroup ? 'left' : 'right'}`;

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
                maxWidth: '40px',
                objectFit: 'contain',
                marginRight: '8px',
                borderRadius: '3px',
                width: 'auto',
                height: 'auto',
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
              width: '100%',
              maxHeight: `${ITEM_IMAGE_MAX_HEIGHT}px`,
              objectFit: 'cover',
              borderRadius: '4px',
              marginTop: 'auto',
              height: 'auto',
            }}
          />
        ) : (
          <div
            style={{
              width: '100%',
              height: `${ITEM_IMAGE_MAX_HEIGHT}px`,
              backgroundColor: '#4A4A4A',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 'auto',
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#888888"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <circle cx="8.5" cy="8.5" r="1.5"></circle>
              <polyline points="21 15 16 10 5 21"></polyline>
            </svg>
          </div>
        )}
        {/* <div style={{ marginTop: 'auto', paddingTop: '8px', borderTop: '1px solid #555' }}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              console.log("Item info button clicked:", decodedItem?.item?.item?.metadata?.name);
            }}
            style={{
              backgroundColor: '#FACC15',
              color: '#1F2937',
              padding: '4px 8px',
              borderRadius: '4px',
              fontSize: '12px',
              border: 'none',
              cursor: 'pointer',
              width: '100%',
              textAlign: 'center',
              fontWeight: '500',
            }}
          >
            아이템 추가하기
          </button>
        </div> */}
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
}


export interface HoverDetailEffectProps {
  itemContainerWidth: number;
  itemContainerHeight: number;
  detailData: ImageDetail | null;
}

export function HoverDetailEffect({
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
    if (itemPctLeft === undefined || isNaN(itemPctLeft)) return;
    
    if ((itemPctLeft / 100) * itemContainerWidth < midPointX) {
      leftItems.push(item);
    } else {
      rightItems.push(item);
    }
  });

  let accTopLeft = INFO_BOX_PADDING_Y;
  let accTopRight = INFO_BOX_PADDING_Y;

  return (
    <>
      {leftItems.map((item, idx) => {
        const currentInfoBoxTop = accTopLeft;
        const infoBoxCalculatedLeftPx = -INFO_BOX_WIDTH_PX - INFO_BOX_OFFSET_X_FROM_IMAGE;
        accTopLeft += INFO_BOX_MIN_HEIGHT_PX + INFO_BOX_PADDING_Y;
        
        return (
          <ItemInfoBox
            key={`left-${item?.item?.item?._id || idx}`}
            decodedItem={item}
            itemContainerWidth={itemContainerWidth}
            itemContainerHeight={itemContainerHeight}
            isLeftGroup={true}
            currentInfoBoxTop={currentInfoBoxTop}
            infoBoxCalculatedLeftPx={infoBoxCalculatedLeftPx}
            detailDocId={detailData.doc_id}
            itemIndex={idx}
          />
        );
      })}
      {rightItems.map((item, idx) => {
        const currentInfoBoxTop = accTopRight;
        const infoBoxCalculatedLeftPx = itemContainerWidth + INFO_BOX_OFFSET_X_FROM_IMAGE;
        accTopRight += INFO_BOX_MIN_HEIGHT_PX + INFO_BOX_PADDING_Y;

        return (
          <ItemInfoBox
            key={`right-${item?.item?.item?._id || idx}`}
            decodedItem={item}
            itemContainerWidth={itemContainerWidth}
            itemContainerHeight={itemContainerHeight}
            isLeftGroup={false}
            currentInfoBoxTop={currentInfoBoxTop}
            infoBoxCalculatedLeftPx={infoBoxCalculatedLeftPx}
            detailDocId={detailData.doc_id}
            itemIndex={idx}
          />
        );
      })}
    </>
  );
} 