"use client";

import { usePathname } from "next/navigation";
import { DesktopFooter } from "@/lib/design-system";

/**
 * ConditionalFooter - Conditionally renders footer based on route
 *
 * Hides footer on:
 * - /explore - Full-screen ThiingsGrid experience
 */
const HIDDEN_FOOTER_PATHS = ["/explore"];

export function ConditionalFooter({ className }: { className?: string }) {
  const pathname = usePathname();
  const shouldHide = HIDDEN_FOOTER_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );

  if (shouldHide) return null;
  return <DesktopFooter className={className} />;
}
