"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import type { UiItem } from "./types";
import Image from "next/image";

// Register GSAP ScrollTrigger plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type Props = {
  items: UiItem[];
};

/**
 * ShopGrid - "Shop the Look" section
 *
 * Minimal card grid displaying items extracted from the image.
 * Uses stagger animation for sequential card appearance.
 */
export function ShopGrid({ items }: Props) {
  const gridRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!gridRef.current) return;

      const cards = gsap.utils.toArray<HTMLElement>(
        gridRef.current.querySelectorAll(".shop-card")
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
            trigger: gridRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );
    },
    { scope: gridRef }
  );

  if (items.length === 0) {
    return null;
  }

  return (
    <section className="py-20 px-4 md:px-8">
      <div className="mx-auto max-w-6xl">
        <h2 className="font-serif text-4xl md:text-5xl font-bold mb-12 text-center">
          Shop the Look
        </h2>

        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {items.map((item) => (
            <div
              key={item.id}
              className="shop-card bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow flex flex-col"
            >
              {/* Item Image */}
              {item.imageUrl ? (
                <div className="relative w-full aspect-square bg-muted">
                  <Image
                    src={item.imageUrl}
                    alt={item.product_name || "Item"}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
              ) : (
                <div className="w-full aspect-square bg-muted flex items-center justify-center">
                  <span className="text-muted-foreground text-sm">
                    No Image
                  </span>
                </div>
              )}

              {/* Item Details */}
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="font-serif text-xl font-semibold mb-2">
                  {item.product_name || "Item"}
                </h3>
                {item.brand && (
                  <p className="text-sm text-muted-foreground uppercase tracking-wide mb-2">
                    {item.brand}
                  </p>
                )}
                {item.price && (
                  <p className="text-lg font-semibold text-scanner-green mt-auto">
                    {item.price}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
