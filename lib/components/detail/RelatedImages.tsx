"use client";

import { useRelatedImagesByAccount } from "@/lib/hooks/useImages";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

// Register GSAP ScrollTrigger plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type Props = {
  currentImageId: string;
  account: string;
};

export function RelatedImages({ currentImageId, account }: Props) {
  const { data: images, isLoading } = useRelatedImagesByAccount(
    currentImageId,
    account
  );
  const sectionRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!sectionRef.current || !images || images.length === 0) return;

      const cards = gsap.utils.toArray<HTMLElement>(
        sectionRef.current.querySelectorAll(".related-card")
      );

      gsap.fromTo(
        cards,
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
    },
    { scope: sectionRef, dependencies: [images] }
  );

  if (isLoading) {
    return (
      <section className="py-24 px-6 md:px-8 bg-muted/10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <div className="h-4 w-32 bg-muted rounded mx-auto mb-4 animate-pulse" />
            <div className="h-10 w-64 bg-muted rounded mx-auto animate-pulse" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="aspect-[3/4] bg-muted animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!images || images.length === 0) {
    return null;
  }

  return (
    <section className="py-24 px-6 md:px-8 bg-muted/10 border-t border-border/40">
      <div ref={sectionRef} className="mx-auto max-w-7xl">
        <div className="flex flex-col items-center mb-12">
          <span className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground mb-4">
            More from
          </span>
          <h2 className="font-serif text-3xl md:text-5xl text-center tracking-tight">
            @{account}
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
          {images.map((image) => (
            <Link
              key={image.id}
              href={`/images/${image.id}`}
              className="related-card group block relative aspect-[3/4] overflow-hidden bg-muted"
            >
              {image.image_url ? (
                <Image
                  src={image.image_url}
                  alt={`Post by @${account}`}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-muted-foreground text-xs">No Image</span>
                </div>
              )}
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

