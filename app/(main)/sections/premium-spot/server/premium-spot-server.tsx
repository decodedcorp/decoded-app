import { cn } from "@/lib/utils/style";
import { ArrowUpRight } from "lucide-react";
import { PremiumSpotClient } from "../client/premium-spot-client";

export function PremiumSpotServer() {
  return (
    <section className="container mx-auto px-4">
      <div
        className={cn(
          "relative rounded-3xl overflow-hidden",
          "border border-zinc-800/50"
        )}
      >
        <div className="relative z-10 p-8 md:p-12 space-y-12">
          {/* 헤더 */}
          <div className="max-w-2xl space-y-4">
            <h2
              className={cn(
                "text-3xl md:text-4xl font-bold",
                "bg-gradient-to-r from-[#EAFD66] to-[#EAFD66]/70",
                "bg-clip-text text-transparent"
              )}
            >
              인기 아이템의
              <br />
              링크를 제공해보세요
            </h2>
            <p className="text-zinc-400 text-lg leading-relaxed">
              많은 사람들이 찾는 아이템에 링크를 제공하고
              <br />더 높은 노출 기회를 얻으세요
            </p>
          </div>

          {/* 인기 아이템 그리드 */}
          <PremiumSpotClient />

          {/* CTA 버튼 */}
          <div className="flex flex-wrap gap-4">
            <button
              className={cn(
                "group flex items-center gap-2",
                "bg-[#EAFD66] text-black",
                "px-6 py-3 rounded-xl",
                "font-semibold tracking-wide",
                "hover:bg-[#EAFD66]/90",
                "transition-all duration-200",
                "shadow-lg shadow-[#EAFD66]/20"
              )}
            >
              <span>인기 아이템 더보기</span>
              <ArrowUpRight
                className={cn(
                  "w-4 h-4",
                  "transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5",
                  "transition-transform duration-200"
                )}
              />
            </button>
          </div>
        </div>

        {/* 배경 효과 */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      </div>
    </section>
  );
} 