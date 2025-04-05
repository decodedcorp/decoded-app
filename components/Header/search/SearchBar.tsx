"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SearchModal } from "./SearchModal";
import { cn } from "@/lib/utils/style";
import { pretendardRegular } from "@/lib/constants/fonts";
import { Search } from "lucide-react";
import { useLocaleContext } from "@/lib/contexts/locale-context";
import { useSearchHistory } from "@/lib/hooks/common/useSearchHistory";

export function SearchBar({ onSearch }: { onSearch: (query: string) => void }) {
  const { t } = useLocaleContext();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const { addToHistory } = useSearchHistory();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsModalOpen(false);
      }
    }

    if (isModalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isModalOpen]);

  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsModalOpen(false);
      }
    }

    if (isModalOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isModalOpen]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      await addToHistory(searchQuery);
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setIsModalOpen(false);
    }
  };

  return (
    <div
      className="relative w-full lg:max-w-[460px] md:max-w-3xl sm:max-w-full mx-auto"
      ref={containerRef}
    >
      <form onSubmit={handleSearch}>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder={t.header.search.placeholder}
            className={cn(
              pretendardRegular.className,
              "w-full bg-[#222222] rounded-xl pl-10 pr-4 py-2.5 text-sm",
              "text-white/80 placeholder-white/40",
              "focus:outline-none focus:ring-1 focus:ring-white/20",
              "caret-[#eafd66]"
            )}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsModalOpen(true)}
          />
        </div>
      </form>
      <SearchModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        searchQuery={searchQuery}
        onSearchReset={() => setSearchQuery("")}
      />
    </div>
  );
}
