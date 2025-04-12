"use client";

import LogoPng from "@/styles/logos/LogoPng";
import { SearchBar } from "../search/SearchBar";
import { LoginButton } from "./LoginButton";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useLocaleContext } from "@/lib/contexts/locale-context";
import { Menu, User, Search, PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils/style";
import { useState } from "react";
import { useRequestModal } from "@/components/modals/request/hooks/use-request-modal";
import { useLoginModalStore } from "@/components/auth/login-modal/store";

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
  const [isIconLoginModalOpen, setIconLoginModalOpen] = useState(false);
  const { onOpen: openRequestModal, RequestModal } = useRequestModal({
    isRequest: true,
  });

  // 로그인 모달 스토어 사용 - LoginButton 컴포넌트와 같은 스토어 공유
  const {
    isOpen: isLoginModalOpen,
    openLoginModal,
    closeLoginModal,
  } = useLoginModalStore();

  return (
    <nav className="w-full h-16 px-2 lg:px-16 flex items-center justify-center">
      <div className="h-full w-full">
        {/* 모바일 뷰 (sm) */}
        <div className="lg:hidden h-full flex flex-col">
          <div className="h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center">
              <LogoPng
                width={130}
                height={30}
                priority={true}
                className="object-contain my-auto"
              />
            </Link>

            <div className="flex items-center gap-3">
              <button
                onClick={openRequestModal}
                className="p-2 text-gray-400 hover:text-[#EAFD66]"
              >
                <PlusCircle className="w-5 h-5" />
              </button>
              <button
                onClick={onSearchToggle}
                className={cn(
                  "p-2 rounded-full transition-colors duration-200",
                  isSearchOpen
                    ? "text-[#EAFD66] "
                    : "text-gray-400 hover:text-[#EAFD66]"
                )}
              >
                <Search className="w-5 h-5" />
              </button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  // 최근 모달 상태 변경이 있었는지 확인
                  const lastModalToggle =
                    sessionStorage.getItem("LAST_MODAL_TOGGLE");
                  const now = Date.now();

                  if (lastModalToggle) {
                    const lastToggleTime = parseInt(lastModalToggle, 10);
                    // 마지막 토글 후 800ms 이내의 클릭은 무시
                    if (now - lastToggleTime < 800) {
                      console.log(
                        "[Nav] 모달 상태 최근 변경됨, User 아이콘 클릭 무시"
                      );
                      return;
                    }
                  }

                  console.log("[Nav] User 아이콘 클릭, 로그인 모달 열기");
                  // 모달 토글 시간 기록
                  sessionStorage.setItem("LAST_MODAL_TOGGLE", now.toString());
                  openLoginModal();
                }}
                className={cn(
                  "transition-colors duration-200",
                  isLoginModalOpen
                    ? "text-[#EAFD66] "
                    : "text-gray-400 hover:text-[#EAFD66]"
                )}
              >
                <User className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* 모바일 검색바 - 슬라이드 애니메이션 */}
          <div
            className={cn(
              "absolute top-16 left-0 right-0 z-20",
              "transition-all duration-200 ease-in-out",
              isSearchOpen ? "h-16 opacity-100" : "h-0 opacity-0"
            )}
          >
            <div className="px-4 py-3">
              <SearchBar onSearch={(query) => console.log(query)} />
            </div>
          </div>
        </div>

        {/* 데스크톱 뷰 (lg) */}
        <div className="hidden lg:grid h-full grid-cols-[240px_1fr_240px] items-center gap-8">
          <Link href="/" className="flex items-center">
            <LogoPng
              width={130}
              height={30}
              priority={true}
              className="object-contain my-auto"
            />
          </Link>

          <div className="flex justify-center">
            <div className="w-full max-w-2xl">
              <SearchBar onSearch={(query) => console.log(query)} />
            </div>
          </div>

          <div className="flex items-center justify-end gap-6">
            <button
              onClick={openRequestModal}
              className={cn(
                "text-sm text-gray-400 hover:text-[#EAFD66]",
                "transition-colors duration-200"
              )}
            >
              {t.header.nav.request}
            </button>
            <LoginButton />
          </div>
        </div>
      </div>

      {/* 요청 모달 렌더링 */}
      {RequestModal}
    </nav>
  );
}

export default Nav;
