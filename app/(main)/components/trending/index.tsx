"use client";

import { cn } from "@/lib/utils/style";
import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import { Flame, Heart } from "lucide-react";

const CATEGORIES = ["전체", "패션", "뷰티", "테크", "라이프"] as const;

type Category = (typeof CATEGORIES)[number];

export function TrendingSection() {
  const [activeCategory, setActiveCategory] = useState<Category>("전체");

  return (
    <section className="container mx-auto px-4">
      <div className="space-y-8">
        {/* 헤더 */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-[#EAFD66]" />
              <h2 className="text-xl font-semibold text-white">트렌딩 나우</h2>
            </div>
            <p className="text-zinc-400">
              지금 가장 인기 있는 아이템을 확인하세요
            </p>
          </div>

          {/* 카테고리 필터 */}
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={cn(
                  "px-4 py-2 rounded-xl text-sm whitespace-nowrap",
                  "transition-all duration-200",
                  activeCategory === category
                    ? "bg-[#EAFD66] text-black font-medium"
                    : "bg-zinc-900 text-zinc-400 hover:bg-zinc-800"
                )}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* 트렌딩 아이템 그리드 */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <TrendingCard
              key={i}
              rank={i + 1}
              image="https://placehold.co/400x300"
              title="트렌딩 아이템 이름"
              brand="브랜드명"
              likes={1234}
            />
          ))}
        </div>

        {/* "더보기" 버튼 */}
        <div className="flex justify-center">
          <button
            className={cn(
              "group px-6 py-3 rounded-xl",
              "border border-zinc-800",
              "hover:border-[#EAFD66]/20",
              "transition-colors duration-200"
            )}
          >
            <span
              className={cn(
                "text-zinc-400 group-hover:text-white",
                "transition-colors duration-200"
              )}
            >
              더 많은 트렌딩 아이템 보기
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}

interface TrendingCardProps {
  rank: number;
  image: string;
  title: string;
  brand: string;
  likes: number;
}

function TrendingCard({ rank, image, title, brand, likes }: TrendingCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="group cursor-pointer"
    >
      {/* 이미지 컨테이너 */}
      <div
        className={cn(
          "relative aspect-[3/4] rounded-xl overflow-hidden",
          "bg-zinc-900",
          "mb-3"
        )}
      >
        {/* 순위 뱃지 */}
        <div
          className={cn(
            "absolute top-3 left-3 z-10",
            "w-8 h-8 rounded-lg",
            "bg-black/80 backdrop-blur-sm",
            "flex items-center justify-center",
            "text-sm font-bold",
            rank <= 3 ? "text-[#EAFD66]" : "text-white"
          )}
        >
          {rank}
        </div>

        {/* 이미지 */}
        <Image
          src={image}
          alt={title}
          fill
          className={cn(
            "object-cover",
            "group-hover:scale-105",
            "transition-transform duration-300"
          )}
        />

        {/* 호버 오버레이 */}
        <div
          className={cn(
            "absolute inset-0",
            "bg-gradient-to-t from-black/80 via-black/20 to-transparent",
            "opacity-0 group-hover:opacity-100",
            "transition-opacity duration-300"
          )}
        />
      </div>

      {/* 텍스트 정보 */}
      <div className="space-y-1 px-1">
        <h3 className="font-medium text-white group-hover:text-[#EAFD66] transition-colors duration-200">
          {title}
        </h3>
        <div className="flex items-center justify-between text-sm">
          <span className="text-zinc-400">{brand}</span>
          <div className="flex items-center gap-1 text-zinc-400">
            <Heart className="w-4 h-4" />
            <span>{likes.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
