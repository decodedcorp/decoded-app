import { useState, useCallback } from "react";

export interface Point {
  x: number;
  y: number;
  context?: string;
  brandName?: string;
  price?: string;
}

interface UseImageMarkerProps {
  initialPoints?: Point[];
  onChange?: (points: Point[]) => void;
}

export function useImageMarker({
  initialPoints = [],
  onChange,
}: UseImageMarkerProps = {}) {
  const [points, setPoints] = useState<Point[]>(initialPoints);

  const addPoint = useCallback(
    (x: number, y: number) => {
      const newPoints = [...points, { x, y }];
      setPoints(newPoints);
      onChange?.(newPoints);
    },
    [points, onChange]
  );

  const removePoint = useCallback(
    (index: number) => {
      const newPoints = points.filter((_, i) => i !== index);
      setPoints(newPoints);
      onChange?.(newPoints);
    },
    [points, onChange]
  );

  const updatePointContext = useCallback(
    (index: number, context: string) => {
      const newPoints = points.map((point, i) =>
        i === index ? { ...point, context } : point
      );
      setPoints(newPoints);
      onChange?.(newPoints);
    },
    [points, onChange]
  );

  const calculatePointPosition = useCallback(
    (element: HTMLElement, clientX: number, clientY: number) => {
      const rect = element.getBoundingClientRect();
      const x = ((clientX - rect.left) / rect.width) * 100;
      const y = ((clientY - rect.top) / rect.height) * 100;
      return { x, y };
    },
    []
  );

  return {
    points,
    setPoints: useCallback(
      (newPoints: Point[]) => {
        setPoints(newPoints);
        onChange?.(newPoints);
      },
      [onChange]
    ),
    addPoint,
    removePoint,
    updatePointContext,
    calculatePointPosition,
  };
}
