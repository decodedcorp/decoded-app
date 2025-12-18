"use client";

import { RefObject } from "react";
import type { ImageDetail } from "@/lib/supabase/queries/images";
import { normalizeItem } from "./types";
import { HeroSection } from "./HeroSection";
import { InteractiveShowcase } from "./InteractiveShowcase";
import { ShopGrid } from "./ShopGrid";
import Link from "next/link";
import ReactMarkdown from "react-markdown";

type Props = {
  image: ImageDetail;
  isModal?: boolean;
  scrollContainerRef?: RefObject<HTMLElement>;
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
}: Props) {
  // Items are now pre-fetched via post.item_ids (if post_image exists)
  // Fallback to item.image_id if no post_image found
  const items = image.items || [];

  // Check if items were fetched via post (postImages exist)
  const itemsFromPost = image.postImages && image.postImages.length > 0;

  // Extract article from the first post
  const article = image.postImages?.[0]?.post?.article?.trim();

  // #region agent log
  fetch("http://127.0.0.1:7242/ingest/89712f27-6a22-414e-81e7-beea00d23671", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      location: "ImageDetailContent.tsx:25",
      message: "Processing items",
      data: { rawItemsCount: items.length, firstItem: items[0] },
      timestamp: Date.now(),
      sessionId: "debug-session",
      hypothesisId: "H2",
    }),
  }).catch(() => {});
  // #endregion

  // Normalize items with coordinates
  const normalizedItems = items.map((item) => normalizeItem(item));

  // Check if we have items (with or without coordinates)
  // Items without coordinates can still be displayed in ShopGrid
  const hasItems = normalizedItems.length > 0;
  const hasItemsWithCoordinates = normalizedItems.some(
    (item) => item.normalizedBox !== null
  );

  // #region agent log
  fetch("http://127.0.0.1:7242/ingest/89712f27-6a22-414e-81e7-beea00d23671", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      location: "ImageDetailContent.tsx:32",
      message: "Render condition check",
      data: {
        normalizedCount: normalizedItems.length,
        hasItems,
        sampleNormalizedBox: normalizedItems[0]?.normalizedBox,
      },
      timestamp: Date.now(),
      sessionId: "debug-session",
      hypothesisId: "H3",
    }),
  }).catch(() => {});
  // #endregion

  return (
    <div className="detail-content">
      {/* Section 1: Hero */}
      <HeroSection image={image} isModal={isModal} />

      {/* Featured In Section */}
      {(image.postImages?.length > 0 || image.posts?.length > 0) && (
        <div className="bg-muted/10 border-b border-border">
          <div className="mx-auto max-w-6xl px-5 py-6 flex items-center gap-4 text-sm text-muted-foreground overflow-x-auto">
            <span className="font-serif italic font-medium shrink-0">
              Featured in:
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
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-background border border-border/50 shadow-sm shrink-0 hover:bg-background/80 hover:shadow-md transition-all cursor-pointer"
                      title={`Connected on ${new Date(postImage.created_at).toLocaleDateString()}`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/80" />
                      @{postImage.post.account}
                    </Link>
                  ))
              : image.posts?.map((post) => (
                  <Link
                    key={post.id}
                    href={`/posts/${post.id}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-background border border-border/50 shadow-sm shrink-0 hover:bg-background/80 hover:shadow-md transition-all cursor-pointer"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/80" />
                    @{post.account}
                  </Link>
                ))}
          </div>
        </div>
      )}

      {/* About this Look Section */}
      {article && (
        <section className="mx-auto max-w-6xl px-5 py-8 border-b border-border">
          <h3
            id="about-this-look"
            className="text-lg font-serif font-medium mb-4"
          >
            About this Look
          </h3>
          <article className="prose prose-sm dark:prose-invert w-full max-w-none break-words text-muted-foreground leading-relaxed">
            <ReactMarkdown>{article}</ReactMarkdown>
          </article>
        </section>
      )}

      {/* Section 2: Interactive Showcase (only if items with coordinates exist) */}
      {hasItemsWithCoordinates && (
        <InteractiveShowcase
          image={image}
          items={normalizedItems}
          isModal={isModal}
          scrollContainerRef={scrollContainerRef}
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
          <ShopGrid items={normalizedItems} />
        </div>
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
