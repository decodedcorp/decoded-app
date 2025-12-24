"use client";

import { useRef, useState, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import type { UiItem } from "./types";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { SpotlightCard } from "@/lib/components/ui/SpotlightCard";

// Register GSAP ScrollTrigger plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type Props = {
  items: UiItem[];
  isModal?: boolean;
};

/**
 * ShopGrid - "Shop the Look" section
 *
 * Horizontal carousel displaying items extracted from the image.
 * Uses stagger animation for sequential card appearance.
 * Features ReactBits Spotlight Card effect.
 */
export function ShopGrid({ items, isModal = false }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10); // 10px buffer
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, [items]);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;

    const scrollAmount = 280; // Adjusted for smaller card width
    const currentScroll = scrollRef.current.scrollLeft;
    const targetScroll =
      direction === "left"
        ? currentScroll - scrollAmount
        : currentScroll + scrollAmount;

    scrollRef.current.scrollTo({
      left: targetScroll,
      behavior: "smooth",
    });
  };

  useGSAP(
    () => {
      // Skip GSAP animations in modal to avoid ScrollTrigger issues
      if (isModal || !containerRef.current) return;

      const cards = gsap.utils.toArray<HTMLElement>(
        containerRef.current.querySelectorAll(".shop-card")
      );

      gsap.fromTo(
        cards,
        {
          y: 50,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );
    },
    { scope: containerRef, dependencies: [isModal] }
  );

  if (items.length === 0) {
    return null;
  }

  return (
    <section 
      ref={containerRef} 
      className={`border-t border-border/40 overflow-hidden w-full ${
        isModal ? "py-12 md:py-16" : "py-24"
      }`}
    >
      <div className={`mx-auto ${isModal ? "max-w-full px-4 md:px-6" : "max-w-7xl px-6 md:px-8"}`}>
        <div className="flex flex-col items-center mb-8 md:mb-12">
          <span className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground mb-3 md:mb-4">
            Curated Selection
          </span>
          <h2 className={`font-serif text-center tracking-tight ${
            isModal ? "text-3xl md:text-4xl" : "text-4xl md:text-5xl lg:text-6xl"
          }`}>
            Shop the Look
          </h2>
        </div>
      </div>

      <div className="relative group/carousel w-full">
        {/* Navigation Buttons */}
        <button
          onClick={() => scroll("left")}
          disabled={!canScrollLeft}
          className={`absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-background/80 backdrop-blur-sm border border-border flex items-center justify-center transition-all duration-300 shadow-lg ${
            !canScrollLeft
              ? "opacity-0 pointer-events-none"
              : "opacity-0 group-hover/carousel:opacity-100 hover:bg-background hover:scale-110"
          }`}
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <button
          onClick={() => scroll("right")}
          disabled={!canScrollRight}
          className={`absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-background/80 backdrop-blur-sm border border-border flex items-center justify-center transition-all duration-300 shadow-lg ${
            !canScrollRight
              ? "opacity-0 pointer-events-none"
              : "opacity-0 group-hover/carousel:opacity-100 hover:bg-background hover:scale-110"
          }`}
          aria-label="Scroll right"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Carousel Container */}
        <div
          ref={scrollRef}
          onScroll={checkScroll}
          className={`flex overflow-x-auto scrollbar-hide snap-x snap-mandatory w-full ${
            isModal 
              ? "gap-3 md:gap-4 px-4 md:px-6 pb-8 md:pb-10 pt-2 md:pt-4" 
              : "gap-4 md:gap-6 px-6 md:px-8 pb-12 pt-4"
          }`}
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {items.map((item) => (
            <div
              key={item.id}
              className={`shop-card flex-none snap-center group flex flex-col ${
                isModal 
                  ? "w-[160px] sm:w-[180px] md:w-[200px]" 
                  : "w-[180px] sm:w-[200px] md:w-[220px] lg:w-[260px]"
              }`}
            >
              <SpotlightCard className="h-full flex flex-col bg-card/50 backdrop-blur-sm">
                <div className={`flex flex-col h-full ${isModal ? "p-3" : "p-3 md:p-4"}`}>
                  {/* Item Image */}
                  <div className={`relative w-full aspect-[3/4] overflow-hidden rounded-lg bg-muted ${
                    isModal ? "mb-2 md:mb-3" : "mb-3 md:mb-4"
                  }`}>
                    {item.imageUrl ? (
                      <Image
                        src={item.imageUrl}
                        alt={item.product_name || "Item"}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-muted/30">
                        <span className="text-muted-foreground text-sm font-serif italic">
                          No Image
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Item Details */}
                  <div className="flex flex-col items-center text-center flex-grow">
                    {item.brand && (
                      <p className={`font-medium uppercase tracking-widest text-muted-foreground ${
                        isModal ? "text-[9px] mb-1" : "text-[10px] mb-2"
                      }`}>
                        {item.brand}
                      </p>
                    )}
                    <h3 className={`font-serif font-medium leading-tight group-hover:text-foreground/80 transition-colors ${
                      isModal ? "text-sm md:text-base mb-1 md:mb-2" : "text-base md:text-lg mb-2"
                    }`}>
                      {item.product_name || "Untitled Item"}
                    </h3>
                  {item.price && (
                    <p className={`font-medium text-primary mt-auto font-mono ${
                      isModal ? "text-xs pt-0.5 md:pt-1" : "text-sm pt-1"
                    }`}>
                      {item.price.split('|')[0].trim()}
                    </p>
                  )}

                    <button className={`w-full border border-border/50 bg-background/50 hover:bg-foreground hover:text-background transition-all duration-300 text-[9px] md:text-[10px] uppercase tracking-widest rounded-sm ${
                      isModal ? "mt-2 md:mt-3 py-1.5 md:py-2" : "mt-3 md:mt-4 py-2"
                    }`}>
                      View Details
                    </button>
                  </div>
                </div>
              </SpotlightCard>
            </div>
          ))}
          {/* End spacer for smooth scrolling */}
          <div className="w-2 flex-none" />
        </div>
      </div>
    </section>
  );
}
