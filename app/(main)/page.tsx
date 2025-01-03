"use client";
import { ChevronDown } from "lucide-react";

import { MetricsSection } from "./components/sections/metric";
import { DiscoverSection } from "./components/sections/discover";
import { PremiumSpotSection } from "./components/sections/premium-spot";
import { TrendingSection } from "./components/trending";
import { GridBackground } from "./grid-box";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-[100vh] bg-black text-white">
      {/* 메인 배너 섹션 */}
      <section className="relative h-screen flex items-center justify-center bg-grid-pattern">
        <GridBackground />
        <div className="container mx-auto px-4 text-center space-y-8 z-10">
          <h1 className="text-4xl md:text-6xl font-bold mb-8">
            찾고싶은 제품을
            <br />
            지금 바로 요청해보세요
          </h1>
          <Link
            href="/request"
            className={cn(
              "bg-[#EAFD66] text-black",
              "px-8 py-3 rounded-xl",
              "font-semibold tracking-wide",
              "hover:bg-[#EAFD66]/90",
              "transition-all duration-200",
              "shadow-lg shadow-[#EAFD66]/20"
            )}
          >
            요청하기
          </Link>
        </div>

        {/* Scroll to learn more */}
        <div
          className={cn(
            "relative z-10", // z-index 추가
            "absolute bottom-8 left-1/2 -translate-x-1/2",
            "flex flex-col items-center gap-2",
            "animate-fade-in-up"
          )}
        >
          <span className="text-sm text-zinc-500">스크롤 내리기</span>
          <ChevronDown
            className={cn("w-5 h-5 text-[#EAFD66]", "animate-bounce")}
          />
        </div>
      </section>

      <div className="space-y-24 py-16">
        <MetricsSection />
        <DiscoverSection />
        <PremiumSpotSection />
        <TrendingSection />
      </div>
    </div>
  );
}
