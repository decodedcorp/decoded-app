"use client";

import type { ImageRow } from '@/lib/supabase/types';
import { useItemsByImageId } from '@/lib/hooks/useItems';
import { normalizeItem } from './types';
import { HeroSection } from './HeroSection';
import { InteractiveShowcase } from './InteractiveShowcase';
import { ShopGrid } from './ShopGrid';

type Props = {
  image: ImageRow;
};

/**
 * Shared content component for image detail view
 * Used by both modal and full page versions
 *
 * Sections:
 * 1. Hero Section - Full-screen image with dramatic typography
 * 2. Interactive Showcase - Sticky layout with item highlights (if items exist)
 * 3. Shop Grid - Grid of items (if items exist)
 */
export function ImageDetailContent({ image }: Props) {
  const { data: items = [], isLoading: itemsLoading } = useItemsByImageId(
    image.id
  );

  // Normalize items with coordinates
  const normalizedItems = items.map((item) => normalizeItem(item));

  // Check if we have items with valid coordinates
  const hasItems = normalizedItems.some(
    (item) => item.normalizedBox !== null
  );

  return (
    <div className="detail-content">
      {/* Section 1: Hero */}
      <HeroSection image={image} />

      {/* Section 2: Interactive Showcase (only if items exist) */}
      {!itemsLoading && hasItems && (
        <InteractiveShowcase image={image} items={normalizedItems} />
      )}

      {/* Section 3: Shop Grid (only if items exist) */}
      {!itemsLoading && hasItems && <ShopGrid items={normalizedItems} />}

      {/* Fallback: Show basic info if no items */}
      {!itemsLoading && !hasItems && (
        <div className="mx-auto max-w-4xl px-4 py-16 md:px-8">
          <div className="mb-8">
            <div className="mb-4 flex flex-wrap gap-2">
              {image.status && (
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium uppercase tracking-wide ${
                    image.status === 'pending'
                      ? 'bg-amber-100 text-amber-900 dark:bg-amber-900/40 dark:text-amber-100'
                      : image.status === 'extracted'
                        ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-900/40 dark:text-emerald-100'
                        : 'bg-slate-100 text-slate-900 dark:bg-slate-800/80 dark:text-slate-100'
                  }`}
                >
                  {image.status}
                </span>
              )}
              {image.with_items && (
                <span className="rounded-full bg-blue-500/80 px-3 py-1 text-xs font-medium uppercase tracking-wide text-blue-100">
                  Items Detected
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              Created: {new Date(image.created_at).toLocaleDateString()}
            </p>
          </div>

          <div className="mb-12">
            <h1 className="mb-4 text-4xl font-bold md:text-5xl">
              Image Details
            </h1>
            <p className="text-lg text-muted-foreground">
              Image ID: <code className="rounded bg-muted px-2 py-1 text-sm">{image.id}</code>
            </p>
          </div>

          <div>
            <h2 className="mb-4 text-2xl font-semibold">Details</h2>
            <p className="text-muted-foreground">
              No items with coordinates found for this image.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
