"use client";

import { useRef, useLayoutEffect } from "react";
import type { ScanItem } from "./types";

interface ImageLayerProps {
  photoUrl: string;
  items: ScanItem[];
  onBoxRefsChange?: (map: Partial<Record<string, HTMLDivElement>>) => void;
}

export default function ImageLayer({
  photoUrl,
  items,
  onBoxRefsChange,
}: ImageLayerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const boxRefs = useRef<Partial<Record<string, HTMLDivElement>>>({});

  // 박스 ref를 부모로 올려주기
  useLayoutEffect(() => {
    if (!onBoxRefsChange) return;
    onBoxRefsChange(boxRefs.current);
  }, [onBoxRefsChange, items]);

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-[540px] bg-zinc-900"
    >
      <img
        src={photoUrl}
        alt="scan target"
        className="w-full h-auto opacity-80"
      />

      {items.map((item) => (
        <div
          key={item.id}
          ref={(el) => {
            if (el) {
              boxRefs.current[item.id] = el;
            } else {
              delete boxRefs.current[item.id];
            }
            // ref 변경 시 부모에 알림
            if (onBoxRefsChange) {
              onBoxRefsChange(boxRefs.current);
            }
          }}
          className="absolute border-2 border-lime-400/80 rounded-sm pointer-events-none"
          style={{
            top: `${item.box.top}%`,
            left: `${item.box.left}%`,
            width: `${item.box.width}%`,
            height: `${item.box.height}%`,
          }}
          aria-hidden="true"
          role="presentation"
        />
      ))}
    </div>
  );
}

