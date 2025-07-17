"use client";

import { useCallback, useEffect, useState, useRef } from "react";
import { FloatingBox } from "./floating-box";
import type { HeroImageDoc, ItemDoc } from "@/lib/api/types";
import type { BoxSizeMode } from "../../utils/types";
import gsap from "gsap";

interface BoxContainerProps {
  sizeMode: BoxSizeMode;
  onBoxHover?: () => void;
  resources: Array<HeroImageDoc>;
}

interface BoxData {
  resource: HeroImageDoc;
  position: { x: number; y: number };
}

const generatePositions = (count: number) => {
  if (typeof window === "undefined") return null;

  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  // 화면을 넓은 영역으로 분할
  const areas = [
    { y: [-10, 20], x: [-30, 30] }, // 왼쪽 최상단
    { y: [-10, 25], x: [40, 80] }, // 오른쪽 최상단
    { y: [15, 45], x: [-40, 20] }, // 왼쪽 상단
    { y: [20, 50], x: [30, 90] }, // 오른쪽 상단
    { y: [40, 65], x: [-20, 70] }, // 중앙
    { y: [60, 85], x: [-35, 25] }, // 왼쪽 하단
    { y: [55, 80], x: [25, 85] }, // 오른쪽 하단
    { y: [80, 110], x: [-25, 45] }, // 왼쪽 최하단
    { y: [75, 105], x: [15, 75] }, // 오른쪽 최하단
    { y: [35, 70], x: [-45, 95] }, // 전체 영역
  ];

  const usedAreas = new Set<number>();

  return (resource: HeroImageDoc, index: number) => {
    const availableAreas = areas
      .map((_, areaIndex) => areaIndex)
      .filter(
        (areaIndex) =>
          !usedAreas.has(areaIndex) || areaIndex === areas.length - 1
      );

    if (availableAreas.length === 0) {
      // Fallback to center if no areas available
      return {
        resource,
        position: {
          x: viewportWidth / 2,
          y: viewportHeight / 2,
        },
      };
    }

    const areaIndex =
      availableAreas[Math.floor(Math.random() * availableAreas.length)];
    const area = areas[areaIndex];

    if (areaIndex !== areas.length - 1) {
      usedAreas.add(areaIndex);
    }

    // Convert percentage to actual pixels
    const x = viewportWidth * (gsap.utils.random(area.x[0], area.x[1]) / 100);
    const y = viewportHeight * (gsap.utils.random(area.y[0], area.y[1]) / 100);

    return {
      resource,
      position: { x, y },
    };
  };
};

export function BoxContainer({
  sizeMode,
  onBoxHover,
  resources,
}: BoxContainerProps) {
  const [boxData, setBoxData] = useState<BoxData[]>([]);
  const initialized = useRef(false);
  const resizeTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  // 초기 위치 계산 및 설정
  useEffect(() => {
    if (!initialized.current && resources.length > 0) {
      const positionGenerator = generatePositions(resources.length);
      if (positionGenerator) {
        const initialBoxData = resources.map((resource, index) =>
          positionGenerator(resource, index)
        );
        setBoxData(initialBoxData);
        initialized.current = true;
      }
    }
  }, [resources]);

  // 리사이즈 핸들러
  const handleResize = useCallback(() => {
    if (resizeTimeoutRef.current) {
      clearTimeout(resizeTimeoutRef.current);
    }

    resizeTimeoutRef.current = setTimeout(() => {
      if (resources.length > 0) {
        const positionGenerator = generatePositions(resources.length);
        if (positionGenerator) {
          setBoxData((prevData) =>
            prevData.map((data, index) =>
              positionGenerator(data.resource, index)
            )
          );
        }
      }
    }, 200);
  }, [resources]);

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
    };
  }, [handleResize]);

  if (boxData.length === 0) return null;

  return (
    <div className="relative w-full h-full">
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-black/20 to-black/40 pointer-events-none" />

      <div className="relative w-full h-full">
        {boxData.map((data, index) => {
          const depthLevel = Math.floor((index / boxData.length) * 5) + 1;

          return (
            <FloatingBox
              key={index}
              resource={data.resource}
              initialDelay={index * 100}
              depthLevel={depthLevel}
              position={data.position}
              onHover={onBoxHover}
            />
          );
        })}
      </div>
    </div>
  );
}
