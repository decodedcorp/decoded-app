"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Bell } from "lucide-react";
import DecodedLogo from "@/lib/components/DecodedLogo";
import { useAuthStore } from "@/lib/stores/authStore";

/**
 * Desktop Header Variants
 *
 * Sticky header for desktop viewports (md+) with navigation, search, and user area.
 * Part of the Desktop Infrastructure phase - replaces Sidebar navigation on desktop.
 *
 * @see .planning/phases/v2-04-desktop-infrastructure/CONTEXT.md
 * @see docs/design-system/decoded.pen
 */
export const desktopHeaderVariants = cva(
  "fixed top-0 left-0 right-0 z-30 w-full backdrop-blur-md transition-all hidden md:flex",
  {
    variants: {
      variant: {
        default: "bg-background/95 border-b border-border",
        transparent: "bg-transparent border-b border-transparent",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface DesktopHeaderProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof desktopHeaderVariants> {
  onSearchClick?: () => void;
}

/**
 * Navigation items configuration
 * @see decoded.pen Desktop Header: Home, Feed, Explore, Request
 */
const NAV_ITEMS = [
  { href: "/", label: "Home" },
  { href: "/feed", label: "Feed" },
  { href: "/explore", label: "Explore" },
  { href: "/request", label: "Request" },
] as const;

/**
 * DesktopHeader Component
 *
 * Desktop-only header with:
 * - Left: DecodedLogo (links to home)
 * - Center: Navigation links (Home, Discover, Create)
 * - Right: Search icon, conditional auth UI (Login button or Avatar + Notification)
 *
 * Height: 64px (--header-height-desktop)
 * Visible: md breakpoint and above only
 */
export function DesktopHeader({
  variant,
  onSearchClick,
  className,
  ...props
}: DesktopHeaderProps) {
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);

  return (
    <header
      className={cn(desktopHeaderVariants({ variant }), className)}
      style={{ height: "72px" }}
      {...props}
    >
      <div className="w-full flex items-center justify-between h-full px-16">
        {/* Left Section: Logo - flex-1 for equal width with right */}
        <div className="flex-1 flex items-center">
          <Link
            href="/"
            className="relative w-48 h-16 flex items-center justify-center hover:opacity-80 transition-opacity"
            aria-label="Go to home"
          >
            <DecodedLogo
              asciiFontSize={4}
              textFontSize={200}
              planeBaseHeight={12}
              enableWaves={false}
              enableHueRotate={false}
            />
          </Link>
        </div>

        {/* Center Section: Navigation - True center with flex-none */}
        <nav
          className="flex-none flex items-center gap-8"
          aria-label="Main navigation"
        >
          {NAV_ITEMS.map(({ href, label }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "text-sm transition-colors",
                  isActive
                    ? "text-primary font-semibold"
                    : "text-muted-foreground hover:text-foreground font-medium"
                )}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Right Section: Search + Auth UI - flex-1 for equal width with left */}
        <div className="flex-1 flex items-center justify-end gap-4">
          {/* Search Icon Button */}
          <button
            onClick={onSearchClick}
            className="p-2 rounded-md hover:bg-accent transition-colors"
            aria-label="Search"
          >
            <Search className="h-5 w-5 text-muted-foreground" />
          </button>

          {/* Conditional Auth UI */}
          {user ? (
            <div className="flex items-center gap-3">
              {/* Notification Bell */}
              <button
                className="p-2 rounded-md hover:bg-accent transition-colors"
                aria-label="Notifications"
              >
                <Bell className="h-5 w-5 text-muted-foreground" />
              </button>

              {/* User Avatar Placeholder */}
              <Link
                href="/profile"
                className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors"
                aria-label="Go to profile"
              >
                <span className="text-sm font-medium text-primary">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </Link>
            </div>
          ) : (
            <Link
              href="/login"
              className="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
