"use client";

import type { ImageRow } from "@/lib/supabase/types";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

type Props = {
  image: ImageRow;
};

/**
 * Hero Section - The Hook
 *
 * Full-screen hero image with dramatic typography and entrance animations.
 * Uses GSAP for Ken Burns effect (scale) and title reveal animation.
 */
export function HeroSection({ image }: Props) {
  const heroRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!heroRef.current || !imageRef.current || !titleRef.current) return;

    const ctx = gsap.context(() => {
      // Ken Burns effect: Image scales from 1.2 to 1.0
      gsap.fromTo(
        imageRef.current,
        { scale: 1.2 },
        {
          scale: 1.0,
          duration: 1.5,
          ease: "power2.out",
        }
      );

      // Title reveal: Slides up from below
      gsap.fromTo(
        titleRef.current,
        { y: "100%", opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          delay: 0.3,
          ease: "power3.out",
        }
      );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={heroRef} className="relative h-screen w-full overflow-hidden">
      {image.image_url && (
        <img
          ref={imageRef}
          src={image.image_url}
          alt={`Image ${image.id}`}
          className="h-full w-full object-cover will-change-transform"
          loading="eager"
        />
      )}
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      
      {/* Hero Title */}
      <div className="absolute inset-0 flex items-end justify-center pb-20 px-4">
        <div ref={titleRef} className="overflow-hidden">
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold text-white tracking-tight">
            Editorial
          </h1>
        </div>
      </div>
    </div>
  );
}

