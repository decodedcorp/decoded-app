"use client";

import React from "react";
import { cn } from "@/lib/utils/style";
import { pretendardMedium, pretendardRegular } from "@/lib/constants/fonts";
import { X } from "lucide-react";
import Link from "next/link";
import { useSearchHistory } from "@/lib/hooks/common/useSearchHistory";
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
}

// 모킹 데이터 - 실제 구현시 API로 대체
const MOCK_TRENDING_KEYWORDS = [
  { id: "1", keyword: "나이키 덩크", rank: 1, count: 128 },
  { id: "2", keyword: "스투시 후드", rank: 2, count: 98 },
  { id: "3", keyword: "아더에러 니트", rank: 3, count: 89 },
  { id: "4", keyword: "메종키츠네", rank: 4, count: 76 },
  { id: "5", keyword: "아크테릭스", rank: 5, count: 67 },
  { id: "6", keyword: "톰브라운", rank: 6, count: 55 },
  { id: "7", keyword: "준지", rank: 7, count: 45 },
  { id: "8", keyword: "아미", rank: 8, count: 34 },
  { id: "9", keyword: "메종마르지엘라", rank: 9, count: 28 },
  { id: "10", keyword: "아워레가시", rank: 10, count: 23 },
];

export function SearchModal({
  isOpen,
  onClose,
  searchQuery,
}: SearchModalProps) {
  const { history, clearHistory } = useSearchHistory();
  if (!isOpen) return null;

  return (
    <div className="absolute left-0 right-0 top-[calc(100%+12px)] bg-[#171717] rounded-2xl overflow-hidden shadow-lg border border-zinc-800/50">
      <div className="p-6">
        {/* 최근 검색어 */}
        {history.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <div
                className={cn(
                  pretendardMedium.className,
                  "text-sm text-white/80"
                )}
              >
                내가 찾아본
              </div>
              <button
                onClick={clearHistory}
                className="text-sm text-white/40 hover:text-white/60 transition-colors"
              >
                전체 삭제
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {history.map((item) => (
                <Link
                  key={item.timestamp}
                  href={`/search?q=${encodeURIComponent(item.keyword)}`}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors"
                >
                  <span
                    className={cn(
                      pretendardRegular.className,
                      "text-sm text-white/80"
                    )}
                  >
                    {item.keyword}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-6">
          <div
            className={cn(pretendardMedium.className, "text-sm text-white/80")}
          >
            검색 기록
          </div>
          <button
            onClick={onClose}
            className="text-white/40 hover:text-white/60 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* 최근 검색어 */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-white/40 text-sm mb-3">
            지금 인기있는 키워드
          </div>

          {/* 인기 검색어 그리드 */}
          <div className="grid grid-cols-2 gap-4">
            {MOCK_TRENDING_KEYWORDS.map((item) => (
              <Link
                href={`/search?q=${encodeURIComponent(item.keyword)}`}
                key={item.id}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 cursor-pointer transition-colors"
              >
                <span
                  className={cn(
                    pretendardMedium.className,
                    "text-lg",
                    item.rank <= 3 ? "text-[#EAFD66]" : "text-white/20"
                  )}
                >
                  {item.rank}
                </span>
                <div className="flex flex-col">
                  <span
                    className={cn(
                      pretendardRegular.className,
                      "text-sm text-white/80"
                    )}
                  >
                    {item.keyword}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* 전체 삭제 버튼 */}
        <div className="flex justify-end">
          <button className="text-sm text-white/40 hover:text-white/60 transition-colors">
            전체 삭제
          </button>
        </div>
      </div>
    </div>
  );
}
