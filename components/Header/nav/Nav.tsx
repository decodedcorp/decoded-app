"use client";

import Logo from "@/styles/logos/LogoSvg";
import { SearchBar } from "../search/SearchBar";
import { LoginButton } from "./LoginButton";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useLocaleContext } from "@/lib/contexts/locale-context";
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
  const { t } = useLocaleContext();
  return (
    <nav className="w-full h-16">
      <div className="h-full mx-auto container">
        <div className="h-full grid grid-cols-[240px_1fr_240px] items-center gap-8">
          {/* 로고 영역 */}
          <Link href="/" className="flex items-center">
            <Logo />
          </Link>

          {/* 검색바 영역 */}
          <div className="flex justify-center">
            <div className="w-full max-w-2xl">
              <SearchBar onSearch={(query) => console.log(query)} />
            </div>
          </div>

          {/* 버튼 영역 */}
          <div className="flex items-center justify-end gap-4">
            <Link
              href="/request"
              className="text-xs md:text-sm text-gray-600 hover:text-[#EAFD66] transition-colors duration-200"
            >
              {t.header.nav.request}
            </Link>
            <LoginButton />
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Nav;
