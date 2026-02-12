"use client";

import { useInfinitePosts } from "@/lib/hooks/usePosts";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { ChevronDown, ChevronUp } from "lucide-react";

// Register GSAP ScrollTrigger plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type Props = {
  currentPostId: string;
  account: string;
  isModal?: boolean;
};

export function RelatedImages({
  currentPostId,
  account,
  isModal = false,
}: Props) {
  const { data: postsData, isLoading } = useInfinitePosts({
    perPage: 12,
    artistName: account,
  });

  const sectionRef = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState(false);

  // Flatten and filter out current post
  const allPosts = postsData?.pages.flatMap((page) => page.items) ?? [];
  const posts = allPosts.filter((p) => p.id !== currentPostId);

  // Initial visible count - show 6-9 items
  const INITIAL_COUNT = 9;
  const visiblePosts = expanded ? posts : posts?.slice(0, INITIAL_COUNT);
  const hasMore = posts && posts.length > INITIAL_COUNT;

  useGSAP(
    () => {
      // Skip GSAP animations in modal to avoid ScrollTrigger issues
      if (
        isModal ||
        !sectionRef.current ||
        !visiblePosts ||
        visiblePosts.length === 0
      )
        return;

      const cards = gsap.utils.toArray<HTMLElement>(
        sectionRef.current.querySelectorAll(".related-card")
      );

      // If expanding, only animate the new ones to avoid re-animating everything
      const startIndex = expanded ? INITIAL_COUNT : 0;
      const cardsToAnimate = cards.slice(startIndex);

      if (cardsToAnimate.length > 0) {
        gsap.fromTo(
          cardsToAnimate,
          {
            y: 30,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.05,
            ease: "power2.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }
    },
    { scope: sectionRef, dependencies: [visiblePosts, expanded, isModal] }
  );

  if (isLoading) {
    return (
      <section
        className={`py-12 md:py-16 ${
          isModal ? "px-4 md:px-6" : "px-4 md:px-6"
        }`}
      >
        <div className={`mx-auto max-w-6xl`}>
          <div className="text-center mb-6">
            <div className="h-8 w-48 bg-muted rounded mx-auto animate-pulse" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="aspect-[4/5] bg-muted animate-pulse rounded-lg"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <section
        className={`py-12 md:py-16 ${
          isModal ? "px-4 md:px-6" : "px-4 md:px-6"
        }`}
      >
        <div className="mx-auto max-w-6xl">
          <h2 className="text-2xl font-serif mb-6">More from this look</h2>
          <p className="text-sm text-muted-foreground text-center py-12">
            No related content yet
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      className={`py-12 md:py-16 ${isModal ? "px-4 md:px-6" : "px-4 md:px-6"}`}
    >
      <div ref={sectionRef} className="mx-auto max-w-6xl">
        <h2 className="text-2xl font-serif mb-6">More from this look</h2>
        <p className="text-sm text-muted-foreground mb-6">From @{account}</p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 mb-8">
          {visiblePosts?.map((post) => {
            const CardWrapper = isModal ? "a" : Link;
            const cardProps = isModal
              ? { href: `/posts/${post.id}` }
              : { href: `/posts/${post.id}` };

            return (
              <CardWrapper
                key={post.id}
                {...cardProps}
                className="related-card group block relative aspect-[4/5] overflow-hidden rounded-lg bg-muted"
              >
                {post.image_url ? (
                  <Image
                    src={post.image_url}
                    alt={`Post by @${account}`}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 33vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-muted-foreground text-xs">
                      No Image
                    </span>
                  </div>
                )}

                {/* Overlay with account name on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-3 left-3 text-white text-sm font-medium">
                    @{account}
                  </div>
                </div>
              </CardWrapper>
            );
          })}
        </div>

        {/* View all / Show less button */}
        {hasMore && (
          <div className="flex justify-center">
            <button
              onClick={() => setExpanded(!expanded)}
              className="group flex items-center gap-2 px-8 py-3 border border-border bg-background hover:bg-foreground hover:text-background transition-all duration-300 text-xs uppercase tracking-widest rounded-sm"
            >
              {expanded ? (
                <>
                  Show Less <ChevronUp className="w-4 h-4" />
                </>
              ) : (
                <>
                  View All <ChevronDown className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
