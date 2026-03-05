"use client";

import { usePathname } from "next/navigation";
import { DesktopHeader, MobileHeader } from "@/lib/design-system";
import { MobileNavBar } from "./MobileNavBar";

/**
 * ConditionalNav - Renders header-based navigation and mobile nav
 *
 * Hidden on /admin routes (admin has its own sidebar layout).
 *
 * Layout:
 * - Desktop (md+): DesktopHeader at top
 * - Mobile (<md): MobileHeader at top + MobileNavBar at bottom
 */
export function ConditionalNav() {
  const pathname = usePathname();

  // Hide all main-app navigation on admin routes and renewed main page
  if (pathname.startsWith("/admin") || pathname === "/") {
    return null;
  }

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
 *
 * No padding on /admin routes (admin layout handles its own spacing).
 */
export function MainContentWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Admin and renewed main page manage their own padding — no main-app header offset needed
  if (pathname.startsWith("/admin") || pathname === "/") {
    return <>{children}</>;
  }

  return (
    <main className="min-h-screen pt-14 md:pt-[72px] pb-16 md:pb-0">
      {children}
    </main>
  );
}
