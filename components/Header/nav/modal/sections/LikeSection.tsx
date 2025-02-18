"use client";

import { useEffect, useState } from "react";
import { useLocaleContext } from "@/lib/contexts/locale-context";
import { cn } from "@/lib/utils/style";
import Image from "next/image";
import { networkManager } from "@/lib/network/network";
import Link from "next/link";

interface LikedImage {
  image_doc_id: string;
  image_url: string;
}

interface LikedItem {
  item_doc_id: string;
  image_url: string | null;
  name: string | null;
  item_category: string;
}

interface LikesData {
  images: {
    likes: LikedImage[];
    next_id: string | null;
  };
  items: {
    likes: LikedItem[];
    next_id: string | null;
  };
}

type LikeCategory = "all" | "images" | "items";

export function LikeSection({
  data,
  isLoading,
}: {
  data: LikesData;
  isLoading: boolean;
}) {
  const { t } = useLocaleContext();
  const [activeCategory, setActiveCategory] = useState<LikeCategory>("all");

  if (!data) return null;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[#EAFD66] border-r-2" />
      </div>
    );
  }

  const hasNoLikes = 
    (!data.images?.likes?.length && !data.items?.likes?.length);

  if (hasNoLikes) {
    return (
      <div className="flex flex-col items-center justify-center h-[400px] space-y-4">
        <div className="w-16 h-16 rounded-full bg-[#1A1A1A] flex items-center justify-center">
          <svg
            className="w-8 h-8 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </div>
        <div className="text-gray-400 text-sm">{t.mypage.like.empty}</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* 카테고리 필터 */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {Object.entries(t.mypage.like.categories).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setActiveCategory(key as LikeCategory)}
            className={cn(
              "px-3 py-1.5 rounded-lg text-sm whitespace-nowrap",
              "transition-colors duration-200",
              key === activeCategory
                ? "bg-[#EAFD66]/10 text-[#EAFD66]"
                : "bg-[#1A1A1A] text-gray-400 hover:bg-[#1A1A1A]/80"
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* 좋아요 목록 */}
      <div className="grid grid-cols-2 gap-2 max-h-[400px] overflow-y-auto p-0.5">
        {/* 이미지 목록 */}
        {(activeCategory === "all" || activeCategory === "images") &&
          data.images?.likes?.map((image) => (
            <Link
              href={`/details/${image.image_doc_id}`}
              key={image.image_doc_id}
              className="relative aspect-[4/5] rounded-lg overflow-hidden group"
            >
              <Image
                src={image.image_url}
                alt="Liked image"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          ))}

        {/* 아이템 목록 */}
        {(activeCategory === "all" || activeCategory === "items") &&
          data.items?.likes?.map((item) => (
            <div
              key={item.item_doc_id}
              className="bg-[#1A1A1A] rounded-lg p-3 flex flex-col gap-2"
            >
              <div className="relative aspect-[4/5] rounded-md overflow-hidden">
                {item.image_url ? (
                  <Image
                    src={item.image_url}
                    alt={item.name || "Item image"}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-black/20 flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                )}
              </div>
              <div className="space-y-1">
                <div className="text-xs text-[#EAFD66]">
                  {item.item_category}
                </div>
                <div className="text-sm text-white line-clamp-2">
                  {item.name || "이름 없음"}
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
