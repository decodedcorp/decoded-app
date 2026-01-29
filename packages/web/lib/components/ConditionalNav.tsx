"use client";

import { DesktopHeader, MobileHeader } from "@/lib/design-system";
import { MobileNavBar } from "./MobileNavBar";

/**
 * ConditionalNav - Renders header-based navigation and mobile nav
 *
 * Shows navigation on:
 * - All routes including main page (/)
 *
 * Layout:
 * - Desktop (md+): DesktopHeader at top
 * - Mobile (<md): MobileHeader at top + MobileNavBar at bottom
 */
export function ConditionalNav() {
  return (
    <>
      {/* Desktop Header - visible on md+ */}
      <DesktopHeader />
      {/* Mobile Header - visible on <md */}
      <MobileHeader />
      {/* Mobile Bottom Nav - preserved */}
      <MobileNavBar />
    </>
  );
}

/**
 * MainContentWrapper - Wrapper for main content area
 *
 * Applies padding for top header and bottom nav per decoded.pen:
 * - pt-14 md:pt-[72px]: Top padding (56px mobile header, 72px desktop header)
 * - pb-16 md:pb-0: Bottom padding (64px mobile nav bar, none on desktop)
 */
export function MainContentWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen pt-14 md:pt-[72px] pb-16 md:pb-0">
      {children}
    </main>
  );
}
