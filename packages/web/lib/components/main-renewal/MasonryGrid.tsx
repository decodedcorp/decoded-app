"use client";

import type { GridItemData } from "./types";
import MasonryGridItem from "./MasonryGridItem";

interface MasonryGridProps {
  items: GridItemData[];
  className?: string;
}

/**
 * MasonryGrid -- CSS columns-based masonry layout.
 *
 * Uses CSS `columns` for true masonry behavior (vertical fill, then wrap).
 * No external masonry library required.
 */
export default function MasonryGrid({ items, className }: MasonryGridProps) {
  return (
    <section className={`bg-mag-bg px-4 py-16 sm:px-6 lg:px-8 ${className ?? ""}`}>
      {/* Section header */}
      <div className="mx-auto mb-10 max-w-7xl">
        <h2 className="text-2xl font-bold uppercase tracking-widest text-mag-text sm:text-3xl">
          DECODED PICKS
        </h2>
        <div className="mt-2 h-0.5 w-12 bg-mag-accent" />
      </div>

      {/* Masonry grid */}
      <div className="mx-auto max-w-7xl columns-1 gap-4 sm:columns-2 lg:columns-3 xl:columns-4">
        {items.map((item, index) => (
          <div key={item.id} className="mb-4 break-inside-avoid">
            <MasonryGridItem item={item} index={index} />
          </div>
        ))}
      </div>
    </section>
  );
}
