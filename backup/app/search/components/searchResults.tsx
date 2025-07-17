"use client";

import { Search, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils/style";
import { Heart } from "lucide-react";
import { useState } from "react";
import type { ImageDoc } from "@/lib/api/types";
import { pretendardBold, pretendardSemiBold } from "@/lib/constants/fonts";

interface SearchTrendingSectionProps {
  searchImages: ImageDoc[];
  trendingImages: ImageDoc[];
}

export function SearchResults({
  searchImages,
  trendingImages,
}: SearchTrendingSectionProps) {
  const [hoveredTrendingId, setHoveredTrendingId] = useState<string | null>(
    null
  );
  const searchParams = useSearchParams();
  const query = searchParams.get("q");

  if (trendingImages.length === 0 && searchImages.length === 0) {
    return null;
  }

  return (
    <div className="container mx-auto w-full">
      <div className="flex flex-col">
        <div className="flex items-center gap-3 py-4">
          <Search className="w-5 h-5 text-[#EAFD66]" />
          <h1
            className={`text-sm md:text-lg ${pretendardBold.className} text-gray-400`}
          >
            &quot;{query}&quot; 검색 결과
          </h1>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-4 md:gap-6">
          {searchImages.map((image) => (
            <ImageCard
              key={image._id}
              image={image}
              onHover={setHoveredTrendingId}
              hoveredId={hoveredTrendingId}
            />
          ))}
        </div>
      </div>
      <div className="py-12">
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="w-5 h-5 text-[#EAFD66]" />
          <h2
            className={`text-sm md:text-lg ${pretendardBold.className} text-gray-400`}
          >
            트렌딩 나우
          </h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-4 md:gap-6">
          {trendingImages.map((image) => (
            <ImageCard
              key={image._id}
              image={image}
              onHover={setHoveredTrendingId}
              hoveredId={hoveredTrendingId}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function ImageCard({ image, onHover, hoveredId }: any) {
  if (image.img_url === undefined) {
    return null;
  }
  const router = useRouter();
  const markers = image.requested_items
    ? Object.values(image.requested_items).flat()
    : [];

  const handleImageClick = () => {
    router.push(`/details/${image._id}`);
  };

  const handleMarkerClick = (e: React.MouseEvent, itemId: string) => {
    e.stopPropagation();
    router.push(`/details/${image._id}?selectedItem=${itemId}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="group cursor-pointer"
      onMouseEnter={() => onHover(image._id)}
      onMouseLeave={() => onHover(null)}
      onClick={handleImageClick}
    >
      <div
        className={cn(
          "relative aspect-[4/5] rounded-xl overflow-hidden",
          "bg-zinc-900"
        )}
      >
        <Image
          src={image.img_url}
          alt={image.title || "이미지"}
          fill
          unoptimized
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

        {/* 마커 표시 */}
        {hoveredId === image._id &&
          markers.map((marker: any) => (
            <div
              key={marker.item_doc_id}
              className="absolute z-30"
              style={{
                top: `${marker.position.top}%`,
                left: `${marker.position.left}%`,
                width: "20px",
                height: "20px",
                transform: "translate(-50%, -50%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
              onClick={(e) => handleMarkerClick(e, marker.item_doc_id)}
            >
              {/* 중앙 점 */}
              <div className="absolute w-2 h-2 rounded-full bg-[#EAFD66]" />
              {/* 애니메이션되는 원 */}
              <div className="absolute w-full h-full rounded-full border-2 border-[#EAFD66] animate-ping opacity-75" />
            </div>
          ))}

        {/* 하단 정보 */}
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <h3 className="text-sm font-medium line-clamp-1">
            {image.title || ""}
          </h3>
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-1 text-white/80/60">
              <Heart className="w-4 h-4" />
              <span className="text-xs">{image.like}</span>
            </div>
            <span className="text-xs text-white/80/60">
              {markers.length}개 아이템
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
