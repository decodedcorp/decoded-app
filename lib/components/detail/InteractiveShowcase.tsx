"use client";

import { useState, useRef, RefObject } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import type { ImageRow } from "@/lib/supabase/types";
import type { UiItem } from "./types";
import { ImageCanvas } from "./ImageCanvas";
import { ItemDetailCard } from "./ItemDetailCard";
import { ConnectorLayer } from "./ConnectorLayer";

// Register GSAP ScrollTrigger plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type Props = {
  image: ImageRow;
  items: UiItem[];
  isModal?: boolean;
  scrollContainerRef?: RefObject<HTMLElement>;
};

/**
 * Interactive Showcase - The Core Feature
 *
 * Desktop: Sticky split layout (left image fixed / right text scrolls)
 * Mobile: Stack layout (top image fixed ~40vh / bottom text scrolls)
 *
 * Uses ScrollTrigger to sync active item with scroll position.
 */
export function InteractiveShowcase({
  image,
  items,
  isModal = false,
  scrollContainerRef,
}: Props) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);

  // Setup ScrollTrigger for each card
  useGSAP(
    () => {
      if (!sectionRef.current || items.length === 0) return;

      const cards = gsap.utils.toArray<HTMLElement>(
        sectionRef.current.querySelectorAll("[data-item-index]")
      );

      cards.forEach((card, index) => {
        ScrollTrigger.create({
          scroller: scrollContainerRef?.current || window,
          trigger: card,
          start: "top center",
          end: "bottom center",
          onEnter: () => setActiveIndex(index),
          onEnterBack: () => setActiveIndex(index),
          onLeave: () => {
            // Only clear if scrolling past (not when entering previous)
            if (index < (activeIndex ?? 0)) {
              setActiveIndex(null);
            }
          },
          onLeaveBack: () => {
            if (index > (activeIndex ?? 0)) {
              setActiveIndex(null);
            }
          },
        });
      });

      return () => {
        ScrollTrigger.getAll().forEach((trigger) => {
          if (cards.includes(trigger.vars.trigger as HTMLElement)) {
            trigger.kill();
          }
        });
      };
    },
    { scope: sectionRef, dependencies: [items.length] }
  );

  if (items.length === 0) {
    return null;
  }

  return (
    <section
      ref={sectionRef}
      className={`flex flex-col relative h-auto ${isModal ? "" : "lg:flex-row lg:h-[300vh]"}`}
    >
      {/* Left: Sticky Image Canvas (Desktop) / Top: Fixed Image (Mobile) */}
      <div
        ref={imageContainerRef}
        className={`sticky top-0 w-full z-10 ${isModal ? "h-[40vh]" : "h-[40vh] lg:h-screen lg:w-1/2"}`}
      >
        <ImageCanvas image={image} items={items} activeIndex={activeIndex} />
      </div>

      {/* Right: Scrollable Item Details (Desktop) / Bottom: Scrollable (Mobile) */}
      <div
        ref={cardsContainerRef}
        className={`w-full px-5 py-10 bg-background relative z-20 ${isModal ? "" : "lg:w-1/2 lg:pl-10 lg:pt-20"}`}
      >
        {items.map((item, index) => (
          <ItemDetailCard
            key={item.id}
            item={item}
            index={index}
            onActivate={() => setActiveIndex(index)}
            onDeactivate={() => setActiveIndex(null)}
          />
        ))}
      </div>

      {/* Connector Lines Layer */}
      <ConnectorLayer
        items={items}
        activeIndex={activeIndex}
        imageContainerRef={imageContainerRef}
        cardsContainerRef={cardsContainerRef}
        scrollContainerRef={scrollContainerRef}
      />
    </section>
  );
}
