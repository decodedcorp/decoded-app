"use client";

import type { PostDetail } from "@/lib/supabase/queries/posts";
import { spotToItemRow, normalizeItem } from "./types";
import { ShopGrid } from "./ShopGrid";
import { ArticleContent } from "./ArticleContent";
import { Heading, Text } from "@/lib/design-system";
import { Package } from "lucide-react";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

// Register GSAP ScrollTrigger plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type Props = {
  postDetail: PostDetail;
};

/**
 * Content component for post detail view
 *
 * Redesigned to match decoded.pen Image Detail editorial quality.
 *
 * Sections:
 * 1. Hero Section - Full-bleed image with gradient overlay, account badge, title
 * 2. Tags + Article - Metadata tags in pills + magazine-style drop cap article
 * 3. Spot Solutions - "Decoded Items" header with ShopGrid carousel
 * 4. Empty State - Design system empty state when no items
 */
export function PostDetailContent({ postDetail }: Props) {
  const { post, spots, solutions } = postDetail;

  const heroRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);

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

  // Formatted date
  const formattedDate = post.created_at
    ? new Date(post.created_at).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;

  // Hero title
  const heroTitle = post.media_title || "Post Details";

  // Ken Burns + parallax animations (matching HeroSection pattern)
  useGSAP(() => {
    if (!heroRef.current || !imageRef.current || !titleRef.current) return;

    const ctx = gsap.context(() => {
      // Entrance Ken Burns: scale from 1.15 to 1.0
      gsap.fromTo(
        imageRef.current,
        { scale: 1.15 },
        {
          scale: 1.0,
          duration: 2,
          ease: "power2.out",
        }
      );

      // Title reveal animation
      gsap.fromTo(
        titleRef.current,
        { y: "60%", opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.5,
          delay: 0.5,
          ease: "expo.out",
        }
      );

      // Parallax on scroll (full-page only, not modal)
      gsap.to(imageRef.current, {
        y: 100,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      // Title fade-out on scroll
      gsap.to(titleRef.current, {
        opacity: 0,
        y: -50,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "30% top",
          scrub: true,
        },
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="detail-content">
      {/* ============================================================ */}
      {/* Section 1: Hero Section (matching decoded.pen Image Detail)  */}
      {/* ============================================================ */}
      <div
        ref={heroRef}
        className="relative w-full overflow-hidden h-[426px] md:h-[60vh] md:max-h-[600px]"
      >
        {/* Hero Image */}
        {hasImage ? (
          <img
            ref={imageRef}
            src={post.image_url!}
            alt={heroTitle}
            className="h-full w-full object-cover will-change-transform"
            loading="eager"
          />
        ) : (
          <div className="h-full w-full bg-muted flex items-center justify-center">
            <span className="font-serif text-6xl text-muted-foreground/20 select-none">
              D
            </span>
          </div>
        )}

        {/* Gradient overlay (matching decoded.pen heroImageOverlay) */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

        {/* Spot markers on hero image */}
        {spots.map((spot) => (
          <div
            key={spot.id}
            className="absolute w-6 h-6 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white/80 bg-emerald-500/70 shadow-lg cursor-pointer hover:scale-125 transition-transform z-10"
            style={{
              left: `${parseFloat(spot.position_left)}%`,
              top: `${parseFloat(spot.position_top)}%`,
            }}
            title={
              solutions.find((s) => s.spot_id === spot.id)?.title || "Item"
            }
          >
            <span className="absolute inset-0 rounded-full animate-ping bg-emerald-400/30" />
          </div>
        ))}

        {/* Hero bottom content (justify-end pattern) */}
        <div
          ref={titleRef}
          className="absolute inset-0 flex flex-col justify-end px-6 pb-8 md:px-10 md:pb-12"
        >
          {/* Account badge pill */}
          <div className="mb-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-sm font-medium text-white font-sans">
                @{displayName}
              </span>
            </div>
          </div>

          {/* Hero title */}
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight mb-4 max-w-3xl">
            {heroTitle}
          </h1>

          {/* Hero meta row */}
          <div className="flex items-center gap-2 text-sm font-sans text-white/60">
            <span>
              {solutions.length}{" "}
              {solutions.length === 1 ? "item" : "items"} featured
            </span>
            {formattedDate && (
              <>
                <span className="w-1 h-1 rounded-full bg-white/40" />
                <span>Posted: {formattedDate}</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* Section 2: Tags + Article                                     */}
      {/* ============================================================ */}
      <div className="px-6 py-8 md:px-10 space-y-6">
        {/* Tags row */}
        {metadataTags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {metadataTags.map((tag, index) => (
              <span
                key={`${tag}-${index}`}
                className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium font-sans bg-card text-muted-foreground border border-border/40"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Article content with magazine-style drop cap */}
        {post.context && <ArticleContent content={post.context} />}
      </div>

      {/* ============================================================ */}
      {/* Section 3: Spot Solutions                                     */}
      {/* ============================================================ */}
      {hasItems ? (
        <div className="bg-card/50">
          {/* Section header matching decoded.pen pattern */}
          <div className="mx-auto max-w-7xl px-6 pt-10 md:px-8 md:pt-14">
            <div className="flex items-end justify-between mb-2">
              <div className="flex flex-col gap-1.5">
                <span className="font-sans text-[9px] font-semibold uppercase tracking-[3px] text-muted-foreground">
                  SPOT SOLUTIONS
                </span>
                <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground">
                  Decoded Items
                </h2>
              </div>
              {normalizedItems.length > 3 && (
                <span className="text-sm font-medium font-sans text-primary cursor-pointer hover:underline">
                  View All
                </span>
              )}
            </div>
          </div>

          {/* ShopGrid carousel/grid */}
          <ShopGrid items={normalizedItems} />
        </div>
      ) : (
        /* ============================================================ */
        /* Section 4: Empty State                                       */
        /* ============================================================ */
        <div className="flex flex-col items-center justify-center py-16 text-center px-6">
          <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-4">
            <Package className="h-10 w-10 text-muted-foreground" />
          </div>

          <Heading variant="h3" className="mb-2">
            No Items Yet
          </Heading>
          <Text textColor="muted" className="max-w-md">
            This post hasn&apos;t been decoded yet. Items will appear here
            once they&apos;re identified and matched.
          </Text>
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
