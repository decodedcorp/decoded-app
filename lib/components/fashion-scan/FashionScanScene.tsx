"use client";

import { useState, useRef, useLayoutEffect, useEffect, useCallback } from "react";
import type { ScanData, ConnectorAnchor } from "./types";
import ImageLayer from "./ImageLayer";
import CalloutLayer from "./CalloutLayer";
import ConnectorLayer from "./ConnectorLayer";
import { getBoxAnchor, getCardAnchor, inferCallout } from "./callout-utils";

interface FashionScanSceneProps {
  data: ScanData;
}

export default function FashionScanScene({ data }: FashionScanSceneProps) {
  const [anchors, setAnchors] = useState<ConnectorAnchor[]>([]);
  const [sceneRect, setSceneRect] = useState<DOMRect | null>(null);
  const sceneRef = useRef<HTMLDivElement | null>(null);
  const boxRefs = useRef<Partial<Record<string, HTMLDivElement>>>({});
  const cardRefs = useRef<Partial<Record<string, HTMLDivElement>>>({});

  // Scene rect 계산 함수 (순환 참조 방지를 위해 useCallback 제거)
  const recalcSceneRect = () => {
    if (!sceneRef.current) return null;
    const rect = sceneRef.current.getBoundingClientRect();
    setSceneRect(rect);
    return rect;
  };

  // 앵커 계산 함수 (sceneRect를 파라미터로 받아서 dependency 순환 방지)
  const calculateAnchors = useCallback(
    (currentSceneRect: DOMRect) => {
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
        const layout = item.callout ?? inferCallout(item.box);

        // Scene-relative coordinates with side-aware anchors
        const boxAnchor = getBoxAnchor(boxRect, currentSceneRect, layout.side);
        const cardAnchor = getCardAnchor(cardRect, currentSceneRect, layout.side);

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
    },
    [data.items]
  );

  // Scene rect 계산 (useLayoutEffect로 깜빡임 방지)
  useLayoutEffect(() => {
    const rect = recalcSceneRect();
    if (rect) {
      calculateAnchors(rect);
    }
  }, [calculateAnchors]);

  // sceneRect가 변경될 때 앵커 재계산
  useEffect(() => {
    if (sceneRect) {
      calculateAnchors(sceneRect);
    }
  }, [sceneRect, calculateAnchors]);

  // 리사이즈 및 스크롤 이벤트 처리
  useEffect(() => {
    const handleResize = () => {
      const rect = recalcSceneRect();
      if (rect) {
        calculateAnchors(rect);
      }
    };

    const handleScroll = () => {
      const rect = recalcSceneRect();
      if (rect) {
        calculateAnchors(rect);
      }
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [calculateAnchors]);

  const handleBoxRefsChange = (map: Partial<Record<string, HTMLDivElement>>) => {
    boxRefs.current = map;
    // ref 변경 시 즉시 재계산
    if (typeof window !== "undefined" && sceneRect) {
      requestAnimationFrame(() => {
        calculateAnchors(sceneRect);
      });
    }
  };

  const handleCardRefsChange = (map: Partial<Record<string, HTMLDivElement>>) => {
    cardRefs.current = map;
    // ref 변경 시 즉시 재계산
    if (typeof window !== "undefined" && sceneRect) {
      requestAnimationFrame(() => {
        calculateAnchors(sceneRect);
      });
    }
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Scene container */}
        <div
          ref={sceneRef}
          className="relative aspect-[3/4] max-w-2xl mx-auto"
        >
          {/* 이미지 레이어 */}
          <ImageLayer
            photoUrl={data.photoUrl}
            items={data.items}
            onBoxRefsChange={handleBoxRefsChange}
          />

          {/* Callout 레이어 (카드들) */}
          <CalloutLayer
            items={data.items}
            data={data}
            onCardRefsChange={handleCardRefsChange}
          />

          {/* SVG 연결선 레이어 */}
          <ConnectorLayer anchors={anchors} />
        </div>
      </div>
    </div>
  );
}

