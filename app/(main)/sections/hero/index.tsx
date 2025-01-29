import { getRandomResources } from "@/lib/api/server/images";
import { FloatingBoxes as FloatingBoxesClient } from "./components/floating-boxes";
import { HeroContent } from "./components/hero-content";
import ScrollIndicator from "./components/scroll-indicator";
import type { BoxSizeMode } from "./utils/types";
import { Suspense } from "react";
import type {
  RandomImageResource,
  RandomItemResource,
} from "@/lib/api/client/images";
import { Locale } from "@/lib/lang/locales";
interface HeroSectionProps {
  sizeMode?: BoxSizeMode;
  locale?: Locale;
}

export async function HeroSection({ sizeMode = "LARGE" }: HeroSectionProps) {
  let resources: (RandomImageResource | RandomItemResource)[] = [];

  try {
    // 서버 사이드에서 데이터 fetching
    const response = await getRandomResources();
    resources = response.data?.resources?.slice(0, 10) ?? [];
  } catch (error) {
    console.error("Failed to load random resources:", error);
    // 에러가 발생해도 UI는 렌더링
  }

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
              <FloatingBoxesClient
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
