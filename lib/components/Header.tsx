"use client";

import React from "react";
import { FilterTabs } from "./FilterTabs";
import { SearchInput } from "./SearchInput";
import { SponsorBanner } from "./SponsorBanner";
import { MoreMenu } from "./MoreMenu";

export function Header() {
  return (
    <header
      className="fixed top-0 left-0 right-0 z-[9999] w-full"
      aria-label="Thiings controls"
    >
      <div className="w-full px-2 md:px-3 h-14 md:h-16 flex items-center justify-between gap-2 md:gap-3">
        <div className="flex items-center gap-2 flex-shrink-0">
          <SearchInput />
          <SponsorBanner />
        </div>
        <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
          <nav aria-label="Filters" className="flex items-center">
            <FilterTabs />
          </nav>
        </div>
      </div>
    </header>
  );
}
