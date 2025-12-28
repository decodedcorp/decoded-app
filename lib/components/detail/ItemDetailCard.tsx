"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Markdown from "react-markdown";
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
  isModal?: boolean;
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
  isModal = false,
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
  // For description, use raw markdown content without extraction
  const displayDescription = item.description || null;

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
      className="group relative mb-12 md:mb-20 flex min-h-auto md:min-h-[50vh] flex-col justify-center py-6 md:py-12 lg:mb-24"
      onMouseEnter={onActivate}
      onMouseLeave={onDeactivate}
    >
      {/* Decorative Background Index */}
      <div
        className={`absolute z-0 select-none font-serif font-black leading-none text-foreground/[0.05] pointer-events-none transition-all duration-500 ${
          isModal
            ? "text-[6rem] md:text-[8rem] lg:text-[10rem] right-4 top-4"
            : "text-[5rem] md:text-[8rem] lg:text-[11rem] -left-8 -top-6 md:-left-14 lg:-left-20"
        }`}
        aria-hidden="true"
      >
        {formattedIndex}
      </div>

      <div className="relative z-10 flex flex-col gap-6 md:gap-8">
        {/* Item Image - Full Width on Mobile, Compact on Desktop */}
        <div className="w-full relative aspect-[4/3] md:aspect-video lg:aspect-[2/1] bg-muted/5 rounded-xl overflow-hidden border border-border/10 shadow-sm">
          {/* Ambient Background (Blurred) */}
          <div className="absolute inset-0 z-0">
            <Image
              src={item.imageUrl || ""}
              alt=""
              fill
              className="object-cover blur-3xl opacity-20 scale-110"
              aria-hidden="true"
            />
          </div>

          {/* Main Image (Contained) */}
          {item.imageUrl && (
            <Image
              src={item.imageUrl}
              alt={item.product_name || `Item ${formattedIndex}`}
              fill
              className="object-contain relative z-10 p-4 md:p-6"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 80vw, 800px"
            />
          )}
        </div>

        {/* Text Content */}
        <div className="flex flex-col">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div className="flex-1">
              {/* Brand & Index Label */}
              <div className="flex items-baseline gap-3 mb-2">
                <span className="font-serif italic text-base md:text-lg text-muted-foreground/50 leading-none shrink-0">
                  {formattedIndex}
                </span>
                {displayBrand && (
                  <p className="font-sans text-[10px] md:text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                    {displayBrand}
                  </p>
                )}
              </div>

              {/* Product Name */}
              <h2 className="font-serif text-xl md:text-2xl lg:text-3xl font-bold leading-tight tracking-tight text-foreground">
                {displayName || `Item ${formattedIndex}`}
              </h2>
            </div>

            {/* Price */}
            {displayPrice && (
              <p className="font-sans text-lg md:text-xl font-light text-foreground/90 whitespace-nowrap pt-1">
                {displayPrice.split("|")[0].trim()}
              </p>
            )}
          </div>

          <div className="h-px w-full bg-border/50 my-4 md:my-6" />

          {/* Description - Refined Typography with Markdown Support */}
          {displayDescription && (
            <div className="prose prose-sm dark:prose-invert max-w-none font-serif text-muted-foreground font-light [&>p]:leading-relaxed [&>p]:mb-4 [&>ul]:list-disc [&>ul]:pl-4 [&>ol]:list-decimal [&>ol]:pl-4">
              <Markdown>{displayDescription}</Markdown>
            </div>
          )}

          {/* Details / Metadata - Collapsible Technical Specs */}
          {parsedMetadata.length > 0 && (
            <div className="mt-6 md:mt-8 pt-6 border-t border-border/30">
              <h5 className="mb-4 font-sans text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground/80">
                Technical Specs
              </h5>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                {/* Always show first 2 items */}
                {parsedMetadata.slice(0, 2).map((meta, i) => (
                  <div
                    key={i}
                    className="flex flex-col border-b border-border/40 pb-2 last:border-0 md:last:border-b"
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

              {/* Collapsible remaining items */}
              {parsedMetadata.length > 2 && (
                <>
                  <AnimatePresence>
                    {showSpecs && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 pt-3">
                          {parsedMetadata.slice(2).map((meta, i) => (
                            <div
                              key={i + 2}
                              className="flex flex-col border-b border-border/40 pb-2 last:border-0 md:last:border-b"
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

                  <button
                    onClick={() => setShowSpecs(!showSpecs)}
                    className="mt-4 flex items-center gap-2 group/specs focus:outline-none"
                    aria-expanded={showSpecs}
                  >
                    <span className="font-sans text-[9px] font-bold uppercase tracking-[0.1em] text-muted-foreground/70 group-hover/specs:text-foreground transition-colors">
                      {showSpecs
                        ? "Show Less"
                        : `+ ${parsedMetadata.length - 2} More Specs`}
                    </span>
                    {showSpecs ? (
                      <ChevronUp className="w-3 h-3 text-muted-foreground group-hover/specs:text-foreground" />
                    ) : (
                      <ChevronDown className="w-3 h-3 text-muted-foreground group-hover/specs:text-foreground" />
                    )}
                  </button>
                </>
              )}
            </div>
          )}

          {/* Source Data Footer - Grouped Citations & ID */}
          <div className="mt-8 md:mt-12 pt-6 border-t border-border/30">
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
      </div>
    </div>
  );
}
