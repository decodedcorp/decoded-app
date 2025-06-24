"use client";

import React from "react";
import type { ImageDetail, DecodedItem } from "../../_types/image-grid";
import { ItemMarker } from "./ItemMarker";

// 마커 관련 상수
const MARKER_SIZE = 24;
const MARKER_BORDER_WIDTH = 2;
const MARKER_ANIMATION_DURATION = 0.3;

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

  return (
    <>
      <style jsx>{`
        @keyframes markerPulse {
          0% {
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
          }
          50% {
            box-shadow: 0 2px 12px rgba(250, 204, 21, 0.4);
          }
          100% {
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
          }
        }
      `}</style>
      {allDecodedItems.map((item, idx) => (
        <ItemMarker
          key={`marker-${item?.item?.item?._id || idx}`}
          decodedItem={item}
          itemContainerWidth={itemContainerWidth}
          itemContainerHeight={itemContainerHeight}
          detailDocId={detailData.doc_id}
          itemIndex={idx}
        />
      ))}
    </>
  );
} 