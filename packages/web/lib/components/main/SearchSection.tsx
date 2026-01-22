"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import Link from "next/link";

const trendingKeywords = [
  { id: "1", label: "뉴진스 다니엘", href: "/search?q=뉴진스+다니엘" },
  { id: "2", label: "나이키", href: "/search?q=나이키" },
  { id: "3", label: "뉴진스 혜인", href: "/search?q=뉴진스+혜인" },
  { id: "4", label: "블랙핑크 지수", href: "/search?q=블랙핑크+지수" },
  { id: "5", label: "아디다스", href: "/search?q=아디다스" },
  { id: "6", label: "RON ARAD STUDIO", href: "/search?q=RON+ARAD+STUDIO" },
  { id: "7", label: "뉴발란스", href: "/search?q=뉴발란스" },
];

export function SearchSection() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <section className="py-8 md:py-12 px-4 md:px-6 lg:px-8 bg-white">
      <div className="max-w-3xl mx-auto">
        {/* Search Input */}
        <form onSubmit={handleSubmit} className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="아티스트, 브랜드로 검색해보세요"
            className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-full
                     text-base placeholder:text-gray-400
                     focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400
                     transition-colors"
          />
        </form>

        {/* Trending Keywords */}
        <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3">
          {trendingKeywords.map((keyword) => (
            <Link
              key={keyword.id}
              href={keyword.href}
              className="px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-full
                       hover:bg-gray-200 transition-colors"
            >
              {keyword.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
