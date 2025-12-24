"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ExternalLink, ChevronDown, ChevronUp } from "lucide-react";
import {
  filterKoreanTags,
  extractKoreanPart,
  isKoreanText,
} from "@/lib/utils/locale";
import type { UiItem } from "./types";
import { AnimatePresence, motion } from "framer-motion";

type Props = {
  item: UiItem;
  index: number;
  onActivate: () => void;
  onDeactivate: () => void;
};

/**
 * ItemDetailCard - Magazine-style item card
 *
 * Design:
 * - Large decorative index number (01, 02...)
 * - Elegant serif typography
 * - Refined neutral colors
 * - Layered layout for editorial feel
 */
export function ItemDetailCard({
  item,
  index,
  onActivate,
  onDeactivate,
}: Props) {
  const cardRef = useRef<HTMLDivElement>(null);
  const formattedIndex = String(index + 1).padStart(2, "0");
  const [sourcesExpanded, setSourcesExpanded] = useState(false);
  const [showSpecs, setShowSpecs] = useState(false);

  // Filter metadata tags to only show Korean ones (or strictly locale-matching)
  // This matches the project's strategy to prioritize Korean content
  const displayTags = filterKoreanTags(item.metadata);

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
  // For description, disable comma splitting to avoid breaking sentences
  const displayDescription = item.description
    ? extractKoreanPart(item.description, { splitByComma: false }) ||
      item.description
    : null;

  // Parse metadata into key-value pairs if possible
  const parsedMetadata = displayTags.map((tag) => {
    // Check for "Key: Value" pattern (allowing for Korean colons if any, though usually standard colon)
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
      className="group relative mb-16 md:mb-24 flex min-h-auto md:min-h-[60vh] flex-col justify-center py-8 md:py-16 lg:mb-32"
      onMouseEnter={onActivate}
      onMouseLeave={onDeactivate}
    >
      {/* Decorative Background Index */}
      <div
        className="absolute -left-6 -top-4 z-0 select-none font-serif text-[6rem] md:text-[8rem] lg:text-[12rem] font-bold leading-none text-muted/20 md:-left-12 lg:-left-20"
        aria-hidden="true"
      >
        {formattedIndex}
      </div>

      <div className="relative z-10 flex flex-col lg:flex-row gap-6 lg:gap-12">
        {/* Text Content */}
        <div className="flex-1 order-2 lg:order-1">
          {/* Brand Label */}
          {displayBrand && (
            <p className="mb-2 md:mb-4 font-sans text-xs md:text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
              {displayBrand}
            </p>
          )}

          {/* Product Name */}
          <h2 className="mb-4 md:mb-6 font-serif text-2xl md:text-4xl lg:text-5xl font-bold leading-tight tracking-tight text-foreground">
            {displayName || `Item ${formattedIndex}`}
          </h2>

          {/* Price & Details Row */}
          <div className="flex items-center gap-4 md:gap-6">
            {displayPrice && (
              <p className="font-sans text-xl md:text-2xl font-light text-foreground/90 lg:text-3xl">
                {displayPrice.split('|')[0].trim()}
              </p>
            )}

            <div className="h-px flex-1 bg-border" />
          </div>

          {/* Description - Refined Typography */}
          {displayDescription && (
            <div className="mt-6 md:mt-8 border-l-2 border-primary/20 pl-4 md:pl-6">
              <p className="font-serif text-base md:text-lg leading-relaxed text-muted-foreground whitespace-pre-wrap font-light">
                {displayDescription}
              </p>
            </div>
          )}

          {/* Details / Metadata - Collapsible Technical Specs */}
          {parsedMetadata.length > 0 && (
            <div className="mt-8 md:mt-10">
              <button
                onClick={() => setShowSpecs(!showSpecs)}
                className="flex items-center gap-2 group/specs focus:outline-none"
                aria-expanded={showSpecs}
              >
                <span className="font-sans text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground/80 group-hover/specs:text-foreground transition-colors">
                  Technical Specs
                </span>
                {showSpecs ? (
                  <ChevronUp className="w-3 h-3 text-muted-foreground group-hover/specs:text-foreground" />
                ) : (
                  <ChevronDown className="w-3 h-3 text-muted-foreground group-hover/specs:text-foreground" />
                )}
              </button>

              <AnimatePresence>
                {showSpecs && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                      {parsedMetadata.map((meta, i) => (
                        <div
                          key={i}
                          className="flex flex-col border-b border-border/40 pb-2 last:border-0"
                        >
                          {meta.key ? (
                            <>
                              <span className="font-sans text-[9px] md:text-[10px] uppercase tracking-wider text-muted-foreground mb-0.5">
                                {meta.key}
                              </span>
                              <span className="font-serif text-sm md:text-base text-foreground">
                                {meta.value}
                              </span>
                            </>
                          ) : (
                            <span className="font-serif text-sm md:text-base text-foreground">
                              {meta.value}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Source Data Footer - Grouped Citations & ID */}
          <div className="mt-12 md:mt-16 pt-6 border-t border-border/30">
            <h5 className="mb-4 font-sans text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground/40">
              Source Data
            </h5>

            <div className="flex flex-col gap-4">
              {/* Citations */}
              {item.citations && item.citations.length > 0 ? (
                <div className="flex flex-col gap-3">
                  <div className="flex flex-wrap gap-2 md:gap-3">
                    {item.citations
                      .slice(0, sourcesExpanded ? undefined : 3)
                      .map((citation, i) => {
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
                            className="group/link flex items-center gap-1.5 px-2 py-1 md:px-3 md:py-1.5 rounded-full bg-muted/20 hover:bg-muted/40 transition-colors border border-border/30 max-w-full"
                          >
                            <span className="font-sans text-[10px] md:text-xs font-medium text-muted-foreground group-hover/link:text-foreground truncate max-w-[120px] md:max-w-[150px]">
                              {hostname}
                            </span>
                            <ExternalLink className="w-2.5 h-2.5 md:w-3 md:h-3 text-muted-foreground/60 group-hover/link:text-foreground transition-colors shrink-0" />
                          </a>
                        );
                      })}
                    {!sourcesExpanded && item.citations.length > 3 && (
                      <button
                        onClick={() => setSourcesExpanded(true)}
                        className="px-2 py-1 md:px-3 md:py-1.5 rounded-full bg-transparent hover:bg-muted/20 transition-colors border border-dashed border-border/50 text-[10px] md:text-xs font-medium text-muted-foreground/70"
                      >
                        +{item.citations.length - 3} more
                      </button>
                    )}
                    {sourcesExpanded && item.citations.length > 3 && (
                      <button
                        onClick={() => setSourcesExpanded(false)}
                        className="px-2 py-1 md:px-3 md:py-1.5 rounded-full bg-transparent hover:bg-muted/20 transition-colors border border-dashed border-border/50 text-[10px] md:text-xs font-medium text-muted-foreground/70"
                      >
                        Show Less
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <p className="font-sans text-[10px] italic text-muted-foreground/40">
                  No citation sources available.
                </p>
              )}

              {/* ID */}
              {item.id && (
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[9px] text-muted-foreground/30">
                    ID: {String(item.id)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Item Image */}
        {item.imageUrl && (
          <div className="relative w-full aspect-square lg:w-64 lg:shrink-0 bg-muted rounded-lg overflow-hidden order-1 lg:order-2 mb-6 lg:mb-0">
            <Image
              src={item.imageUrl}
              alt={item.product_name || `Item ${formattedIndex}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 256px"
            />
          </div>
        )}
      </div>
    </div>
  );
}
