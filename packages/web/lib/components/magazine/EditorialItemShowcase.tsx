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

/** Asymmetric positioning patterns — compact, editorial feel */
const ITEM_LAYOUTS = [
  { width: "w-[55%] md:w-[48%]", offset: "ml-[2%]", rotate: "-rotate-1" },
  { width: "w-[50%] md:w-[45%]", offset: "ml-[45%] md:ml-[50%]", rotate: "rotate-[1.5deg]" },
  { width: "w-[55%] md:w-[48%]", offset: "ml-[5%]", rotate: "rotate-1" },
  { width: "w-[50%] md:w-[45%]", offset: "ml-[42%] md:ml-[48%]", rotate: "-rotate-[1.5deg]" },
];

/**
 * EditorialItemShowcase - Asymmetric item cards with chartreuse glow.
 *
 * Compact, overlapping card layout for cinematic editorial.
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

        gsap.set(card, { opacity: 0, y: 30 });

        ScrollTrigger.create({
          trigger: card,
          start: "top 85%",
          once: true,
          onEnter: () => {
            gsap.to(card, {
              opacity: 1,
              y: 0,
              duration: 0.7,
              delay: i * 0.12,
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
    <section ref={sectionRef} className="px-6 py-12 md:px-10">
      {/* Section label */}
      <p className="mb-8 text-[10px] font-medium uppercase tracking-[0.3em] text-mag-accent/70">
        Curated Items
      </p>

      {/* Asymmetric item cards — overlapping vertically */}
      <div className="-space-y-4">
        {items.map((item, i) => {
          const layout = ITEM_LAYOUTS[i % ITEM_LAYOUTS.length];

          return (
            <div
              key={item.item_id}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              className={`relative ${layout.width} ${layout.offset} ${layout.rotate}`}
            >
              {/* Image with glow border */}
              <div
                className="relative overflow-hidden rounded-lg ring-1 ring-[#eafd67]/30"
                style={{
                  boxShadow: "0 0 15px rgba(234,253,103,0.1)",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.image_url}
                  alt={item.name}
                  className="aspect-[4/3] w-full object-cover"
                />

                {/* Dark gradient for text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                {/* Brand label - top left */}
                <span className="absolute left-3 top-2.5 text-[10px] font-medium uppercase tracking-wider text-mag-text/60">
                  {item.brand}
                </span>

                {/* Price badge - bottom right */}
                <span className="absolute bottom-2.5 right-3 rounded-sm bg-mag-bg/70 px-2 py-0.5 text-xs font-semibold text-mag-accent backdrop-blur-sm">
                  {item.price}
                </span>
              </div>

              {/* Item name below image */}
              <p className="mt-1.5 text-xs text-mag-text/50">{item.name}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
