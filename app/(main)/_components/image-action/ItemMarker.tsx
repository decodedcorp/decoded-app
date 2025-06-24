"use client";

import React from "react";
import type { DecodedItem } from "../../_types/image-grid";

// 마커 관련 상수
const MARKER_SIZE = 24;
const MARKER_BORDER_WIDTH = 2;
const MARKER_ANIMATION_DURATION = 0.3;
const MAIN_COLOR = '#EAFD66';
const MAIN_COLOR_RGB = '234, 253, 102';

interface ItemMarkerProps {
  decodedItem: DecodedItem;
  itemContainerWidth: number;
  itemContainerHeight: number;
  detailDocId: string;
  itemIndex: number;
}

export function ItemMarker({
  decodedItem,
  itemContainerWidth,
  itemContainerHeight,
  detailDocId,
  itemIndex,
  onExpand,
}: ItemMarkerProps & { onExpand?: () => void }) {
  const position = decodedItem.position;
  const parsedTop = typeof position?.top === 'string' ? parseFloat(position.top) : position?.top;
  const parsedLeft = typeof position?.left === 'string' ? parseFloat(position.left) : position?.left;

  if (!position || typeof parsedTop !== 'number' || typeof parsedLeft !== 'number' || isNaN(parsedTop) || isNaN(parsedLeft)) {
    return null;
  }

  const itemPctTop = parsedTop;
  const itemPctLeft = parsedLeft;
  const markerX = (itemPctLeft / 100) * itemContainerWidth;
  const markerY = (itemPctTop / 100) * itemContainerHeight;

  const brandName = decodedItem?.item?.brand_name ?? "브랜드 없음";
  const itemName = decodedItem?.item?.item?.metadata?.name ?? "아이템 정보 없음";

  const markerStyle: React.CSSProperties = {
    position: 'absolute',
    left: `${markerX - MARKER_SIZE / 2}px`,
    top: `${markerY - MARKER_SIZE / 2}px`,
    width: `${MARKER_SIZE}px`,
    height: `${MARKER_SIZE}px`,
    backgroundColor: 'rgba(17, 24, 39, 0.8)',
    border: `${MARKER_BORDER_WIDTH}px solid rgba(${MAIN_COLOR_RGB}, 0.9)`,
    borderRadius: '50%',
    zIndex: 40,
    pointerEvents: 'auto',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
    transition: `all ${MARKER_ANIMATION_DURATION}s ease-in-out`,
    animation: 'markerPulse 2s infinite',
  };

  const key = `${detailDocId}-marker-${decodedItem?.item?.item?._id || itemIndex}`;

  return (
    <div
      key={key}
      style={markerStyle}
      title={`${brandName} - ${itemName}`}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.2)';
        e.currentTarget.style.backgroundColor = 'rgba(17, 24, 39, 1)';
        e.currentTarget.style.borderColor = MAIN_COLOR;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.backgroundColor = 'rgba(17, 24, 39, 0.8)';
        e.currentTarget.style.borderColor = `rgba(${MAIN_COLOR_RGB}, 0.9)`;
      }}
      onClick={(e) => {
        e.stopPropagation();
        onExpand?.();
      }}
    >
      <span style={{ color: 'white', fontWeight: 'bold', fontSize: '14px' }}>
        ?
      </span>
    </div>
  );
} 