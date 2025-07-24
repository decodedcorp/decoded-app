'use client';

import React, {
  useRef,
  useEffect,
  useState,
  useCallback,
  forwardRef,
  useImperativeHandle,
  useMemo,
} from 'react';
import { debounce } from 'lodash';

export interface Position {
  x: number;
  y: number;
}

export interface ItemConfig {
  gridIndex: number;
  position: Position;
  isMoving: boolean;
}

export interface ThiingsGridProps {
  gridWidth: number;
  gridHeight: number;
  renderItem: (config: ItemConfig) => React.ReactNode;
  className?: string;
  viewportMargin?: number;
  onScrollStateChange?: (isScrolling: boolean) => void;
  selectedImagePosition?: Position | null;
  onImageCentered?: () => void;
  isSidebarOpen?: boolean;
  enableZoom?: boolean;
  onZoomChange?: (zoomLevel: number) => void;
}

export interface ThiingsGridRef {
  publicGetCurrentPosition: () => Position;
  centerOnPosition: (position: Position) => void;
  resetZoom: () => void;
}

/**
 * ⚠️ DO NOT REMOVE OR SIMPLIFY:
 * The scroll/zoom/drag/momentum/viewport optimization logic is critical for main page UX and performance.
 * Any refactoring must preserve the user experience and performance characteristics.
 * Only remove/replace code after thorough testing and validation.
 */
