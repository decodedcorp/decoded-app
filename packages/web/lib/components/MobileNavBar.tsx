"use client";

import { memo, useState, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, HelpCircle, User } from "lucide-react";
import { RequestModal } from "./request/RequestModal";

interface NavItem {
  id: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  disabled?: boolean;
  isAction?: boolean;
}

const navItems: NavItem[] = [
  { id: "home", href: "/", icon: Home, label: "Home" },
  { id: "explore", href: "/explore", icon: Search, label: "Explore" },
  {
    id: "request",
    href: "#",
    icon: HelpCircle,
    label: "Request",
    isAction: true,
  },
  { id: "profile", href: "/profile", icon: User, label: "Profile" },
];

/**
 * MobileNavBar - Instagram-style bottom navigation bar
 *
 * Features:
 * - Fixed at bottom on mobile (<768px)
 * - Hidden on desktop (md:hidden)
 * - Lucide icons only (no labels)
 * - Active state with filled stroke
 * - Disabled state for unimplemented tabs
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
        <div className="flex items-center justify-around border-t border-border bg-background/95 backdrop-blur-lg pb-[env(safe-area-inset-bottom,0px)]">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            if (item.disabled) {
              return (
                <button
                  key={item.id}
                  disabled
                  className="flex h-14 w-full items-center justify-center opacity-40 cursor-not-allowed"
                  aria-label={`${item.label} (coming soon)`}
                  aria-disabled="true"
                >
                  <Icon className="h-6 w-6" />
                </button>
              );
            }

            if (item.isAction) {
              return (
                <button
                  key={item.id}
                  onClick={handleRequestOpen}
                  className="flex h-14 w-full items-center justify-center transition-colors text-muted-foreground hover:text-foreground"
                  aria-label={item.label}
                >
                  <Icon className="h-6 w-6 stroke-[1.5]" />
                </button>
              );
            }

            return (
              <Link
                key={item.id}
                href={item.href}
                className={`flex h-14 w-full items-center justify-center transition-colors ${
                  isActive
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                aria-current={isActive ? "page" : undefined}
                aria-label={item.label}
              >
                <Icon
                  className={`h-6 w-6 ${isActive ? "stroke-[2.5]" : "stroke-[1.5]"}`}
                />
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
