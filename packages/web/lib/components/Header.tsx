"use client";

import React from "react";
import Link from "next/link";
import { HierarchicalFilter } from "./filter";
import { SearchInput } from "./SearchInput";
import { SponsorBanner } from "./SponsorBanner";
import { MoreMenu } from "./MoreMenu";
import { ThemeToggle } from "./ThemeToggle";
import DecodedLogo from "./DecodedLogo";

export function Header() {
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
          <SearchInput />
          <SponsorBanner />
        </div>
        <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
          <nav aria-label="Filters" className="flex items-center">
            <HierarchicalFilter />
          </nav>
          <ThemeToggle />
          <MoreMenu />
        </div>
      </div>
    </header>
  );
}
