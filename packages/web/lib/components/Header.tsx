"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HierarchicalFilter } from "./filter";
import { SearchInput } from "./SearchInput";
import { SponsorBanner } from "./SponsorBanner";
import { MoreMenu } from "./MoreMenu";
import { ThemeToggle } from "./ThemeToggle";
import DecodedLogo from "./DecodedLogo";

function NavLink({
  href,
  children,
  isActive,
}: {
  href: string;
  children: React.ReactNode;
  isActive: boolean;
}) {
  return (
    <Link
      href={href}
      className={`px-3 py-1.5 text-sm font-medium rounded-full transition-colors ${
        isActive
          ? "bg-foreground text-background"
          : "text-muted-foreground hover:text-foreground hover:bg-muted"
      }`}
    >
      {children}
    </Link>
  );
}

export function Header() {
  const pathname = usePathname();

  return (
    <header
      className="fixed top-0 left-0 right-0 z-[9999] w-full bg-transparent pointer-events-none"
      aria-label="Thiings controls"
    >
      <div className="w-full px-2 md:px-3 h-14 md:h-16 flex items-center justify-between gap-2 md:gap-3 pointer-events-auto">
        <div className="flex items-center gap-1 flex-shrink-0 overflow-visible">
          <Link
            href="/"
            className="relative w-64 md:w-72 h-16 md:h-18 flex items-center justify-center -ml-6 hover:opacity-80 transition-opacity overflow-visible"
            aria-label="Go to home"
          >
            <DecodedLogo
              asciiFontSize={3}
              textFontSize={200}
              planeBaseHeight={12}
              enableWaves={false}
              enableHueRotate={true}
            />
          </Link>

          {/* Navigation links - hidden on mobile (use MobileNavBar instead) */}
          <nav
            aria-label="Main navigation"
            className="hidden md:flex items-center gap-1 ml-2"
          >
            <NavLink href="/" isActive={pathname === "/"}>
              Home
            </NavLink>
            <NavLink href="/explore" isActive={pathname === "/explore"}>
              Explore
            </NavLink>
          </nav>

          {/* Search & Sponsor - hidden on mobile */}
          <div className="hidden md:flex items-center gap-2">
            <SearchInput />
            <SponsorBanner />
          </div>
        </div>
        <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
          {/* Filters - hidden on mobile */}
          <nav aria-label="Filters" className="hidden md:flex items-center">
            <HierarchicalFilter />
          </nav>
          <ThemeToggle />
          <MoreMenu />
        </div>
      </div>
    </header>
  );
}
