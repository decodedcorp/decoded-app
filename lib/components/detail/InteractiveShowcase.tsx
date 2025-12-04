"use client";

import { useState, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import type { ImageRow } from "@/lib/supabase/types";
import type { NormalizedItem } from "./types";
import { ImageCanvas } from "./ImageCanvas";
import { ItemDetailCard } from "./ItemDetailCard";
import { ConnectorLayer } from "./ConnectorLayer";

// Register GSAP ScrollTrigger plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type Props = {
  image: ImageRow;
  items: NormalizedItem[];
};

/**
 * Interactive Showcase - The Core Feature
 *
 * Desktop: Sticky split layout (left image fixed / right text scrolls)
 * Mobile: Stack layout (top image fixed ~40vh / bottom text scrolls)
 *
 * Uses ScrollTrigger to sync active item with scroll position.
 */
export function InteractiveShowcase({ image, items }: Props) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);

  // Setup ScrollTrigger for each card
  useGSAP(() => {
    if (!sectionRef.current || items.length === 0) return;

    const cards = gsap.utils.toArray<HTMLElement>(
      sectionRef.current.querySelectorAll("[data-item-index]")
    );

    cards.forEach((card, index) => {
      ScrollTrigger.create({
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
  }, { scope: sectionRef, dependencies: [items.length] });

  if (items.length === 0) {
    return null;
  }

  return (
    <section
      ref={sectionRef}
      className="flex flex-col lg:flex-row h-auto lg:h-[300vh] relative"
    >
      {/* Left: Sticky Image Canvas (Desktop) / Top: Fixed Image (Mobile) */}
      <div
        ref={imageContainerRef}
        className="sticky top-0 h-[40vh] lg:h-screen w-full lg:w-1/2 z-10"
      >
        <ImageCanvas
          image={image}
          items={items}
          activeIndex={activeIndex}
        />
      </div>

      {/* Right: Scrollable Item Details (Desktop) / Bottom: Scrollable (Mobile) */}
      <div
        ref={cardsContainerRef}
        className="w-full lg:w-1/2 px-5 py-10 lg:pl-10 lg:pt-20 bg-background relative z-20"
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
      />
    </section>
  );
}

