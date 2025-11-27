"use client";

import { useRef, useLayoutEffect } from "react";
import type { ScanItem, ScanData } from "./types";

interface DetailPanelProps {
  data: ScanData;
  onCardRefsChange?: (map: Partial<Record<string, HTMLDivElement>>) => void;
}

function getBackgroundPositionFromBox(box: { top: number; left: number; width: number; height: number }): string {
  const centerX = box.left + box.width / 2;
  const centerY = box.top + box.height / 2;
  return `${centerX}% ${centerY}%`;
}

export default function DetailPanel({
  data,
  onCardRefsChange,
}: DetailPanelProps) {
  const cardRefs = useRef<Partial<Record<string, HTMLDivElement>>>({});

  // 카드 ref를 부모로 올려주기
  useLayoutEffect(() => {
    if (!onCardRefsChange) return;
    onCardRefsChange(cardRefs.current);
  }, [onCardRefsChange, data.items]);

  return (
    <div className="flex flex-col gap-4 w-full">
      {data.items.map((item) => (
        <div
          key={item.id}
          ref={(el) => {
            if (el) {
              cardRefs.current[item.id] = el;
            } else {
              delete cardRefs.current[item.id];
            }
            // ref 변경 시 부모에 알림
            if (onCardRefsChange) {
              onCardRefsChange(cardRefs.current);
            }
          }}
          className="bg-zinc-900/90 backdrop-blur-sm border border-lime-400/30 rounded-lg p-4 hover:border-lime-400/60 hover:bg-zinc-900 transition-all duration-200"
        >
          <div className="flex items-start gap-4">
            {/* 줌 썸네일 */}
            <div
              className="w-20 h-20 rounded-md bg-zinc-800 border border-lime-400/20 flex-shrink-0 overflow-hidden"
              style={{
                backgroundImage: `url(${data.photoUrl})`,
                backgroundSize: "300%",
                backgroundPosition: getBackgroundPositionFromBox(item.box),
                backgroundRepeat: "no-repeat",
              }}
              aria-hidden="true"
            />
            
            {/* 텍스트 정보 */}
            <div className="flex-1 min-w-0">
              <h3 className="text-lime-400 font-mono text-sm font-semibold mb-1 uppercase tracking-wide">
                {item.name}
              </h3>
              <p className="text-zinc-400 text-xs font-mono">
                Confidence: <span className="text-lime-400/80">{item.confidence}%</span>
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

