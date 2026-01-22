"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "./Sidebar";
import { MobileNavBar } from "./MobileNavBar";

/**
 * ConditionalNav - Conditionally renders sidebar and mobile nav
 *
 * Hides navigation on:
 * - Main landing page (/)
 *
 * Shows navigation on:
 * - All other routes (/feed, /detail, etc.)
 */
export function ConditionalNav() {
  const pathname = usePathname();

  // Hide navigation on main landing page
  const isMainPage = pathname === "/";

  if (isMainPage) {
    return null;
  }

  return (
    <>
      {/* Desktop Sidebar */}
      <Sidebar />
      {/* Mobile Bottom Nav */}
      <MobileNavBar />
    </>
  );
}

/**
 * MainContentWrapper - Wrapper for main content area
 *
 * Applies sidebar offset only on non-main pages
 */
export function MainContentWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // No offset on main landing page
  const isMainPage = pathname === "/";

  return (
    <main
      className={
        isMainPage
          ? "min-h-screen"
          : "md:ml-14 lg:ml-[200px] min-h-screen transition-[margin] duration-200"
      }
    >
      {children}
    </main>
  );
}
