"use client";

import React, { useState, useEffect } from "react";
import type { DecodedItem } from "../../_types/image-grid";
import { ItemDetailCard } from "./ItemDetailCard";

// 마커 관련 상수
const MARKER_SIZE = 24;
const MARKER_BORDER_WIDTH = 2;
const MARKER_ANIMATION_DURATION = 0.3;
const MAIN_COLOR = '#EAFD66';
const MAIN_COLOR_RGB = '234, 253, 102';
const DETAIL_CARD_WIDTH = 180;
const DETAIL_CARD_HEIGHT = 56;

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
  const [isExpanded, setIsExpanded] = useState(false);
  
  // ESC 키로 닫기
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isExpanded) {
        setIsExpanded(false);
      }
    };

    if (isExpanded) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isExpanded]);

  // 배경 클릭으로 닫기
  useEffect(() => {
    const handleBackgroundClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (isExpanded && !target.closest('[data-detail-card]') && !target.closest('[data-marker]')) {
        setIsExpanded(false);
      }
    };

    if (isExpanded) {
      document.addEventListener('click', handleBackgroundClick);
      return () => document.removeEventListener('click', handleBackgroundClick);
    }
  }, [isExpanded]);

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
    transition: `all ${MARKER_ANIMATION_DURATION}s cubic-bezier(0.4, 0, 0.2, 1)`,
    animation: isExpanded ? 'none' : 'markerPulse 2s infinite',
    transform: isExpanded ? 'scale(0)' : 'scale(1)',
    opacity: isExpanded ? 0 : 1,
  };

  // 카드 위치 계산 (컨테이너 밖으로 벗어나지 않게 clamp)
  const cardLeftRaw = markerX - DETAIL_CARD_WIDTH / 2;
  const cardTopRaw = markerY - DETAIL_CARD_HEIGHT / 2;
  const cardLeft = Math.max(0, Math.min(cardLeftRaw, itemContainerWidth - DETAIL_CARD_WIDTH));
  const cardTop = Math.max(0, Math.min(cardTopRaw, itemContainerHeight - DETAIL_CARD_HEIGHT));

  const detailCardStyle: React.CSSProperties = {
    position: 'absolute',
    left: `${cardLeft}px`,
    top: `${cardTop}px`,
    zIndex: 100, // 더 높은 z-index로 설정
    transform: isExpanded ? 'scale(1)' : 'scale(0)',
    opacity: isExpanded ? 1 : 0,
    transition: `all ${MARKER_ANIMATION_DURATION}s cubic-bezier(0.4, 0, 0.2, 1)`,
    transformOrigin: `${markerX - cardLeft}px ${markerY - cardTop}px`, // 마커 위치 기준
  };

  const key = `${detailDocId}-marker-${decodedItem?.item?.item?._id || itemIndex}`;

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isExpanded) return;
    e.stopPropagation();
    e.currentTarget.style.transform = 'scale(1.2)';
    e.currentTarget.style.backgroundColor = 'rgba(17, 24, 39, 1)';
    e.currentTarget.style.borderColor = MAIN_COLOR;
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isExpanded) return;
    e.stopPropagation();
    e.currentTarget.style.transform = 'scale(1)';
    e.currentTarget.style.backgroundColor = 'rgba(17, 24, 39, 0.8)';
    e.currentTarget.style.borderColor = `rgba(${MAIN_COLOR_RGB}, 0.9)`;
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isExpanded) {
      setIsExpanded(true);
      onExpand?.();
    } else {
      setIsExpanded(false);
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  const handleDetailCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  const handleDetailCardMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  const handleDetailCardMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  return (
    <>
      <div
        key={key}
        data-marker="true"
        style={markerStyle}
        title={`${brandName} - ${itemName}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      >
        <span style={{ color: 'white', fontWeight: 'bold', fontSize: '14px' }}>
          ?
        </span>
      </div>
      
      {isExpanded && (
        <div
          style={detailCardStyle}
          onClick={handleDetailCardClick}
          onMouseDown={handleDetailCardMouseDown}
          onMouseUp={handleDetailCardMouseUp}
        >
          <ItemDetailCard decodedItem={decodedItem} />
        </div>
      )}
    </>
  );
} 