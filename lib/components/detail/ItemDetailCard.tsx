"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import Markdown from "react-markdown";
import { ExternalLink } from "lucide-react";
import {
  extractKoreanPart,
  filterKoreanTags,
} from "@/lib/utils/locale";
import type { UiItem } from "./types";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

// Register GSAP ScrollTrigger plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type Props = {
  item: UiItem;
  index: number;
  onActivate: () => void;
  onDeactivate: () => void;
  isModal?: boolean;
};

/**
 * ItemDetailCard - Magazine-style item card
 */
export function ItemDetailCard({
  item,
  index,
  onActivate,
  onDeactivate,
  isModal = false,
}: Props) {
  const cardRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const formattedIndex = String(index + 1).padStart(2, "0");

  useGSAP(() => {
    if (!contentRef.current || isModal) return;

    gsap.fromTo(
      contentRef.current,
      { 
        y: 60, 
        opacity: 0,
        scale: 0.98 
      },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: cardRef.current,
          start: "top 85%",
          end: "top 50%",
          toggleActions: "play none none reverse",
        }
      }
    );
  }, { scope: cardRef });

  // Filter metadata tags to only show Korean ones (or strictly locale-matching)
  // This matches the project's strategy to prioritize Korean content
  // Note: We use raw metadata for specs below, so we don't necessarily need displayTags here
  // unless we want to filter them. For now, let's keep the spec logic simple.
  
  // Parse multi-language fields
  const displayBrand = item.brand
    ? extractKoreanPart(item.brand) || item.brand
    : null;
  const displayName = item.product_name
    ? extractKoreanPart(item.product_name) || item.product_name
    : null;
  const displayPrice = item.price
    ? extractKoreanPart(item.price, { splitByComma: false }) || item.price
    : null;
  // For description, use raw markdown content without extraction
  const displayDescription = item.description || null;

  // Parse metadata into key-value pairs if possible
  // Filter to only show Korean parts of metadata
  const displayMetadata = filterKoreanTags(item.metadata);
  
  const parsedMetadata = displayMetadata.map((tag) => {
    // Check for "Key: Value" pattern
    const match = tag.match(/^([^:]+):\s*(.+)$/);
    if (match) {
      return { key: match[1], value: match[2] };
    }
    return { key: null, value: tag };
  });

  return (
    <div
      ref={cardRef}
      data-item-index={index}
      className="group relative mb-12 md:mb-20 flex min-h-auto md:min-h-[50vh] flex-col justify-center py-6 md:py-12 lg:mb-24"
      onMouseEnter={onActivate}
      onMouseLeave={onDeactivate}
    >
      {/* Decorative Background Index */}
      <div
        className={`absolute z-0 select-none font-serif font-black leading-none text-foreground/[0.04] pointer-events-none transition-all duration-700 ${
          isModal
            ? "text-[8rem] md:text-[10rem] lg:text-[12rem] right-0 -top-10"
            : "text-[10rem] md:text-[15rem] lg:text-[20rem] -left-12 -top-10 md:-left-20 lg:-left-32"
        }`}
        aria-hidden="true"
      >
        {formattedIndex}
      </div>

      <div ref={contentRef} className="relative z-10 flex flex-col gap-6 md:gap-10">
        {/* Item Image - Layered Collage Style */}
        <div className="group/image relative w-full aspect-[4/3] md:aspect-video lg:aspect-[3/2] rounded-2xl overflow-visible">
          {/* Ambient Background Blur Layer */}
          <div className="absolute inset-4 z-0 bg-primary/5 blur-3xl rounded-full" />
          
          {/* Main Container with subtle border */}
          <div className="absolute inset-0 z-10 bg-muted/5 rounded-2xl border border-border/10 backdrop-blur-[2px] overflow-hidden">
             {/* Subtle scanline or texture effect if desired */}
          </div>

          {/* Floating Image Layer - Breaks boundaries slightly */}
          {item.imageUrl && (
            <div className="absolute inset-0 z-20 transition-transform duration-700 ease-out group-hover/image:scale-105 group-hover/image:-translate-y-2">
              <Image
                src={item.imageUrl}
                alt={item.product_name || `Item ${formattedIndex}`}
                fill
                className="object-contain p-4 md:p-8 drop-shadow-2xl filter brightness-[1.02]"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 80vw, 800px"
              />
            </div>
          )}
        </div>

        {/* Text Content - Overlapping Feel */}
        <div className="flex flex-col relative z-30 px-2">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div className="flex-1">
              {/* Brand & Index Label */}
              <div className="flex items-center gap-4 mb-4">
                <span className="font-serif italic text-xl md:text-2xl text-primary/40 leading-none shrink-0 border-b border-primary/20 pb-1">
                  {formattedIndex}
                </span>
                {displayBrand && (
                  <p className="font-sans text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground/60">
                    {displayBrand}
                  </p>
                )}
              </div>

              {/* Product Name */}
              <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl font-bold leading-tight tracking-tight text-foreground/90 max-w-[90%]">
                {displayName || `Item ${formattedIndex}`}
              </h2>
            </div>

            {/* Price */}
            {displayPrice && (
              <div className="flex flex-col items-start md:items-end">
                <span className="font-sans text-[9px] uppercase tracking-widest text-muted-foreground/40 mb-1">Price Reference</span>
                <p className="font-serif text-xl md:text-2xl font-medium text-foreground/80 whitespace-nowrap">
                  {displayPrice.split("|")[0].trim()}
                </p>
              </div>
            )}
          </div>

          <div className="h-px w-full bg-gradient-to-r from-border/60 via-border/20 to-transparent my-8 md:my-10" />

          {/* Description - Editorial Typography */}
          {displayDescription && (
            <div className="prose prose-md dark:prose-invert max-w-none font-serif text-muted-foreground/80 font-light [&>p]:leading-relaxed [&>p]:mb-6 [&>p]:text-lg">
              <Markdown>{displayDescription}</Markdown>
            </div>
          )}

          {/* Details / Metadata - Minimalist Technical Specs */}
          {parsedMetadata.length > 0 && (
            <div className="mt-8 pt-8 border-t border-border/20">
              <h5 className="mb-6 font-sans text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-primary/60">
                Technical Details
              </h5>

              <div className="flex flex-wrap gap-x-12 gap-y-6">
                {parsedMetadata.map((meta, i) => (
                  <div key={i} className="flex flex-col min-w-[120px]">
                    {meta.key ? (
                      <>
                        <span className="font-sans text-[9px] uppercase tracking-wider text-muted-foreground/40 mb-1.5">
                          {meta.key}
                        </span>
                        <span className="font-serif text-base text-foreground/80">
                          {meta.value}
                        </span>
                      </>
                    ) : (
                      <span className="font-serif text-base text-foreground/80">
                        {meta.value}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Source Data Footer - Editorialized Shop Links */}
          <div className="mt-12 pt-8 border-t border-border/20">
            <h5 className="mb-6 font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-primary/60">
              Shop the Look
            </h5>

            <div className="flex flex-col gap-6">
              {item.citations && item.citations.length > 0 ? (
                <div className="flex flex-col gap-4">
                  <div className="flex flex-wrap gap-x-8 gap-y-3">
                    {item.citations.map((citation, i) => {
                      let hostname = citation;
                      try {
                        hostname = new URL(citation).hostname.replace(
                          "www.",
                          ""
                        );
                      } catch (e) {
                        // Keep original string
                      }

                      return (
                        <a
                          key={i}
                          href={citation}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group/link flex items-center gap-2 py-1"
                        >
                          <span className="font-serif italic text-base text-foreground/60 group-hover/link:text-primary transition-all underline decoration-primary/20 underline-offset-4 decoration-1 group-hover/link:decoration-primary/60">
                            {hostname}
                          </span>
                          <ExternalLink className="w-3 h-3 text-muted-foreground/40 group-hover/link:text-primary transition-colors opacity-0 group-hover/link:opacity-100 -translate-x-2 group-hover/link:translate-x-0" />
                        </a>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <p className="font-serif text-sm italic text-muted-foreground/40">
                  Citations unavailable for this selection.
                </p>
              )}

              {/* ID Metadata - Subtle footnote */}
              {item.id && (
                <div className="mt-4 flex items-center gap-2 opacity-20 hover:opacity-100 transition-opacity">
                  <span className="font-mono text-[9px] uppercase tracking-tighter text-muted-foreground">
                    Ref. {String(item.id)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
