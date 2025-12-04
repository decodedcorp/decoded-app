import type { Json } from '@/lib/supabase/types';
import type { ItemRow } from '@/lib/supabase/queries/items';
import type { CSSProperties } from 'react';

/**
 * Normalized coordinate (0.0 ~ 1.0)
 * All coordinates should be normalized to this range for viewport-independent positioning
 */
export type NormalizedCoord = {
  x: number; // 0.0 (left) ~ 1.0 (right)
  y: number; // 0.0 (top) ~ 1.0 (bottom)
};

/**
 * Bounding box in normalized coordinates (0.0 ~ 1.0)
 */
export type BoundingBox = {
  top: number; // 0.0 ~ 1.0
  left: number; // 0.0 ~ 1.0
  width: number; // 0.0 ~ 1.0
  height: number; // 0.0 ~ 1.0
};

/**
 * Extended item type with normalized coordinates
 */
export type NormalizedItem = ItemRow & {
  normalizedBox: BoundingBox | null;
  normalizedCenter: NormalizedCoord | null;
};

/**
 * Helper: Convert pixel value to relative position (0.0 ~ 1.0)
 */
export function getRelativePos(val: number, max: number): number {
  if (max === 0) return 0;
  return Math.max(0, Math.min(1, val / max));
}

/**
 * Normalize coordinates from various formats to BoundingBox (0.0 ~ 1.0)
 *
 * Supports multiple input formats:
 * - { x: 0.5, y: 0.3 } - Already normalized center point
 * - { top: 22, left: 33.5, width: 21, height: 13 } - Percentage values (0-100)
 * - { x: 500, y: 300, width: 200, height: 150 } - Pixel values (requires imageSize)
 */
export function normalizeCoordinates(
  center: Json | null,
  imageSize?: { width: number; height: number }
): BoundingBox | null {
  if (!center || typeof center !== 'object') {
    return null;
  }

  const obj = center as Record<string, unknown>;

  // Case 1: Already normalized center point { x: 0.5, y: 0.3 }
  if (typeof obj.x === 'number' && typeof obj.y === 'number') {
    const x = Math.max(0, Math.min(1, obj.x));
    const y = Math.max(0, Math.min(1, obj.y));
    
    // If width/height are provided, use them; otherwise create a small box around center
    const width = typeof obj.width === 'number' 
      ? Math.max(0, Math.min(1, obj.width))
      : 0.1; // Default 10% width
    const height = typeof obj.height === 'number'
      ? Math.max(0, Math.min(1, obj.height))
      : 0.1; // Default 10% height

    return {
      top: Math.max(0, Math.min(1, y - height / 2)),
      left: Math.max(0, Math.min(1, x - width / 2)),
      width,
      height,
    };
  }

  // Case 2: Percentage values (0-100) { top: 22, left: 33.5, width: 21, height: 13 }
  if (
    typeof obj.top === 'number' &&
    typeof obj.left === 'number' &&
    typeof obj.width === 'number' &&
    typeof obj.height === 'number'
  ) {
    // Check if values are in 0-100 range (percentage) or 0-1 range (normalized)
    const maxVal = Math.max(
      obj.top,
      obj.left,
      obj.top + obj.height,
      obj.left + obj.width
    );
    
    if (maxVal > 1) {
      // Percentage values (0-100), convert to 0-1
      return {
        top: Math.max(0, Math.min(1, obj.top / 100)),
        left: Math.max(0, Math.min(1, obj.left / 100)),
        width: Math.max(0, Math.min(1, obj.width / 100)),
        height: Math.max(0, Math.min(1, obj.height / 100)),
      };
    } else {
      // Already normalized (0-1)
      return {
        top: Math.max(0, Math.min(1, obj.top)),
        left: Math.max(0, Math.min(1, obj.left)),
        width: Math.max(0, Math.min(1, obj.width)),
        height: Math.max(0, Math.min(1, obj.height)),
      };
    }
  }

  // Case 3: Pixel values (requires imageSize)
  if (
    imageSize &&
    typeof obj.x === 'number' &&
    typeof obj.y === 'number' &&
    typeof obj.width === 'number' &&
    typeof obj.height === 'number'
  ) {
    return {
      top: getRelativePos(obj.y, imageSize.height),
      left: getRelativePos(obj.x, imageSize.width),
      width: getRelativePos(obj.width, imageSize.width),
      height: getRelativePos(obj.height, imageSize.height),
    };
  }

  return null;
}

/**
 * Get CSS style properties for highlighting a bounding box
 */
export function getHighlightStyle(box: BoundingBox): CSSProperties {
  return {
    top: `${box.top * 100}%`,
    left: `${box.left * 100}%`,
    width: `${box.width * 100}%`,
    height: `${box.height * 100}%`,
  };
}

/**
 * Get center point from bounding box
 */
export function getBoxCenter(box: BoundingBox): NormalizedCoord {
  return {
    x: box.left + box.width / 2,
    y: box.top + box.height / 2,
  };
}

/**
 * Normalize an item with its coordinates
 */
export function normalizeItem(
  item: ItemRow,
  imageSize?: { width: number; height: number }
): NormalizedItem {
  const normalizedBox = normalizeCoordinates(item.center, imageSize);
  const normalizedCenter = normalizedBox ? getBoxCenter(normalizedBox) : null;

  return {
    ...item,
    normalizedBox,
    normalizedCenter,
  };
}

