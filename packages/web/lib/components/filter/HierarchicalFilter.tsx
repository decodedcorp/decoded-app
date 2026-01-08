"use client";

import React from "react";
import { useIsMobile } from "../../hooks/useMediaQuery";
import { MobileFilterSheet } from "./MobileFilterSheet";
import { DesktopFilterBar } from "./DesktopFilterBar";

/**
 * HierarchicalFilter - Responsive filter component
 *
 * Displays:
 * - Mobile (< 768px): Bottom sheet with drill-down navigation
 * - Desktop (>= 768px): Horizontal filter bar with dropdowns
 */
export function HierarchicalFilter() {
  const isMobile = useIsMobile();

  return isMobile ? <MobileFilterSheet /> : <DesktopFilterBar />;
}
