"use client";

import { useState, useRef, useLayoutEffect, useEffect, useCallback } from "react";
import type { ScanData, ConnectorAnchor } from "./types";
import ImageLayer from "./ImageLayer";
import DetailPanel from "./DetailPanel";
import ConnectorLayer from "./ConnectorLayer";

interface FashionScanSceneProps {
  data: ScanData;
}

export default function FashionScanScene({ data }: FashionScanSceneProps) {
  const [anchors, setAnchors] = useState<ConnectorAnchor[]>([]);
  const boxRefs = useRef<Partial<Record<string, HTMLDivElement>>>({});
  const cardRefs = useRef<Partial<Record<string, HTMLDivElement>>>({});

  const calculateAnchors = useCallback(() => {
    if (typeof window === "undefined") return;

    const newAnchors: ConnectorAnchor[] = [];

    data.items.forEach((item) => {
      const boxEl = boxRefs.current[item.id];
      const cardEl = cardRefs.current[item.id];

      if (!boxEl || !cardEl) {
        return;
      }

      const boxRect = boxEl.getBoundingClientRect();
      const cardRect = cardEl.getBoundingClientRect();

      // 박스 우측 중앙점
      const boxAnchor = {
        x: boxRect.right,
        y: boxRect.top + boxRect.height / 2,
      };

      // 카드 좌측 중앙점
      const cardAnchor = {
        x: cardRect.left,
        y: cardRect.top + cardRect.height / 2,
      };

      newAnchors.push({
        itemId: item.id,
        boxAnchor,
        cardAnchor,
      });
    });

    // 개발 단계에서 디버깅용 로그
    if (process.env.NODE_ENV === "development") {
      console.log("Anchors calculated:", newAnchors);
    }

    setAnchors(newAnchors);
  }, [data.items]);

  // 앵커 계산 (useLayoutEffect로 깜빡임 방지)
  useLayoutEffect(() => {
    calculateAnchors();
  }, [calculateAnchors]);

  // 리사이즈 및 스크롤 이벤트 처리
  useEffect(() => {
    const handleResize = () => {
      calculateAnchors();
    };

    const handleScroll = () => {
      calculateAnchors();
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll, true); // capture phase로 모든 스크롤 감지

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, [calculateAnchors]);

  const handleBoxRefsChange = (map: Partial<Record<string, HTMLDivElement>>) => {
    boxRefs.current = map;
    // ref 변경 시 즉시 재계산
    if (typeof window !== "undefined") {
      requestAnimationFrame(() => {
        calculateAnchors();
      });
    }
  };

  const handleCardRefsChange = (map: Partial<Record<string, HTMLDivElement>>) => {
    cardRefs.current = map;
    // ref 변경 시 즉시 재계산
    if (typeof window !== "undefined") {
      requestAnimationFrame(() => {
        calculateAnchors();
      });
    }
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start lg:items-start">
          {/* 좌측: 이미지 레이어 */}
          <div className="flex-shrink-0 w-full lg:w-auto">
            <ImageLayer
              photoUrl={data.photoUrl}
              items={data.items}
              onBoxRefsChange={handleBoxRefsChange}
            />
          </div>

          {/* 우측: 카드 패널 */}
          <div className="flex-1 w-full lg:w-auto lg:max-w-md">
            <DetailPanel
              data={data}
              onCardRefsChange={handleCardRefsChange}
            />
          </div>
        </div>
      </div>

      {/* SVG 연결선 레이어 */}
      <ConnectorLayer anchors={anchors} />
    </div>
  );
}

