"use client";

import { SearchBar } from "../search/SearchBar";
import { LoginButton } from "./LoginButton";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface NavProps {
  isSearchOpen: boolean;
  onSearchToggle: () => void;
  onLoginClick: () => void;
  onSidebarOpen: () => void;
}

function Nav({
  isSearchOpen,
  onSearchToggle,
  onLoginClick,
  onSidebarOpen,
}: NavProps) {
  return (
    <nav className="w-full flex items-center justify-between px-8">
      <SearchBar onSearch={(query) => console.log(query)} />

      {/* 오른쪽 버튼 */}
      <Link href={"/request"} className="flex items-center gap-4">
        <button
          className={cn(
            "rounded-xl px-7 h-10",
            "bg-[#EAFD66]/90",
            "border-2 border-[#EAFD66]/20",
            "text-black font-semibold",
            "hover:bg-[#EAFD66]",
            "hover:border-[#EAFD66]/40 hover:scale-105",
            "transition-all duration-200 ease-out",
            "shadow-lg shadow-[#EAFD66]/20",
            "text-[15px] tracking-wide"
          )}
        >
          요청하기
        </button>
        <LoginButton />
      </Link>
    </nav>
  );
}

export default Nav;
