"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface ShowcaseItem {
  item_id: string;
  image_url: string;
  brand: string;
  name: string;
  price: string;
}

interface EditorialItemShowcaseProps {
  items: ShowcaseItem[];
}

/** Asymmetric positioning patterns for items */
const ITEM_LAYOUTS = [
  "w-[55%] ml-[5%] -rotate-1",
  "w-[45%] ml-[45%] rotate-2 -mt-8",
  "w-[50%] ml-[10%] rotate-1 -mt-4",
  "w-[40%] ml-[50%] -rotate-2 -mt-6",
  "w-[48%] ml-[8%] rotate-[0.5deg] -mt-4",
  "w-[42%] ml-[48%] -rotate-1 -mt-8",
];

/**
 * EditorialItemShowcase - Asymmetric item cards with chartreuse glow borders.
 *
 * Items are NOT in a grid. Each card is asymmetrically positioned with
 * rotation and offset for an editorial magazine feel.
 * GSAP ScrollTrigger animates each card with staggered fade-up and rotation correction.
 */
export function EditorialItemShowcase({ items }: EditorialItemShowcaseProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      cardRefs.current.forEach((card, i) => {
        if (!card) return;

        gsap.set(card, { opacity: 0, y: 40, rotate: (i % 2 === 0 ? -3 : 3) });

        ScrollTrigger.create({
          trigger: card,
          start: "top 85%",
          once: true,
          onEnter: () => {
            gsap.to(card, {
              opacity: 1,
              y: 0,
              rotate: 0,
              duration: 0.7,
              delay: i * 0.15,
              ease: "power2.out",
            });
          },
        });
      });
    }, section);

    return () => ctx.revert();
  }, [items]);

  if (!items.length) return null;

  return (
    <section ref={sectionRef} className="px-6 py-16">
      {/* Section label */}
      <p className="mb-10 text-xs font-medium uppercase tracking-[0.3em] text-mag-text/50">
        Curated Items
      </p>

      {/* Asymmetric item cards */}
      <div className="space-y-6">
        {items.map((item, i) => {
          const layout = ITEM_LAYOUTS[i % ITEM_LAYOUTS.length];

          return (
            <div
              key={item.item_id}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              className={`relative ${layout}`}
            >
              {/* Brand label - absolute top-left */}
              <span className="absolute left-3 top-3 z-10 text-xs font-medium uppercase tracking-wider text-mag-text/50">
                {item.brand}
              </span>

              {/* Image with glow border */}
              <div
                className="overflow-hidden rounded-lg ring-1 ring-[#eafd67]/40"
                style={{
                  boxShadow: "0 0 20px rgba(234,253,103,0.15)",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.image_url}
                  alt={item.name}
                  className="aspect-[4/5] w-full object-cover"
                />
              </div>

              {/* Price badge - absolute bottom-right */}
              <span className="absolute bottom-3 right-3 z-10 rounded-sm bg-mag-bg/80 px-2 py-1 text-xs font-medium text-mag-text/80 backdrop-blur">
                {item.price}
              </span>

              {/* Item name below image */}
              <p className="mt-2 text-sm text-mag-text/70">{item.name}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
