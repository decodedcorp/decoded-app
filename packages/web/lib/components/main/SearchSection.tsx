"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { useSearchStore } from "@/lib/stores/searchStore";

const trendingKeywords = [
  { id: "1", label: "뉴진스 다니엘" },
  { id: "2", label: "나이키" },
  { id: "3", label: "뉴진스 혜인" },
  { id: "4", label: "블랙핑크 지수" },
  { id: "5", label: "아디다스" },
  { id: "6", label: "RON ARAD STUDIO" },
  { id: "7", label: "뉴발란스" },
];

export function SearchSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const { setQuery, setDebouncedQuery } = useSearchStore();

  const handleSearch = (query: string) => {
    if (query.trim()) {
      setQuery(query.trim());
      setDebouncedQuery(query.trim());
      router.push("/explore");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(searchQuery);
  };

  const handleKeywordClick = (keyword: string) => {
    handleSearch(keyword);
  };

  return (
    <section className="py-8 md:py-12 px-4 md:px-6 lg:px-8 bg-background">
      <div className="max-w-3xl mx-auto">
        {/* Search Input */}
        <form onSubmit={handleSubmit} className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="아티스트, 브랜드로 검색해보세요"
            className="w-full pl-12 pr-4 py-4 bg-muted border border-border rounded-full
                     text-base text-foreground placeholder:text-muted-foreground
                     focus:outline-none focus:border-ring focus:ring-1 focus:ring-ring
                     transition-colors"
          />
        </form>

        {/* Trending Keywords */}
        <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3">
          {trendingKeywords.map((keyword) => (
            <button
              key={keyword.id}
              type="button"
              onClick={() => handleKeywordClick(keyword.label)}
              className="px-4 py-2 bg-muted text-muted-foreground text-sm rounded-full
                       hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              {keyword.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
