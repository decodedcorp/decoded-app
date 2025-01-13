"use client";

import { cn } from "@/lib/utils/style";
import { motion } from "framer-motion";
import Image from "next/image";
import { Heart } from "lucide-react";

interface ProductCardProps {
  rank: number;
  image: string;
  title: string;
  brand: string;
  likes: number;
}

export function ProductCard({ rank, image, title, brand, likes }: ProductCardProps) {
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