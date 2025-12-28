"use client";

import { RefObject } from "react";
import type { ImageDetail } from "@/lib/supabase/queries/images";
import type { Json } from "@/lib/supabase/types";
import { normalizeItem } from "./types";
import { HeroSection } from "./HeroSection";
import { InteractiveShowcase } from "./InteractiveShowcase";
import { ShopGrid } from "./ShopGrid";
import { RelatedImages } from "./RelatedImages";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { useMemo } from "react";
import { createElement, Fragment } from "react";
import { MetadataTags } from "./MetadataTags";

type Props = {
  image: ImageDetail;
  isModal?: boolean;
  scrollContainerRef?: RefObject<HTMLElement>;
  // Controlled active index state (optional, for lifting state up)
  activeIndex?: number | null;
  onActiveIndexChange?: (index: number | null) => void;
  // If true, hides the hero/interactive image (useful for modal split layout where image is external)
  hideImage?: boolean;
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
export function ImageDetailContent({
  image,
  isModal = false,
  scrollContainerRef,
  activeIndex,
  onActiveIndexChange,
  hideImage = false,
}: Props) {
  // Items are now pre-fetched via post.item_ids (if post_image exists)
  // Fallback to item.image_id if no post_image found
  const items = image.items || [];

  // Check if items were fetched via post (postImages exist)
  const itemsFromPost = image.postImages && image.postImages.length > 0;

  // Extract article from the first post
  const firstPost = image.postImages?.[0]?.post || image.posts?.[0];
  const article = firstPost?.article?.trim();
  const metadata = firstPost?.metadata;

  // Extract Anchor from metadata
  const anchor = useMemo(() => {
    if (!metadata) return null;
    const anchorTag = metadata.find(
      (tag) =>
        tag.toLowerCase().startsWith("anchor:") ||
        tag.toLowerCase().startsWith("summary:")
    );
    if (!anchorTag) return null;
    // Remove "Anchor:" or "Summary:" prefix and trim
    return anchorTag.replace(/^(anchor|summary):\s*/i, "").trim();
  }, [metadata]);

  // Preprocess article to handle **{}** pattern for bold formatting
  // Replace **{}** with a placeholder that markdown can parse, then restore in components
  const preprocessArticle = useMemo(() => {
    if (!article) return "";
    // Replace **{}** with **BRACE_BOLD_PLACEHOLDER** so markdown parser can recognize it
    return article.replace(/\*\*\{\}\*\*/g, "**BRACE_BOLD_PLACEHOLDER**");
  }, [article]);

  // Normalize items with coordinates
  // Use item_locations from the first post_image if available to override item centers
  const firstPostImage = image.postImages?.[0];
  const itemLocations = firstPostImage?.item_locations;

  // Convert item_locations to a map for easy lookup if it's an array
  // Support both Array format (existing data) and Record format (new data)
  const itemLocationsMap: Record<
    string,
    { bbox?: number[] | null; center?: Json | null; score?: number | null }
  > = {};

  if (Array.isArray(itemLocations)) {
    itemLocations.forEach((loc: any) => {
      if (loc && loc.item_id) {
        // Extract bbox/center/score from location object
        // Data format: { item_id: 123, center: [...], bbox: [...], score: 0.95 }
        itemLocationsMap[loc.item_id.toString()] = {
          bbox: loc.bbox,
          center: loc.center || loc, // Fallback for backward compatibility where loc itself might be center
          score: loc.score,
        };
      }
    });
  } else if (itemLocations && typeof itemLocations === "object") {
    // If it's an object map, we assume it matches the structure or we cast it
    Object.assign(itemLocationsMap, itemLocations);
  }

  const normalizedItems = items.map((item) => {
    // Check if we have an override for this item ID (convert ID to string for lookup)
    const overrideLocation = itemLocationsMap[item.id.toString()];
    return normalizeItem(item, undefined, overrideLocation);
  });

  // Check if we have items (with or without coordinates)
  // Items without coordinates can still be displayed in ShopGrid
  const hasItems = normalizedItems.length > 0;
  const hasItemsWithCoordinates = normalizedItems.some(
    (item) => item.normalizedBox !== null
  );

  return (
    <div className="detail-content">
      {/* Section 1: Hero - Hidden if hideImage is true */}
      {!hideImage && <HeroSection image={image} isModal={isModal} />}

      {/* Featured In Section - Redesigned as Credits Bar */}
      {(image.postImages?.length > 0 || image.posts?.length > 0) && (
        <div className="border-b border-border/40">
          <div className="mx-auto max-w-4xl px-6 py-4 flex items-center justify-center gap-6 text-sm text-muted-foreground overflow-x-auto">
            <span className="font-serif text-xs uppercase tracking-widest text-muted-foreground/60 shrink-0">
              As Seen In
            </span>
            {/* Use postImages if available (with metadata), fallback to posts (backward compatibility) */}
            {image.postImages && image.postImages.length > 0
              ? image.postImages
                  .sort(
                    (a, b) =>
                      new Date(b.created_at).getTime() -
                      new Date(a.created_at).getTime()
                  )
                  .map((postImage) => (
                    <Link
                      key={postImage.post.id}
                      href={`/posts/${postImage.post.id}`}
                      className="group flex items-center gap-2 hover:text-foreground transition-colors"
                      title={`Connected on ${new Date(postImage.created_at).toLocaleDateString()}`}
                    >
                      <span className="font-medium underline decoration-border/50 underline-offset-4 group-hover:decoration-foreground/50 transition-all">
                        @{postImage.post.account}
                      </span>
                    </Link>
                  ))
              : image.posts?.map((post) => (
                  <Link
                    key={post.id}
                    href={`/posts/${post.id}`}
                    className="group flex items-center gap-2 hover:text-foreground transition-colors"
                  >
                    <span className="font-medium underline decoration-border/50 underline-offset-4 group-hover:decoration-foreground/50 transition-all">
                      @{post.account}
                    </span>
                  </Link>
                ))}
          </div>
        </div>
      )}

      {/* About this Look Section - Magazine Style */}
      {article && (
        <section className="mx-auto max-w-3xl px-6 pt-24 pb-12">
          <div className="flex flex-col items-center text-center">
            {/* Metadata Section - Placed above article as requested */}
            {metadata && (
              <div className="mb-12 w-full">
                <MetadataTags tags={metadata} />
              </div>
            )}

            {/* Anchor Section - Always Visible */}
            <div className="mb-16 w-full max-w-2xl">
              {anchor ? (
                <p className="font-serif text-xl md:text-2xl italic leading-relaxed text-foreground/90">
                  &ldquo;{anchor}&rdquo;
                </p>
              ) : (
                <div className="flex flex-col items-center gap-3 select-none opacity-40 hover:opacity-70 transition-opacity">
                  <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-muted-foreground border-b border-border pb-1">
                    Decoded Insight
                  </span>
                  <p className="font-serif text-lg italic text-muted-foreground">
                    This look, decoded.
                  </p>
                </div>
              )}
            </div>

            <div className="w-12 h-0.5 bg-primary mb-10" />
            <h3
              id="about-this-look"
              className="font-serif text-5xl md:text-7xl font-medium mb-12 tracking-tight leading-[1.1]"
            >
              The Editorial
            </h3>
            <article className="prose prose-lg dark:prose-invert font-serif leading-loose text-muted-foreground/90 max-w-none">
              <ReactMarkdown
                components={{
                  p: ({ children }) => <p>{children}</p>,
                  strong: ({ children }) => {
                    // Replace placeholder back to {}
                    const childrenStr = Array.isArray(children)
                      ? children.join("")
                      : String(children);
                    if (childrenStr === "BRACE_BOLD_PLACEHOLDER") {
                      return <strong>{}</strong>;
                    }
                    return <strong>{children}</strong>;
                  },
                }}
              >
                {preprocessArticle}
              </ReactMarkdown>
            </article>
            <div className="mt-12 flex items-center gap-4">
              <div className="h-px w-16 bg-border" />
              <div className="w-2 h-2 rounded-full bg-border" />
              <div className="h-px w-16 bg-border" />
            </div>
          </div>
        </section>
      )}

      {/* Section 2: Interactive Showcase (only if items with coordinates exist) */}
      {hasItemsWithCoordinates && (
        <InteractiveShowcase
          image={image}
          items={normalizedItems}
          isModal={isModal}
          scrollContainerRef={scrollContainerRef}
          activeIndex={activeIndex}
          onActiveIndexChange={onActiveIndexChange}
          renderImage={!hideImage}
        />
      )}

      {/* Section 3: Shop Grid (show if any items exist, even without coordinates) */}
      {hasItems && (
        <div>
          {itemsFromPost && image.postImages && image.postImages.length > 0 && (
            <div className="mx-auto max-w-6xl px-4 py-3 md:px-8">
              <p className="text-sm text-muted-foreground">
                Items from post: @{image.postImages[0].post.account}
              </p>
            </div>
          )}
          <ShopGrid items={normalizedItems} isModal={isModal} />
        </div>
      )}

      {/* Related Images Section - Always show if account is available */}
      {image.postImages?.[0]?.post?.account && (
        <RelatedImages
          currentImageId={image.id}
          account={image.postImages[0].post.account}
          isModal={isModal}
        />
      )}

      {/* Fallback: Show basic info if no items */}
      {!hasItems && (
        <div className="mx-auto max-w-4xl px-4 py-16 md:px-8">
          <div className="mb-8">
            <div className="mb-4 flex flex-wrap gap-2">
              {image.status && (
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium uppercase tracking-wide ${
                    image.status === "pending"
                      ? "bg-amber-100 text-amber-900 dark:bg-amber-900/40 dark:text-amber-100"
                      : image.status === "extracted"
                        ? "bg-emerald-100 text-emerald-900 dark:bg-emerald-900/40 dark:text-emerald-100"
                        : "bg-slate-100 text-slate-900 dark:bg-slate-800/80 dark:text-slate-100"
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
              Image ID:{" "}
              <code className="rounded bg-muted px-2 py-1 text-sm">
                {image.id}
              </code>
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
