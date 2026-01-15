"use client";

import { memo, useState, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Compass, Search, Plus, User } from "lucide-react";
import DecodedLogo from "./DecodedLogo";
import { SidebarSearchPanel } from "./SidebarSearchPanel";

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
  { id: "explore", href: "/explore", icon: Compass, label: "Explore" },
  { id: "search", href: "#", icon: Search, label: "Search", isAction: true },
  {
    id: "create",
    href: "/create",
    icon: Plus,
    label: "Create",
    disabled: true,
  },
];

interface NavItemComponentProps {
  item: NavItem;
  isActive: boolean;
  onClick?: () => void;
}

const NavItemComponent = memo(
  ({ item, isActive, onClick }: NavItemComponentProps) => {
    const Icon = item.icon;

    const baseClasses =
      "flex items-center gap-4 p-3 rounded-xl transition-all duration-200 w-full";
    const activeClasses = isActive
      ? "bg-sidebar-accent text-sidebar-accent-foreground"
      : "text-sidebar-foreground hover:bg-sidebar-accent/50";
    const disabledClasses = item.disabled
      ? "opacity-40 cursor-not-allowed"
      : "";

    const content = (
      <>
        <Icon
          className={`h-6 w-6 flex-shrink-0 ${
            isActive ? "stroke-[2.5]" : "stroke-[1.5]"
          }`}
        />
        <span className="hidden lg:block truncate text-base">{item.label}</span>
      </>
    );

    if (item.disabled) {
      return (
        <button
          disabled
          className={`${baseClasses} ${disabledClasses}`}
          aria-label={`${item.label} (coming soon)`}
          aria-disabled="true"
        >
          {content}
        </button>
      );
    }

    if (item.isAction && onClick) {
      return (
        <button
          onClick={onClick}
          className={`${baseClasses} ${activeClasses}`}
          aria-label={item.label}
          aria-expanded={isActive}
        >
          {content}
        </button>
      );
    }

    return (
      <Link
        href={item.href}
        className={`${baseClasses} ${activeClasses}`}
        aria-current={isActive ? "page" : undefined}
        aria-label={item.label}
      >
        {content}
      </Link>
    );
  }
);

NavItemComponent.displayName = "NavItemComponent";

/**
 * Sidebar - Instagram-style left navigation bar
 *
 * Features:
 * - Fixed on left side for desktop/tablet (md+)
 * - Hidden on mobile (<768px)
 * - Collapsed (icons only) on tablet (768-1023px): 60px width
 * - Expanded (icons + text) on desktop (1024px+): 240px width
 * - Search panel slides out on Search click
 * - Uses existing CSS variables (--sidebar-*)
 */
export const Sidebar = memo(() => {
  const pathname = usePathname();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleSearchToggle = useCallback(() => {
    setIsSearchOpen((prev) => !prev);
  }, []);

  const handleSearchClose = useCallback(() => {
    setIsSearchOpen(false);
  }, []);

  return (
    <>
      {/* Main Sidebar */}
      <aside
        role="navigation"
        aria-label="Main navigation"
        className="fixed left-0 top-0 h-screen z-50 hidden md:flex flex-col
                   w-[60px] lg:w-[240px]
                   bg-sidebar border-r border-sidebar-border
                   transition-[width] duration-300"
      >
        {/* Logo Section */}
        <div className="h-16 lg:h-20 flex items-center justify-center lg:justify-start px-3 lg:px-4">
          <Link
            href="/"
            className="flex items-center"
            aria-label="decoded home"
          >
            {/* Collapsed: Text "D" */}
            <div className="lg:hidden w-10 h-10 flex items-center justify-center">
              <span className="text-primary text-2xl font-bold font-serif">
                D
              </span>
            </div>
            {/* Expanded: ASCII Logo */}
            <div className="hidden lg:block relative w-32 h-14 overflow-visible">
              <DecodedLogo
                asciiFontSize={2}
                textFontSize={100}
                planeBaseHeight={6}
                enableWaves={false}
                enableHueRotate={false}
              />
            </div>
          </Link>
        </div>

        {/* Navigation Section */}
        <nav className="flex-1 flex flex-col gap-1 px-2 py-4">
          {navItems.map((item) => {
            const isActive =
              item.id === "search"
                ? isSearchOpen
                : pathname === item.href ||
                  (item.href !== "/" && pathname.startsWith(item.href));

            return (
              <NavItemComponent
                key={item.id}
                item={item}
                isActive={isActive}
                onClick={item.isAction ? handleSearchToggle : undefined}
              />
            );
          })}
        </nav>

        {/* Profile Section (Bottom) */}
        <div className="px-2 py-4 border-t border-sidebar-border">
          <NavItemComponent
            item={{
              id: "profile",
              href: "/profile",
              icon: User,
              label: "Profile",
              disabled: true,
            }}
            isActive={pathname === "/profile"}
          />
        </div>
      </aside>

      {/* Search Panel (Slide out) */}
      <SidebarSearchPanel isOpen={isSearchOpen} onClose={handleSearchClose} />
    </>
  );
});

Sidebar.displayName = "Sidebar";
