"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ArrowUpRight, Link, Eye, Sparkles } from "lucide-react";
import Image from "next/image";
import { networkManager } from "@/common/network";

// DO-NOT-DELETE: For future use
// interface TrendingItem {
//     id: string;
//     image: string;
//     title: string;
//     category: string;
//     views: number;
//     requestCount: number;
//     exposureRate: string;
//   }

export function PremiumSpotSection() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchTrendingItems() {
      try {
        const res = await networkManager.request(
          "metrics/trending/items",
          "GET"
        );
        console.log("Trending items:", res.data);
      } catch (error) {
        console.error("Error fetching trending items:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchTrendingItems();
  }, []);

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
          <div className="grid md:grid-cols-3 gap-6">
            <ItemSpotCard
              image="/images/items/1.jpg"
              title="블랙 크롭 자켓"
              category="패션/의류"
              views={1240}
              requestCount={38}
              exposureRate="320%"
            />
            <ItemSpotCard
              image="/images/items/2.jpg"
              title="화이트 스니커즈"
              category="신발"
              views={980}
              requestCount={25}
              exposureRate="280%"
              featured
            />
            <ItemSpotCard
              image="/images/items/3.jpg"
              title="브라운 크로스백"
              category="가방"
              views={850}
              requestCount={19}
              exposureRate="250%"
            />
          </div>

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

interface ItemSpotCardProps {
  image: string;
  title: string;
  category: string;
  views: number;
  requestCount: number;
  exposureRate: string;
  featured?: boolean;
}

function ItemSpotCard({
  image,
  title,
  category,
  views,
  requestCount,
  exposureRate,
  featured,
}: ItemSpotCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={cn(
        "group relative",
        "rounded-2xl overflow-hidden",
        "border border-zinc-800/50",
        "hover:border-[#EAFD66]/20",
        "transition-all duration-300",
        featured && "ring-2 ring-[#EAFD66]/30"
      )}
    >
      {/* 이미지 */}
      <div className="relative aspect-[4/3]">
        <Image src={image} alt={title} fill className="object-cover" />
        {featured && (
          <div
            className={cn(
              "absolute top-3 right-3",
              "px-2 py-1 rounded-full",
              "bg-[#EAFD66] text-black",
              "text-xs font-medium",
              "flex items-center gap-1"
            )}
          >
            <Sparkles className="w-3 h-3" />
            <span>인기</span>
          </div>
        )}
      </div>

      {/* 콘텐츠 */}
      <div className="p-5 space-y-4">
        {/* 아이템 정보 */}
        <div>
          <h3 className="font-medium text-white">{title}</h3>
          <p className="text-sm text-zinc-400">{category}</p>
        </div>

        {/* 통계 */}
        <div className="grid grid-cols-3 gap-2 text-center text-sm">
          <div>
            <p className="text-[#EAFD66] font-medium">
              {views.toLocaleString()}
            </p>
            <p className="text-zinc-500 text-xs">조회</p>
          </div>
          <div>
            <p className="text-[#EAFD66] font-medium">{requestCount}</p>
            <p className="text-zinc-500 text-xs">요청</p>
          </div>
          <div>
            <p className="text-[#EAFD66] font-medium">{exposureRate}</p>
            <p className="text-zinc-500 text-xs">노출률</p>
          </div>
        </div>

        {/* 링크 제공 버튼 */}
        <button
          className={cn(
            "w-full flex items-center justify-center gap-2",
            "py-2 rounded-lg",
            "bg-zinc-800/50 hover:bg-zinc-700/50",
            "text-sm font-medium text-white",
            "transition-colors duration-200"
          )}
        >
          <Link className="w-4 h-4" />
          <span>링크 제공하기</span>
        </button>
      </div>
    </motion.div>
  );
}
