"use client";

import { memo, useState, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, PlusCircle, LayoutGrid, User } from "lucide-react";
import { RequestModal } from "./request/RequestModal";

interface NavItem {
  id: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  disabled?: boolean;
  isAction?: boolean;
}

/**
 * Navigation items per decoded.pen Mobile Nav Bar spec:
 * Home, Search, Request, Feed, Profile (5 items)
 */
const navItems: NavItem[] = [
  { id: "home", href: "/", icon: Home, label: "Home" },
  { id: "search", href: "/search", icon: Search, label: "Search" },
  {
    id: "request",
    href: "#",
    icon: PlusCircle,
    label: "Request",
    isAction: true,
  },
  { id: "feed", href: "/feed", icon: LayoutGrid, label: "Feed" },
  { id: "profile", href: "/profile", icon: User, label: "Profile" },
];

/**
 * MobileNavBar - Bottom navigation bar per decoded.pen spec
 *
 * Design spec:
 * - Height: 64px
 * - 5 items: Home, Search, Request, Feed, Profile
 * - Each item: icon (22px) + label (10px, font-medium)
 * - Background: card color
 * - Padding: 8px 24px
 *
 * Features:
 * - Fixed at bottom on mobile (<768px)
 * - Hidden on desktop (md:hidden)
 * - Active state with primary color
 * - Safe area support for iPhone notch
 * - Request opens modal instead of page navigation
 */
export const MobileNavBar = memo(() => {
  const pathname = usePathname();
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);

  const handleRequestOpen = useCallback(() => {
    setIsRequestModalOpen(true);
  }, []);

  const handleRequestClose = useCallback(() => {
    setIsRequestModalOpen(false);
  }, []);

  return (
    <>
      <nav
        role="navigation"
        aria-label="Main navigation"
        className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
      >
        <div className="flex h-16 items-center justify-between border-t border-border bg-card px-6 py-2 pb-[calc(8px+env(safe-area-inset-bottom,0px))]">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            if (item.disabled) {
              return (
                <button
                  key={item.id}
                  disabled
                  className="flex flex-col items-center gap-1 opacity-40 cursor-not-allowed"
                  aria-label={`${item.label} (coming soon)`}
                  aria-disabled="true"
                >
                  <Icon className="h-[22px] w-[22px]" />
                  <span className="text-[10px] font-medium">{item.label}</span>
                </button>
              );
            }

            if (item.isAction) {
              return (
                <button
                  key={item.id}
                  onClick={handleRequestOpen}
                  className="flex flex-col items-center gap-1 transition-colors text-muted-foreground hover:text-foreground"
                  aria-label={item.label}
                >
                  <Icon className="h-[22px] w-[22px]" />
                  <span className="text-[10px] font-medium">{item.label}</span>
                </button>
              );
            }

            return (
              <Link
                key={item.id}
                href={item.href}
                className={`flex flex-col items-center gap-1 transition-colors ${
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                aria-current={isActive ? "page" : undefined}
              >
                <Icon className="h-[22px] w-[22px]" />
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Request Modal */}
      <RequestModal isOpen={isRequestModalOpen} onClose={handleRequestClose} />
    </>
  );
});

MobileNavBar.displayName = "MobileNavBar";
