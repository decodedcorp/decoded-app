"use client";

import { Sidebar } from "./Sidebar";
import { MobileNavBar } from "./MobileNavBar";

/**
 * ConditionalNav - Renders sidebar and mobile nav on all pages
 *
 * Shows navigation on:
 * - All routes including main page (/)
 */
export function ConditionalNav() {
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
 * Applies sidebar offset on all pages
 */
export function MainContentWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="md:ml-14 lg:ml-[200px] min-h-screen transition-[margin] duration-200">
      {children}
    </main>
  );
}
