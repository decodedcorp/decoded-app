"use client";

import type { PostDetail } from "@/lib/supabase/queries/posts";
import { ArticleContent } from "./ArticleContent";
import { DecodedItemsSection } from "./DecodedItemsSection";
import { GallerySection } from "./GallerySection";
import { ShopCarouselSection } from "./ShopCarouselSection";
import { RelatedLooksSection } from "./RelatedLooksSection";
import { SocialActions } from "@/lib/components/shared/SocialActions";
import { CommentSection } from "@/lib/components/shared/CommentSection";
import { AccountAvatar } from "@/lib/components/shared/AccountAvatar";
import { FollowButton } from "@/lib/components/shared/FollowButton";
import { useInfinitePosts } from "@/lib/hooks/usePosts";
import { Heading, Text } from "@/lib/design-system";
import { Package } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

// Register GSAP ScrollTrigger plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type Props = {
  postDetail: PostDetail;
  isModal?: boolean;
  scrollContainerRef?: React.RefObject<HTMLElement>;
};

/**
 * Content component for post detail view
 *
 * Redesigned to match decoded.pen Image Detail editorial quality.
 *
 * Sections:
 * 1. Hero Section - Full-bleed image with gradient overlay, account badge, title
 * 2. Tags + Article - Metadata tags in pills + magazine-style drop cap article
 * 3. Decoded Items - Selectable item list with expandable detail card
 * 4. Gallery - "More from this Look" image grid
 * 5. Shop the Look - Product carousel
 * 6. Related Looks - Masonry grid of related posts
 * 7. Empty State - Design system empty state when no items
 */
export function PostDetailContent({ postDetail, isModal = false, scrollContainerRef }: Props) {
  const { post, spots, solutions } = postDetail;

  const heroRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);

  // State for tracking image dimensions for spot positioning
  const [naturalSize, setNaturalSize] = useState<{width: number; height: number} | null>(null);
  const [containerSize, setContainerSize] = useState<{width: number; height: number} | null>(null);

  const hasItems = spots.length > 0 || solutions.length > 0;
  const hasImage = !!post.image_url;

  // Display name: prefer artist_name, fallback to group_name
  const displayName = post.artist_name || post.group_name || "Unknown";

  // Fetch related posts from same artist for Gallery + Related Looks
  const { data: relatedPostsData } = useInfinitePosts({
    perPage: 12,
    artistName: displayName,
  });

  // Flatten and filter out current post
  const allRelatedPosts =
    relatedPostsData?.pages.flatMap((page) => page.items) ?? [];
  const relatedPosts = allRelatedPosts.filter((p) => p.id !== post.id);

  // Derive gallery and related look images (map to expected format)
  const galleryImages = relatedPosts.slice(0, 5).map((p) => ({
    id: p.id,
    image_url: p.image_url,
  }));
  const relatedLookImages = relatedPosts.slice(5).map((p) => ({
    id: p.id,
    image_url: p.image_url,
  }));

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

  // Track container size with ResizeObserver
  useEffect(() => {
    if (!heroRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        setContainerSize({ width, height });
      }
    });

    resizeObserver.observe(heroRef.current);

    return () => resizeObserver.disconnect();
  }, []);

  // Calculate the actual displayed image rect when using object-contain
  const getContainedImageRect = () => {
    if (!naturalSize || !containerSize) return null;
    const containerAspect = containerSize.width / containerSize.height;
    const imageAspect = naturalSize.width / naturalSize.height;

    let width, height, left, top;
    if (imageAspect > containerAspect) {
      // Image is wider - fits width, letterboxed top/bottom
      width = containerSize.width;
      height = width / imageAspect;
      left = 0;
      top = (containerSize.height - height) / 2;
    } else {
      // Image is taller - fits height, letterboxed left/right
      height = containerSize.height;
      width = height * imageAspect;
      top = 0;
      left = (containerSize.width - width) / 2;
    }
    return { width, height, left, top };
  };

  // Ken Burns + parallax animations (matching HeroSection pattern)
  useGSAP(() => {
    if (!heroRef.current || !imageRef.current || !titleRef.current) return;

    const ctx = gsap.context(() => {
      // Entrance Ken Burns: scale from 1.15 to 1.0 (always)
      gsap.fromTo(
        imageRef.current,
        { scale: 1.15 },
        {
          scale: 1.0,
          duration: 2,
          ease: "power2.out",
        }
      );

      // Title reveal animation (always)
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

      // Parallax on scroll - only when NOT in modal
      if (!isModal) {
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
      }
    }, heroRef);

    return () => ctx.revert();
  }, [isModal]);

  return (
    <div className="detail-content">
      {/* ============================================================ */}
      {/* Section 1: Hero Section (matching decoded.pen Image Detail)  */}
      {/* ============================================================ */}
      <div
        ref={heroRef}
        className={`relative w-full overflow-hidden bg-black ${
          isModal
            ? "h-[300px] md:h-[45vh]"
            : "h-[426px] md:h-[60vh] md:max-h-[600px]"
        }`}
      >
        {/* Hero Image */}
        {hasImage ? (
          <img
            ref={imageRef}
            src={post.image_url!}
            alt={heroTitle}
            className="h-full w-full object-contain will-change-transform"
            loading="eager"
            onLoad={(e) => {
              setNaturalSize({
                width: e.currentTarget.naturalWidth,
                height: e.currentTarget.naturalHeight,
              });
            }}
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
        {spots.map((spot) => {
          const imageRect = getContainedImageRect();
          const spotLeft = imageRect
            ? imageRect.left + (parseFloat(spot.position_left) / 100) * imageRect.width
            : undefined;
          const spotTop = imageRect
            ? imageRect.top + (parseFloat(spot.position_top) / 100) * imageRect.height
            : undefined;

          return (
            <div
              key={spot.id}
              className="absolute w-6 h-6 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white/80 bg-emerald-500/70 shadow-lg cursor-pointer hover:scale-125 transition-transform z-20"
              style={
                imageRect && spotLeft !== undefined && spotTop !== undefined
                  ? { left: `${spotLeft}px`, top: `${spotTop}px` }
                  : {
                      left: `${parseFloat(spot.position_left)}%`,
                      top: `${parseFloat(spot.position_top)}%`,
                    }
              }
              title={
                solutions.find((s) => s.spot_id === spot.id)?.title || "Item"
              }
            >
              <span className="absolute inset-0 rounded-full animate-ping bg-emerald-400/30" />
            </div>
          );
        })}

        {/* Hero bottom content (justify-end pattern) */}
        <div
          ref={titleRef}
          className="absolute inset-0 flex flex-col justify-end px-6 pb-8 md:px-10 md:pb-12 z-10"
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
              {solutions.length} {solutions.length === 1 ? "item" : "items"}{" "}
              featured
            </span>
            {formattedDate && (
              <>
                <span className="w-1 h-1 rounded-full bg-white/40" />
                <span>Posted: {formattedDate}</span>
              </>
            )}
          </div>

          {/* Follow button */}
          <div className="mt-4">
            <FollowButton size="md" />
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
      {/* Section 3: Decoded Items                                      */}
      {/* ============================================================ */}
      {hasItems && <DecodedItemsSection spots={spots} solutions={solutions} />}

      {/* ============================================================ */}
      {/* Section 4: Gallery                                            */}
      {/* ============================================================ */}
      {galleryImages.length > 0 && <GallerySection images={galleryImages} />}

      {/* ============================================================ */}
      {/* Section 5: Shop the Look Carousel                             */}
      {/* ============================================================ */}
      {solutions.length > 0 && <ShopCarouselSection solutions={solutions} />}

      {/* ============================================================ */}
      {/* Section 6: Related Looks                                      */}
      {/* ============================================================ */}
      {relatedLookImages.length > 0 && (
        <RelatedLooksSection
          images={relatedLookImages}
          displayName={displayName}
        />
      )}

      {/* ============================================================ */}
      {/* Social Actions & Comments                                     */}
      {/* ============================================================ */}
      <div className="px-6 py-6 md:px-10 border-t border-border">
        <div className="flex items-center gap-3 mb-4">
          <AccountAvatar name={displayName} size="md" />
          <div className="flex-1">
            <p className="text-sm font-medium">@{displayName}</p>
            <p className="text-xs text-muted-foreground">
              {solutions.length} items decoded
            </p>
          </div>
          <FollowButton size="sm" />
        </div>
        <SocialActions likeCount={128} commentCount={3} showComment />
      </div>
      <div className="px-6 py-8 md:px-10 border-t border-border">
        <CommentSection />
      </div>

      {/* ============================================================ */}
      {/* Empty State (when no items at all)                            */}
      {/* ============================================================ */}
      {!hasItems && (
        <div className="flex flex-col items-center justify-center py-16 text-center px-6">
          <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-4">
            <Package className="h-10 w-10 text-muted-foreground" />
          </div>

          <Heading variant="h3" className="mb-2">
            No Items Yet
          </Heading>
          <Text textColor="muted" className="max-w-md">
            This post hasn&apos;t been decoded yet. Items will appear here once
            they&apos;re identified and matched.
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
