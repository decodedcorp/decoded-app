"use client";

import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils/style";
import { pretendardMedium, pretendardRegular } from "@/lib/constants/fonts";
import { Clock, Search, TrendingUp, X } from "lucide-react";
import Link from "next/link";
import { useSearchHistory } from "@/lib/hooks/common/useSearchHistory";
import { networkManager } from "@/lib/network/network";

interface SearchResult {
  id: string;
  name: string;
  decodedCount: number;
}

interface SearchModalProps {
  isOpen: boolean;
  results?: SearchResult[];
  onClose: () => void;
  searchQuery: string;
  onSearchReset: () => void;
}

export function SearchModal({
  isOpen,
  onClose,
  onSearchReset,
}: SearchModalProps) {
  const { history, clearHistory } = useSearchHistory();
  const [trendingKeywords, setTrendingKeywords] = useState<string[]>([]);

  useEffect(() => {
    let isCached = false;

    const fetchTrendingKeywords = async () => {
      if (trendingKeywords.length > 0 || !isOpen) return;

      try {
        const response = await networkManager.request(
          "metrics/trending/keywords",
          "GET"
        );
        if (response.status_code === 200) {
          setTrendingKeywords(response.data);
          isCached = true;
        }
      } catch (error) {
        console.error("Failed to fetch trending keywords:", error);
      }
    };

    if (isOpen && !isCached) {
      fetchTrendingKeywords();
    }
  }, [isOpen, trendingKeywords.length]);

  const handleSearchClick = () => {
    onSearchReset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="absolute left-0 right-0 top-[calc(100%+12px)] bg-[#171717] rounded-2xl overflow-hidden shadow-2xl border border-white/5">
      <div className="p-8">
        {/* 최근 검색어 섹션 */}
        {history.length > 0 && (
          <div className="space-y-4 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-white/80/40" />
                <span
                  className={cn(
                    pretendardMedium.className,
                    "text-sm text-white/80/80"
                  )}
                >
                  최근 검색어
                </span>
              </div>
              <button
                onClick={clearHistory}
                className="text-xs text-white/80/40 hover:text-white/80/60 transition-colors px-3 py-1.5 rounded-full hover:bg-white/5"
              >
                전체 삭제
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {history.map((item) => (
                <Link
                  key={item.timestamp}
                  href={`/search?q=${encodeURIComponent(item.keyword)}`}
                  onClick={handleSearchClick}
                  className="group flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-all"
                >
                  <Search className="w-4 h-4 text-white/80/20 group-hover:text-white/80/40 transition-colors" />
                  <span
                    className={cn(
                      pretendardRegular.className,
                      "text-sm text-white/80/60 group-hover:text-white/80/80 transition-colors"
                    )}
                  >
                    {item.keyword}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* 인기 검색어 섹션 */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#EAFD66]" />
            <span
              className={cn(
                pretendardMedium.className,
                "text-sm text-white/80/80"
              )}
            >
              인기 검색어
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {trendingKeywords.slice(0, 4).map((keyword, index) => (
              <Link
                href={`/search?q=${encodeURIComponent(keyword)}`}
                onClick={handleSearchClick}
                key={index}
                className="group flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-all"
              >
                <span
                  className={cn(
                    pretendardMedium.className,
                    "text-lg min-w-[24px]",
                    index < 3 ? "text-[#EAFD66]" : "text-white/80/20"
                  )}
                >
                  {index + 1}
                </span>
                <span
                  className={cn(
                    pretendardRegular.className,
                    "text-sm text-white/80/60 group-hover:text-white/80/80 transition-colors"
                  )}
                >
                  {keyword}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* 닫기 버튼 */}
      <button
        onClick={onClose}
        className="absolute right-5 top-3 text-white/80/40 hover:text-white/80/60 transition-colors"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
}
