"use client";

import { useEffect, useState } from "react";
import { useLocaleContext } from "@/lib/contexts/locale-context";
import { cn } from "@/lib/utils/style";
import Image from "next/image";
import { networkManager } from "@/lib/network/network";
import Link from "next/link";

interface ProvideItem {
  item_doc_id: string;
  item_image_url: string;
  label: string | null;
}

interface Provide {
  image_doc_id: string;
  image_url: string;
  items: ProvideItem[] | null;
}

interface ProvidesData {
  provide_num: number;
  provides: Provide[] | null;
  next_id: string | null;
}

export function ProvideSection({
  data,
  isLoading,
}: {
  data: ProvidesData;
  isLoading: boolean;
}) {
  const { t } = useLocaleContext();
  const [activeStatus, setActiveStatus] = useState<string>("active");

  if (!data) return null;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[#EAFD66] border-r-2" />
      </div>
    );
  }

  if (!data?.provides || data.provides.length === 0) {
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
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
        </div>
        <div className="text-gray-400 text-sm">{t.mypage.provide.empty}</div>
      </div>
    );
  }

  return (
    <div 
      className="space-y-4 relative z-10"
      onClick={(e) => e.stopPropagation()}
      onTouchStart={(e) => e.stopPropagation()}
      onTouchMove={(e) => e.stopPropagation()}
      onTouchEnd={(e) => e.stopPropagation()}
      style={{ pointerEvents: 'auto' }}
    >
      {/* 상태 필터 */}
      <div className="flex gap-2 overflow-x-auto pb-2 relative z-20">
        {Object.entries(t.mypage.provide.status).map(([key, label]) => (
          <button
            key={key}
            onClick={(e) => {
              console.log('버튼 클릭됨!!!', key); // 디버깅용 로그
              e.stopPropagation();
              setActiveStatus(key);
            }}
            className={cn(
              "px-3 py-1.5 rounded-lg text-sm whitespace-nowrap",
              "transition-colors duration-200",
              "relative z-30", // z-index 추가
              key === activeStatus
                ? "bg-[#EAFD66]/10 text-[#EAFD66]"
                : "bg-[#1A1A1A] text-gray-400 hover:bg-[#1A1A1A]/80"
            )}
            style={{ pointerEvents: 'auto', touchAction: 'manipulation' }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* 제공 목록 */}
      <div className="space-y-2 max-h-[500px] overflow-y-auto">
        {data.provides.map((provide) => (
          <div
            key={provide.image_doc_id}
            className="bg-[#1A1A1A] rounded-xl p-4"
          >
            {/* 원본 이미지 */}
            <Link
              href={`/details/${provide.image_doc_id}`}
              className="flex gap-4 mb-3"
            >
              <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                <Image
                  src={provide.image_url}
                  alt="Original image"
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                  unoptimized
                />
              </div>
              <div className="flex-1">
                <div className="text-sm text-gray-400 mb-1">원본 이미지</div>
                <div className="text-xs text-gray-500">
                  제공된 이미지
                </div>
              </div>
            </Link>

            {/* 제공한 아이템 목록 */}
            <div className="space-y-2">
              {provide.items?.map((item) => (
                <div
                  key={item.item_doc_id}
                  className="flex gap-3 p-2 rounded-lg bg-black/20"
                >
                  <div className="w-12 h-12 rounded-md overflow-hidden flex-shrink-0">
                    <Image
                      src={item.item_image_url}
                      alt="Item image"
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                      unoptimized
                    />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm text-white">
                      {item.label || "제공된 아이템"}
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5">
                      {item.item_doc_id}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
