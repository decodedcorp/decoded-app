"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import Image from "next/image";
import { Search, Share2, Sparkles } from "lucide-react";
import ActivityFeed from "@/app/(main)/activity-feed";

export function DiscoverSection() {
  return (
    <section className="container mx-auto px-4">
      <div
        className={cn(
          "relative rounded-3xl overflow-hidden",
          "border border-zinc-800/50"
        )}
      >
        {/* 콘텐츠 */}
        <div className="relative z-10 grid md:grid-cols-2 gap-8 p-8 md:p-12">
          {/* 왼쪽: 텍스트 영역 */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "px-2 py-1 rounded-lg text-sm",
                      "bg-[#EAFD66]/10 text-[#EAFD66]",
                      "font-medium"
                    )}
                  >
                    For Creators
                  </span>
                </div>
                <h2
                  className={cn(
                    "text-3xl md:text-4xl font-bold",
                    "bg-gradient-to-r from-[#EAFD66] to-[#EAFD66]/70",
                    "bg-clip-text text-transparent"
                  )}
                >
                  여러분의 링크로
                  <br />
                  홍보해보세요
                </h2>
              </div>
              <p className="text-zinc-400 text-lg leading-relaxed">
                블로거, 크리에이터, 판매자님들의
                <br />
                제품 링크를 공유하고 홍보해보세요
              </p>
            </div>

            {/* 기능 설명 리스트 */}
            <div className="space-y-4">
              <FeatureItem
                icon={<Search className="w-5 h-5" />}
                title="이미지로 검색"
                description="찾고 싶은 제품이 있는 이미지를 공유하세요"
              />
              <FeatureItem
                icon={<Share2 className="w-5 h-5" />}
                title="정보 공유"
                description="다른 사용자들과 함께 제품 정보를 공유하세요"
              />
              <FeatureItem
                icon={<Sparkles className="w-5 h-5" />}
                title="포인트 획득"
                description="정확한 정보 제공으로 포인트를 획득하세요"
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
                <span>정보 제공하기</span>
                <Share2
                  className={cn(
                    "w-4 h-4",
                    "transform group-hover:translate-x-0.5",
                    "transition-transform duration-200"
                  )}
                />
              </button>
              <button
                className={cn(
                  "bg-white/5 text-white",
                  "px-6 py-3 rounded-xl",
                  "font-semibold tracking-wide",
                  "hover:bg-white/10",
                  "transition-all duration-200",
                  "border border-white/10"
                )}
              >
                자세히 알아보기
              </button>
            </div>
          </div>

          {/* 오른쪽: 이미지 영역 */}
          <div className="relative aspect-square md:aspect-auto">
            <ActivityFeed />
          </div>
        </div>

        {/* 배경 효과 */}
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
        <div
          className={cn(
            "absolute top-0 right-0 w-1/2 h-full",
            "bg-gradient-to-l from-[#EAFD66]/5 to-transparent"
          )}
        />
      </div>
    </section>
  );
}

interface FeatureItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function FeatureItem({ icon, title, description }: FeatureItemProps) {
  return (
    <div className="flex items-start gap-4">
      <div
        className={cn(
          "flex-shrink-0",
          "w-10 h-10 rounded-xl",
          "bg-[#EAFD66]/10 text-[#EAFD66]",
          "flex items-center justify-center"
        )}
      >
        {icon}
      </div>
      <div className="space-y-1">
        <h3 className="font-medium text-white">{title}</h3>
        <p className="text-sm text-zinc-400">{description}</p>
      </div>
    </div>
  );
}

interface ImageCardProps {
  src: string;
  alt: string;
  tags: string[];
  likes: number;
  className?: string;
}

function ImageCard({ src, alt, tags, likes, className }: ImageCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
      className={cn(
        "group relative rounded-2xl overflow-hidden",
        "bg-zinc-900 shadow-xl",
        "aspect-[3/4]",
        className
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

      {/* 이미지 */}
      <Image src={src} alt={alt} fill className="object-cover" />

      {/* 태그와 좋아요 */}
      <div className={cn("absolute inset-x-0 bottom-0", "p-4 space-y-3")}>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className={cn(
                "px-2 py-1 rounded-lg",
                "text-xs font-medium",
                "bg-white/10 text-white/80"
              )}
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <Share2 className="w-4 h-4 text-[#EAFD66]" />
          <span className="text-sm text-white/80">{likes}개의 정보 제공</span>
        </div>
      </div>

      {/* 호버 효과 */}
      <div
        className={cn(
          "absolute inset-0",
          "flex items-end p-4",
          "opacity-0 group-hover:opacity-100",
          "transition-opacity duration-300",
          "bg-gradient-to-t from-black/90 via-black/50 to-transparent"
        )}
      >
        <button
          className={cn(
            "w-full px-4 py-2 rounded-xl",
            "bg-[#EAFD66] text-black",
            "font-medium text-sm"
          )}
        >
          정보 제공하기
        </button>
      </div>
    </motion.div>
  );
}
