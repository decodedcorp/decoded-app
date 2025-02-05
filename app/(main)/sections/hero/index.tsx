'use client';

import { FloatingBoxes } from "./components/floating-boxes";
import { HeroContent } from "./components/hero-content";
import ScrollIndicator from "./components/scroll-indicator";
import type { BoxSizeMode } from "./utils/types";
import { Suspense } from "react";
import { useRandomResources } from "./hooks/use-random-resources";
import { Locale } from "@/lib/lang/locales";
import type { ItemDoc, ImageDoc } from "@/lib/api/types";

interface HeroSectionProps {
  sizeMode?: BoxSizeMode;
  locale?: Locale;
}

export function HeroSection({ sizeMode = "LARGE" }: HeroSectionProps) {
  const { data: resources = [] as Array<ItemDoc | ImageDoc> } = useRandomResources();

  return (
    <section className="relative w-full h-screen overflow-hidden isolate">
      {/* Background Layer with Floating Boxes */}
      <div className="absolute inset-0 z-[5] bg-black">
        {/* Background Blur Layers */}
        <div className="relative w-full h-full">
          {/* Deep Layer - Strong Blur */}
          <div className="absolute inset-0 backdrop-blur-[80px] opacity-40" />
          {/* Middle Layer - Medium Blur */}
          <div className="absolute inset-0 backdrop-blur-[40px] opacity-30" />
          {/* Front Layer - Light Blur */}
          <div className="absolute inset-0 backdrop-blur-[20px] opacity-20" />

          {/* Floating Boxes */}
          <div className="relative w-full h-full flex items-center justify-center">
            <Suspense fallback={null}>
              <FloatingBoxes
                sizeMode={sizeMode}
                initialResources={resources}
              />
            </Suspense>
          </div>
        </div>
      </div>

      {/* Static Content Container (Top Layer) */}
      <div className="absolute inset-0 z-[10] flex flex-col min-h-screen pointer-events-none">
        <div className="flex-1 flex items-center justify-center">
          <div className="pointer-events-auto">
            <HeroContent />
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-[30vh] bg-gradient-to-b from-transparent via-background/50 to-background pointer-events-none" />
      </div>

      {/* Scroll Indicator */}
      <div className="absolute inset-x-0 bottom-0 z-[30] h-24 flex items-center justify-center pointer-events-auto">
        <ScrollIndicator />
      </div>
    </section>
  );
}
