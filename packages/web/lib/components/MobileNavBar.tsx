"use client";

import { memo, useState, useCallback } from "react";
import { usePathname } from "next/navigation";
import { Home, Search, PlusCircle, LayoutGrid, User } from "lucide-react";
import { NavBar, NavItem } from "@/lib/design-system";
import { RequestModal } from "./request/RequestModal";

interface NavItemConfig {
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
const navItems: NavItemConfig[] = [
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
      <NavBar>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <NavItem
              key={item.id}
              icon={<Icon className="h-[22px] w-[22px]" />}
              label={item.label}
              href={item.isAction ? undefined : item.href}
              onClick={item.isAction ? handleRequestOpen : undefined}
              active={isActive}
              disabled={item.disabled}
            />
          );
        })}
      </NavBar>

      {/* Request Modal */}
      <RequestModal isOpen={isRequestModalOpen} onClose={handleRequestClose} />
    </>
  );
});

MobileNavBar.displayName = "MobileNavBar";
