"use client";

import type { PostDetail } from "@/lib/supabase/queries/posts";
import { spotToItemRow, normalizeItem } from "./types";
import { ShopGrid } from "./ShopGrid";
import Link from "next/link";
import Image from "next/image";
import { ArticleContent } from "./ArticleContent";
import { MetadataTags } from "./MetadataTags";

type Props = {
  postDetail: PostDetail;
};

/**
 * Content component for post detail view
 *
 * New schema structure:
 * - post: PostRow (main content)
 * - spots: SpotRow[] (item locations in image)
 * - solutions: SolutionRow[] (product matches for spots)
 *
 * Sections:
 * 1. Hero Section - Post info with artist/group name
 * 2. Article & Metadata - media_title and media_metadata
 * 3. Main Image - Post's primary image
 * 4. Shop Grid - Items from solutions
 */
export function PostDetailContent({ postDetail }: Props) {
  const { post, spots, solutions } = postDetail;

  // Map spots to legacy item format for ShopGrid compatibility
  const items = spots.map((spot) => {
    const solution = solutions.find((s) => s.spot_id === spot.id);
    return spotToItemRow(spot, solution);
  });

  // Normalize items for UI
  const normalizedItems = items.map((item) => normalizeItem(item));

  const hasItems = normalizedItems.length > 0;
  const hasImage = !!post.image_url;

  // Display name: prefer artist_name, fallback to group_name
  const displayName = post.artist_name || post.group_name || "Unknown";

  // Extract metadata tags from media_metadata if available
  const metadataTags = extractMetadataTags(post.media_metadata);

  return (
    <div className="detail-content">
      {/* Section 1: Hero */}
      <div className="relative min-h-[50vh] flex items-center justify-center bg-gradient-to-b from-background to-muted/20">
        <div className="mx-auto max-w-4xl px-4 py-16 md:px-8 text-center">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background/80 backdrop-blur-sm border border-border/50 shadow-sm mb-6">
              <span className="w-2 h-2 rounded-full bg-emerald-500/80" />
              <span className="text-sm font-medium text-foreground">
                @{displayName}
              </span>
            </div>
            {/* Title from media_title */}
            {post.media_title ? (
              <h1 className="text-4xl md:text-6xl font-bold mb-4">
                {post.media_title}
              </h1>
            ) : (
              <h1 className="text-4xl md:text-6xl font-bold mb-4">
                Post Details
              </h1>
            )}
            <p className="text-muted-foreground">
              {solutions.length} {solutions.length === 1 ? "item" : "items"}{" "}
              featured
              {spots.length > 0 &&
                ` • ${spots.length} ${spots.length === 1 ? "spot" : "spots"} marked`}
            </p>
            {post.created_at && (
              <p className="text-sm text-muted-foreground mt-2">
                Posted: {new Date(post.created_at).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Section 2: Metadata Tags */}
      {metadataTags.length > 0 && <MetadataTags tags={metadataTags} />}

      {/* Section 3: Article Content (if media_title exists as detailed content) */}
      {post.context && <ArticleContent content={post.context} />}

      {/* Section 4: Main Image */}
      {hasImage && (
        <div className="bg-muted/10 border-b border-border">
          <div className="mx-auto max-w-6xl px-4 py-12 md:px-8">
            <h2 className="text-2xl font-bold mb-6">Image</h2>
            <div className="relative aspect-[3/4] max-w-2xl mx-auto overflow-hidden rounded-lg border border-border bg-muted">
              <Image
                src={post.image_url!}
                alt={post.media_title || `Post ${post.id}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
              {/* Render spot markers on the image */}
              {spots.map((spot) => (
                <div
                  key={spot.id}
                  className="absolute w-6 h-6 -translate-x-1/2 -translate-y-1/2 bg-emerald-500/80 rounded-full border-2 border-white shadow-lg cursor-pointer hover:scale-110 transition-transform"
                  style={{
                    left: `${parseFloat(spot.position_left)}%`,
                    top: `${parseFloat(spot.position_top)}%`,
                  }}
                  title={
                    solutions.find((s) => s.spot_id === spot.id)
                      ?.title || "Item"
                  }
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Section 5: Shop Grid */}
      {hasItems && <ShopGrid items={normalizedItems} />}

      {/* Fallback: Show basic info if no items */}
      {!hasItems && (
        <div className="mx-auto max-w-4xl px-4 py-16 md:px-8">
          <div className="text-center">
            <h2 className="mb-4 text-2xl font-semibold">No Items</h2>
            <p className="text-muted-foreground">
              This post doesn&apos;t have any items yet.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Extract metadata tags from media_metadata JSON
 */
function extractMetadataTags(metadata: unknown): string[] {
  if (!metadata || typeof metadata !== "object") return [];

  // Try common metadata patterns
  if (Array.isArray(metadata)) {
    return metadata.filter((item): item is string => typeof item === "string");
  }

  // Check for tags array in metadata
  if (
    "tags" in metadata &&
    Array.isArray((metadata as { tags?: unknown }).tags)
  ) {
    return (metadata as { tags: unknown[] }).tags.filter(
      (item): item is string => typeof item === "string"
    );
  }

  // Check for keywords
  if (
    "keywords" in metadata &&
    Array.isArray((metadata as { keywords?: unknown }).keywords)
  ) {
    return (metadata as { keywords: unknown[] }).keywords.filter(
      (item): item is string => typeof item === "string"
    );
  }

  return [];
}
