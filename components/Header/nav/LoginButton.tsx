"use client";

import { LoginModal } from "./modal/LoginModal";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/hooks/features/auth/useAuth";
import useModalClose from "@/lib/hooks/common/useModalClose";
import { cn } from "@/lib/utils/style";
import { useLocaleContext } from "@/lib/contexts/locale-context";

export function LoginButton() {
  const { t } = useLocaleContext();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isFirstRender, setIsFirstRender] = useState(true);
  const { isLogin, isInitialized, isLoading } = useAuth();

  const { modalRef } = useModalClose({
    onClose: () => setIsLoginModalOpen(false),
    isOpen: isLoginModalOpen,
  });

  // 첫 렌더링 이후 트랜지션 활성화
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsFirstRender(false);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // 로딩 상태에 따른 텍스트 표시
  const buttonText = (() => {
    if (!isInitialized) return t.header.nav.login.button.text;
    if (isLoading) return t.header.nav.login.button.loading;
    if (isLogin) return t.header.nav.login.button.myPage;
    return t.header.nav.login.button.text;
  })();

  return (
    <div ref={modalRef} className="relative flex items-center gap-3">
      <span
        className={cn("text-xs md:text-sm", "cursor-pointer", {
          "transition-all duration-200": !isFirstRender, // 첫 렌더링 이후에만 트랜지션 적용
          "text-[#EAFD66]": isLoginModalOpen,
          "text-gray-600 hover:text-[#EAFD66]": !isLoginModalOpen,
          "animate-pulse": isLoading,
          "opacity-70": !isInitialized,
        })}
        onClick={() => !isLoading && setIsLoginModalOpen(true)}
      >
        {buttonText}
      </span>
      {!isLoading && (
        <LoginModal
          isOpen={isLoginModalOpen}
          onClose={() => setIsLoginModalOpen(false)}
        />
      )}
    </div>
  );
}
