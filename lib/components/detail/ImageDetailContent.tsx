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
import { useMemo, useState, useEffect } from "react";
import { MetadataTags } from "./MetadataTags";
import { extractDominantColors, ColorResult } from "@/lib/utils/color";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

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

  // Extract primary category from metadata
  const category = useMemo(() => {
    if (!metadata) return "Editorial";
    const catTag = metadata.find(
      (tag) =>
        tag.includes("Closet") ||
        tag.includes("Style") ||
        tag.includes("Fashion")
    );
    return catTag || "Fashion Analysis";
  }, [metadata]);

  // Extract style markers from metadata
  const styleMarkers = useMemo(() => {
    if (!metadata) return [];
    // Filter out tags with colons (technical specs) and long ones
    return metadata
      .filter((tag) => !tag.includes(":") && tag.length < 15)
      .slice(0, 3);
  }, [metadata]);

  const [colors, setColors] = useState<ColorResult[]>([]);
  const [isColorLoading, setIsColorLoading] = useState(false);

  useEffect(() => {
    if (!image.image_url) return;

    const fetchColors = async () => {
      setIsColorLoading(true);
      try {
        // Simple client-side cache
        const cacheKey = `colors-${image.id}`;
        const cached = sessionStorage.getItem(cacheKey);
        if (cached) {
          setColors(JSON.parse(cached));
          setIsColorLoading(false);
          return;
        }

        const extracted = await extractDominantColors(image.image_url || "", 4);
        setColors(extracted);
        sessionStorage.setItem(cacheKey, JSON.stringify(extracted));
      } catch (err) {
        console.warn("Color extraction failed:", err);
      } finally {
        setIsColorLoading(false);
      }
    };

    fetchColors();
  }, [image.image_url, image.id]);

  useGSAP(() => {
    if (colors.length > 0) {
      gsap.fromTo(
        ".color-swatch",
        { scale: 0, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "back.out(1.7)",
        }
      );
    }
  }, [colors]);

  return (
    <div className="detail-content relative">
      {/* Decorative Vertical Typography - Shown on desktop (Full Page & Modal) */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 hidden lg:block pointer-events-none select-none">
        <span className="font-serif text-[10px] uppercase tracking-[1em] text-primary/5 writing-mode-vertical-rl rotate-180 opacity-50">
          Decoded Editorial Archive — {new Date(image.created_at).getFullYear()}
        </span>
      </div>

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
        <section
          className={`mx-auto px-6 ${isModal ? "max-w-5xl pt-12 pb-10" : "max-w-6xl pt-32 pb-24"}`}
        >
          <div
            className={`grid grid-cols-1 ${isModal ? "lg:grid-cols-11" : "lg:grid-cols-12"} gap-10 lg:gap-16 items-start`}
          >
            {/* Left Column: Metadata & Anchor (Desktop) / Top (Mobile) */}
            <div
              className={`${isModal ? "lg:col-span-4" : "lg:col-span-5"} flex flex-col items-center lg:items-start text-center lg:text-left`}
            >
              <div className={`${isModal ? "mb-8" : "mb-12"} w-full`}>
                <div
                  className={`flex flex-col gap-1 ${isModal ? "mb-6" : "mb-8"}`}
                >
                  <span className="font-sans text-[9px] md:text-[10px] uppercase tracking-[0.3em] text-primary/60 font-bold">
                    Editorial Analysis
                  </span>
                  <h4
                    className={`font-serif font-bold text-foreground ${isModal ? "text-xl md:text-2xl" : "text-3xl md:text-4xl"}`}
                  >
                    @{firstPost?.account || "System"}
                  </h4>
                </div>

                {/* Look Summary Box - More compact in modal */}
                <div
                  className={`border border-border/40 rounded-sm bg-muted/5 relative overflow-hidden ${isModal ? "p-5" : "p-8"}`}
                >
                  <div className="absolute top-0 right-0 p-3 opacity-[0.03] pointer-events-none">
                    <span
                      className={`font-serif font-black italic ${isModal ? "text-5xl" : "text-8xl"}`}
                    >
                      {String(image.id).slice(-2).toUpperCase()}
                    </span>
                  </div>

                  <div
                    className={`flex flex-col ${isModal ? "gap-4" : "gap-6"} relative z-10`}
                  >
                    <div className="flex flex-col gap-1">
                      <span className="font-sans text-[8px] md:text-[9px] uppercase tracking-widest text-muted-foreground/60">
                        Look Identity
                      </span>
                      <p
                        className={`font-serif text-foreground/80 italic ${isModal ? "text-sm md:text-base" : "text-lg"}`}
                      >
                        {category}
                      </p>
                    </div>

                    <div
                      className={`grid grid-cols-2 ${isModal ? "gap-4" : "gap-6"}`}
                    >
                      <div className="flex flex-col gap-1">
                        <span className="font-sans text-[8px] md:text-[9px] uppercase tracking-widest text-muted-foreground/60">
                          Items
                        </span>
                        <p
                          className={`font-serif text-foreground ${isModal ? "text-base md:text-lg" : "text-xl"}`}
                        >
                          {items.length.toString().padStart(2, "0")}
                        </p>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="font-sans text-[8px] md:text-[9px] uppercase tracking-widest text-muted-foreground/60">
                          Decoded
                        </span>
                        <p
                          className={`font-serif text-foreground ${isModal ? "text-[10px]" : "text-xs"}`}
                        >
                          {new Date(image.created_at)
                            .toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })
                            .toUpperCase()}
                        </p>
                      </div>
                    </div>

                    {!isModal && (
                      <div className="pt-6 border-t border-border/20">
                        <div className="flex flex-col gap-3">
                          <span className="font-sans text-[9px] uppercase tracking-widest text-muted-foreground/60">
                            Featured Labels
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {metadata?.slice(0, 5).map((tag, i) => (
                              <span
                                key={i}
                                className="font-serif text-[11px] italic text-primary/70"
                              >
                                #{tag.split(":").pop()?.trim()}
                                {i < metadata.slice(0, 5).length - 1 ? "," : ""}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Metadata Section (Simplified in modal) */}
              {metadata && (
                <div className={`${isModal ? "mb-8" : "mb-12"} w-full`}>
                  <MetadataTags tags={metadata} />
                </div>
              )}

              {/* Anchor Section - Always Visible */}
              <div className={`${isModal ? "mb-8" : "mb-12"} w-full`}>
                {anchor ? (
                  <div className="relative mb-10">
                    <span
                      className={`absolute -left-3 -top-6 font-serif text-primary/10 select-none ${isModal ? "text-4xl" : "text-8xl"}`}
                    >
                      &ldquo;
                    </span>
                    <p
                      className={`font-serif italic leading-tight text-foreground/90 ${isModal ? "text-lg md:text-xl" : "text-2xl md:text-3xl lg:text-4xl"}`}
                    >
                      {anchor}
                    </p>
                    <span
                      className={`absolute -right-3 -bottom-3 font-serif text-primary/10 select-none ${isModal ? "text-4xl" : "text-8xl"}`}
                    >
                      &rdquo;
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center lg:items-start gap-3 select-none opacity-40 hover:opacity-70 transition-opacity mb-10">
                    <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-muted-foreground border-b border-border pb-1">
                      Decoded Insight
                    </span>
                    <p className="font-serif text-lg italic text-muted-foreground">
                      This look, decoded.
                    </p>
                  </div>
                )}

                {/* Chromatic & Style Analysis Section */}
                <div
                  className={`mt-8 md:mt-12 pt-8 border-t border-border/20 ${isModal ? "text-center lg:text-left" : ""}`}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {/* Color Palette */}
                    <div className="flex flex-col">
                      <span className="font-sans text-[9px] uppercase tracking-[0.3em] text-primary/60 font-bold mb-6 block">
                        Chromatic Analysis
                      </span>

                      <div
                        className={`flex flex-wrap ${isModal ? "justify-center lg:justify-start" : "justify-start"} gap-5`}
                      >
                        {isColorLoading
                          ? Array.from({ length: 4 }).map((_, i) => (
                              <div
                                key={i}
                                className="flex flex-col gap-2 items-center lg:items-start animate-pulse"
                              >
                                <div className="w-8 h-8 rounded-full bg-muted" />
                                <div className="w-10 h-2 bg-muted rounded" />
                              </div>
                            ))
                          : colors.map((color, i) => (
                              <div
                                key={i}
                                className="color-swatch flex flex-col gap-2 items-center lg:items-start group cursor-default"
                              >
                                <div
                                  className={`rounded-full border border-border/20 shadow-inner transition-transform duration-300 group-hover:scale-110 ${isModal ? "w-8 h-8" : "w-10 h-10"}`}
                                  style={{ backgroundColor: color.hex }}
                                  title={color.hex}
                                />
                                <div className="flex flex-col gap-0.5">
                                  <span className="font-serif text-[10px] italic text-foreground/70">
                                    {color.name}
                                  </span>
                                  <span className="font-mono text-[8px] uppercase text-muted-foreground/50 tracking-tighter">
                                    {color.hex}
                                  </span>
                                </div>
                              </div>
                            ))}
                      </div>
                    </div>

                    {/* Style Markers */}
                    <div className="flex flex-col">
                      <span className="font-sans text-[9px] uppercase tracking-[0.3em] text-primary/60 font-bold mb-6 block">
                        Style Radar
                      </span>
                      <div
                        className={`flex flex-col gap-4 ${isModal ? "items-center lg:items-start" : "items-start"}`}
                      >
                        {styleMarkers.length > 0 ? (
                          styleMarkers.map((marker, i) => (
                            <div
                              key={i}
                              className="flex flex-col gap-1 w-full max-w-[150px]"
                            >
                              <div className="flex justify-between items-end mb-1">
                                <span className="font-serif text-[11px] italic text-foreground/80">
                                  {marker}
                                </span>
                                <span className="font-sans text-[8px] text-muted-foreground/40 uppercase">
                                  Strong
                                </span>
                              </div>
                              <div className="h-[1px] w-full bg-border/20 relative">
                                <div
                                  className="absolute inset-0 bg-primary/40"
                                  style={{ width: `${85 - i * 15}%` }}
                                />
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="font-serif text-[11px] italic text-muted-foreground/40">
                            Visual analysis ongoing
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Editor's Footnote */}
                <div
                  className={`mt-10 pt-6 border-t border-dashed border-border/20 ${isModal ? "text-center lg:text-left" : ""}`}
                >
                  <div className="flex flex-col gap-2">
                    <p className="font-serif text-[11px] italic text-muted-foreground/60 leading-relaxed">
                      &mdash; Tip:{" "}
                      {colors.length > 0
                        ? `The ${colors[0].name.toLowerCase()} base provides a perfect canvas for high-contrast layering.`
                        : "Focus on the silhouette balance to achieve this curated editorial look."}
                    </p>
                    <span className="font-sans text-[8px] uppercase tracking-[0.2em] text-muted-foreground/30">
                      Curated by Decoded Editorial Team
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Article (Desktop) / Bottom (Mobile) */}
            <div className={`${isModal ? "lg:col-span-7" : "lg:col-span-7"}`}>
              <div
                className={`flex flex-col items-center lg:items-start text-center lg:text-left ${isModal ? "mb-6" : "mb-8 md:mb-10"}`}
              >
                <div
                  className={`w-12 h-0.5 bg-primary/40 hidden lg:block ${isModal ? "mb-6" : "mb-8"}`}
                />
                <h3
                  id="about-this-look"
                  className={`font-serif font-medium tracking-tight leading-[1.0] text-foreground ${
                    isModal
                      ? "text-3xl md:text-4xl mb-6"
                      : "text-5xl md:text-7xl lg:text-8xl mb-8 md:mb-12"
                  }`}
                >
                  The Editorial
                </h3>
              </div>

              <article
                className={`prose dark:prose-invert font-serif leading-loose text-muted-foreground/90 max-w-none
                ${isModal ? "prose-base" : "prose-lg"}
                [&>p:first-of-type]:first-letter:font-serif 
                [&>p:first-of-type]:first-letter:font-bold 
                [&>p:first-of-type]:first-letter:mr-4 
                [&>p:first-of-type]:first-letter:float-left 
                [&>p:first-of-type]:first-letter:text-foreground
                [&>p:first-of-type]:first-letter:leading-[0.8]
                [&>p:first-of-type]:first-letter:mt-2
                ${isModal ? "[&>p:first-of-type]:first-letter:text-6xl" : "[&>p:first-of-type]:first-letter:text-8xl"}
                prose-blockquote:border-none
                prose-blockquote:italic
                prose-blockquote:font-serif
                prose-blockquote:text-foreground/80
                prose-blockquote:relative
                prose-blockquote:py-8
                prose-blockquote:my-12
                ${isModal ? "prose-blockquote:text-xl" : "prose-blockquote:text-2xl"}
                prose-blockquote:before:content-['']
                prose-blockquote:before:absolute
                prose-blockquote:before:top-0
                prose-blockquote:before:left-0
                prose-blockquote:before:w-16
                prose-blockquote:before:h-px
                prose-blockquote:before:bg-primary/20
                prose-blockquote:after:content-['']
                prose-blockquote:after:absolute
                prose-blockquote:after:bottom-0
                prose-blockquote:after:right-0
                prose-blockquote:after:w-16
                prose-blockquote:after:h-px
                prose-blockquote:after:bg-primary/20
              `}
              >
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

              <div className="mt-16 flex items-center justify-center lg:justify-start gap-4">
                <div className="h-px w-16 bg-border/40" />
                <div className="w-2 h-2 rounded-full bg-border/40" />
                <div className="h-px w-16 bg-border/40" />
              </div>
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
