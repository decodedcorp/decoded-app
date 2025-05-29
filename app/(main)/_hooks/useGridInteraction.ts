import { useRef, useCallback, useEffect, useState } from "react";
import type { ImageDetail } from "../_types/image-grid";

interface UseGridInteractionProps {
  scrollContainerRef: React.RefObject<HTMLDivElement>;
  contentOffset: { x: number; y: number };
  setContentOffset: React.Dispatch<React.SetStateAction<{ x: number; y: number }>>;
  fetchImageDetail: (imageDocId: string) => void;
}

export function useGridInteraction({
  scrollContainerRef,
  contentOffset,
  setContentOffset,
  fetchImageDetail,
}: UseGridInteractionProps) {
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const initialContentOffsetRef = useRef({ x: 0, y: 0 });
  const [hoveredItemId, setHoveredItemId] = useState<string | null>(null);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!scrollContainerRef.current) return;
      isDraggingRef.current = true;
      scrollContainerRef.current.style.cursor = "grabbing";
      dragStartRef.current = { x: e.pageX, y: e.pageY };
      initialContentOffsetRef.current = contentOffset;
      e.preventDefault();
    },
    [contentOffset, scrollContainerRef]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDraggingRef.current) return;
      const dx = e.pageX - dragStartRef.current.x;
      const dy = e.pageY - dragStartRef.current.y;
      setContentOffset({
        x: initialContentOffsetRef.current.x + dx,
        y: initialContentOffsetRef.current.y + dy,
      });
    },
    [setContentOffset]
  );

  const handleMouseUpOrLeave = useCallback(() => {
    if (isDraggingRef.current) {
      isDraggingRef.current = false;
      if (scrollContainerRef.current) {
        scrollContainerRef.current.style.cursor = "grab";
      }
    }
  }, [scrollContainerRef]);

  const handleWheel = useCallback(
    (e: WheelEvent) => {
      if (
        scrollContainerRef.current &&
        scrollContainerRef.current.contains(e.target as Node)
      ) {
        e.preventDefault();
        setContentOffset((prev) => ({
          x: prev.x - e.deltaX,
          y: prev.y - e.deltaY,
        }));
      }
    },
    [scrollContainerRef, setContentOffset]
  );

  const handleMouseEnterItem = (itemId: string, imageDocId: string) => {
    setHoveredItemId(itemId);
    fetchImageDetail(imageDocId);
  };

  const handleMouseLeaveItem = () => {
    setHoveredItemId(null);
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUpOrLeave);
    if (container) {
      container.addEventListener("wheel", handleWheel, { passive: false });
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUpOrLeave);
      if (container) {
        container.removeEventListener("wheel", handleWheel);
      }
    };
  }, [handleMouseMove, handleMouseUpOrLeave, handleWheel, scrollContainerRef]);

  // 이 훅은 주로 이벤트 리스너를 설정하므로, 반환값으로 handleMouseDown을 전달하여
  // MainPage의 JSX에서 사용할 수 있도록 합니다.
  return {
    isDragging: isDraggingRef.current,
    handleMouseDown,
    hoveredItemId,
    handleMouseEnterItem,
    handleMouseLeaveItem,
  };
} 