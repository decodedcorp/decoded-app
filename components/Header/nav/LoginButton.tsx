"use client";

import { MypageModal } from "./modal/MypageModal";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/hooks/features/auth/useAuth";
import useModalClose from "@/lib/hooks/common/useModalClose";
import { cn } from "@/lib/utils/style";
import { useLocaleContext } from "@/lib/contexts/locale-context";
import { useLoginModalStore } from "@/components/auth/login-modal/store";

export function LoginButton() {
  const { t } = useLocaleContext();
  const [isFirstRender, setIsFirstRender] = useState(true);
  const { isLogin, isInitialized, isLoading, checkLoginStatus } = useAuth();
  const { isOpen: isLoginModalOpen, openLoginModal, closeLoginModal } = useLoginModalStore();

  const { modalRef } = useModalClose({
    onClose: closeLoginModal,
    isOpen: isLoginModalOpen,
  });

  // 첫 렌더링 이후 트랜지션 활성화
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsFirstRender(false);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // 주기적으로 로그인 상태 체크
  useEffect(() => {
    // 초기 체크
    checkLoginStatus();

    // 1초마다 체크
    const intervalId = setInterval(checkLoginStatus, 1000);

    // 메시지 이벤트 리스너
    const handleMessage = (event: MessageEvent) => {
      if (event.origin === window.location.origin && event.data?.id_token) {
        console.log("Token received, closing modal");
        closeLoginModal();
      }
    };
    
    window.addEventListener('message', handleMessage);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener('message', handleMessage);
    };
  }, [checkLoginStatus, closeLoginModal]);

  const handleDisconnect = () => {
    handleDisconnect();
    closeLoginModal();  // 모달 닫기 추가
  };

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
          "transition-all duration-200": !isFirstRender,
          "text-[#EAFD66]": isLoginModalOpen,
          "text-gray-600 hover:text-[#EAFD66]": !isLoginModalOpen,
          "animate-pulse": isLoading,
          "opacity-70": !isInitialized,
        })}
        onClick={() => !isLoading && openLoginModal()}
      >
        {buttonText}
      </span>
      {!isLoading && (
        <MypageModal
          isOpen={isLoginModalOpen}
          onClose={closeLoginModal}
        />
      )}
    </div>
  );
}
