"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SearchModal } from "./SearchModal";
import { cn } from "@/lib/utils/style";
import { pretendardRegular } from "@/lib/constants/fonts";
import { Search } from "lucide-react";
import { useLocaleContext } from "@/lib/contexts/locale-context";

export function SearchBar({ onSearch }: { onSearch: (query: string) => void }) {
  const { t } = useLocaleContext();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setIsModalOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setIsModalOpen(false);
    }
  };

  return (
    <div className="relative w-full max-w-[460px] mx-auto" ref={modalRef}>
      <form onSubmit={handleSearch}>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <input
            type="text"
            placeholder={t.header.search.placeholder}
            className={cn(
              pretendardRegular.className,
              "w-full bg-[#222222] rounded-xl pl-10 pr-4 py-2.5 text-sm",
              "text-white placeholder-white/40",
              "focus:outline-none focus:ring-1 focus:ring-white/20"
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
      />
    </div>
  );
}
