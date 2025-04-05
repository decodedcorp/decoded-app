"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useLocaleContext } from "@/lib/contexts/locale-context";
import { AccountSection } from "./sections/AccountSection";
import Link from "next/link";
import { useMyPageQuery } from "@/lib/hooks/common/useMyPageQuery";
import { cn } from "@/lib/utils/style";
import LogoPng from "@/styles/logos/LogoPng";

// 모달 컨트롤러 커스텀 훅
function useModalController({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isProtectionActive, setIsProtectionActive] = useState<boolean>(false);
  const lastActionTimeRef = useRef<number>(0);
  const prevIsOpenRef = useRef<boolean>(false);

  const handleClose = useCallback(
    (e?: React.MouseEvent) => {
      if (e) {
        e.preventDefault(); // 브라우저 기본 동작 방지
        e.stopPropagation(); // 이벤트 전파 중단
      }

      const now = Date.now();

      if (isProtectionActive) {
        return;
      }

      if (now - lastActionTimeRef.current < 300) {
        return;
      }

      lastActionTimeRef.current = now;

      onClose();
    },
    [onClose, isProtectionActive]
  );

  // 외부에서 강제로 닫힘 감지
  useEffect(() => {
    if (prevIsOpenRef.current && !isOpen) {
      const now = Date.now();
      if (now - lastActionTimeRef.current > 100) {
        // 외부에서 강제로 닫힘 감지
        if (typeof document !== "undefined") {
          // 스크롤 복원 (강제 닫힘 시에도 항상 적용)
          document.body.style.overflow = "";
        }
      }
    }
    prevIsOpenRef.current = isOpen;
  }, [isOpen, isProtectionActive]);

  // 모달 상태 관리
  useEffect(() => {
    const now = Date.now();
    lastActionTimeRef.current = now;

    if (isOpen) {
      setIsVisible(true);
      setIsProtectionActive(true);

      const protectionTimer = setTimeout(() => {
        setIsProtectionActive(false);
      }, 800);

      if (typeof document !== "undefined") {
        document.body.style.overflow = "hidden";
      }

      return () => clearTimeout(protectionTimer);
    } else {
      setIsProtectionActive(true);

      const closeTimer = setTimeout(() => {
        setIsVisible(false);
        setIsProtectionActive(false);

        if (typeof document !== "undefined") {
          document.body.style.overflow = "";
        }
      }, 300);

      // 항상 스크롤을 복원하기 위한 즉시 실행
      if (typeof document !== "undefined") {
        document.body.style.overflow = "";
      }

      return () => clearTimeout(closeTimer);
    }
  }, [isOpen]);

  // 모달 효과에서 제거하지 못한 overflow 설정을 정리하는 클린업 함수
  useEffect(() => {
    return () => {
      // 컴포넌트 언마운트 시 항상 스크롤 복원
      if (typeof document !== "undefined") {
        document.body.style.overflow = "";
      }
    };
  }, []);

  // 전역 이벤트 핸들러 예외 처리 - useModalClose 대응
  useEffect(() => {
    if (isOpen && isVisible) {
      // 모달 내부 클릭을 감지하고 처리하는 핸들러
      const handleGlobalClick = (e: MouseEvent) => {
        // 모달 패널 내부 클릭인지 확인
        const modalPanel = document.getElementById("mypage-modal-panel");
        if (
          modalPanel &&
          (modalPanel === e.target || modalPanel.contains(e.target as Node))
        ) {
          // 이벤트를 취소하지 않고 사용자 정의 플래그만 설정 - 다른 핸들러가 실행되도록 허용
          (e as any).__handled = true;
        }
      };

      // 캡처 단계에서 이벤트 리스너 추가 (가장 먼저 실행되도록)
      document.addEventListener("click", handleGlobalClick, { capture: true });

      return () => {
        document.removeEventListener("click", handleGlobalClick, {
          capture: true,
        });
      };
    }
  }, [isOpen, isVisible]);

  return {
    isVisible,
    isProtectionActive,
    handleClose,
  };
}

// 반응형 스타일 관리 커스텀 훅
function useResponsiveModalStyles() {
  const [windowWidth, setWindowWidth] = useState<number>(
    typeof window !== "undefined" ? window.innerWidth : 0
  );

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);

    if (typeof window !== "undefined") {
      setWindowWidth(window.innerWidth);
      window.addEventListener("resize", handleResize);
    }

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = windowWidth < 768;
  const isTablet = windowWidth >= 768 && windowWidth <= 1025;
  const isDesktop = windowWidth > 1025;

  return {
    windowWidth,
    isMobile,
    isTablet,
    isDesktop,
    styles: {
      width: isMobile ? "100%" : isTablet ? "420px" : "360px",
      height: isMobile ? "100%" : isTablet ? "75vh" : "65vh",
      marginTop: isMobile ? "0" : "48px",
      borderRadius: isMobile ? "0" : "16px",
      minWidth: isMobile ? "100%" : "350px",
      minHeight: isMobile ? "100%" : "500px",
    },
  };
}

interface MypageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout?: () => void;
  onLoginSuccess?: () => void;
}

export function MypageModal({
  isOpen,
  onClose,
  onLogout,
  onLoginSuccess,
}: MypageModalProps) {
  const { t } = useLocaleContext();
  const modalRef = useRef<HTMLDivElement>(null);

  // 커스텀 훅 사용
  const { isVisible, isProtectionActive, handleClose } = useModalController({
    isOpen,
    onClose,
  });
  const { windowWidth, isMobile, styles } = useResponsiveModalStyles();

  // 렌더링 최적화를 위한 포스 리플로우
  useEffect(() => {
    if (isOpen && isVisible && modalRef.current) {
      setTimeout(() => {
        if (modalRef.current) {
          const forceReflow = modalRef.current.offsetHeight;

          if (windowWidth < 1025) {
            modalRef.current.style.opacity = "0.99";
            setTimeout(() => {
              if (modalRef.current) {
                modalRef.current.style.opacity = "1";
              }
            }, 10);
          }
        }
      }, 0);
    }
  }, [isOpen, isVisible, windowWidth]);

  // 모달 외부 클릭 핸들러
  const handleBackgroundClick = useCallback(
    (e: React.MouseEvent) => {
      // 배경 클릭 이벤트만 처리 (실제로 모달 외부 영역을 클릭한 경우만)
      if (e.target === e.currentTarget) {
        handleClose(e);
      }
    },
    [handleClose]
  );

  // 모달이 보이지 않고 열려있지 않으면 아무것도 렌더링하지 않음
  if (!isOpen && !isVisible) {
    return null;
  }

  return (
    <div
      className="mypage-modal-root"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: isOpen ? "auto" : "none",
        zIndex: 100000,
      }}
      onClick={handleBackgroundClick}
    >
      {/* 배경 오버레이 */}
      <div
        className={cn(
          "fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0"
        )}
        style={{
          pointerEvents: "none",
          zIndex: 100000,
        }}
      />

      {/* 모달 패널 - 패딩 및 레이아웃 재조정 */}
      <div
        ref={modalRef}
        id="mypage-modal-panel"
        data-modal-container="true"
        data-no-close-on-click="true"
        className={cn(
          "fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2",
          "flex flex-col",
          "border border-white/10",
          "transition-all duration-300 ease-out",
          "rounded-2xl p-8",
          "w-[90%] max-w-sm h-[550px]",
          "shadow-2xl",
          {
            "opacity-100 scale-100": isOpen && isVisible,
            "opacity-0 scale-95": !isOpen || !isVisible,
          }
        )}
        style={{
          pointerEvents: isOpen ? "auto" : "none",
          zIndex: 100001,
          background: `
            radial-gradient(ellipse at center, rgba(58, 39, 15, 0.4) 0%, rgba(0, 0, 0, 0.9) 70%),
            rgba(10, 10, 10, 0.95)
          `,
          backdropFilter: "blur(10px)",
        }}
      >
        {/* 상단 섹션 (아이콘 + 제목) - 중앙 정렬, 적절한 마진 추가 */}
        <div className="flex flex-col items-center flex-shrink-0 mt-32 mb-auto">
          <LogoPng width={1000} height={28} className="object-contain mb-2" />
        </div>

        <div className="w-full flex-shrink-0 mb-auto">
          <AccountSection
            isOpen={isOpen}
            onClose={handleClose}
            onLogout={onLogout}
            onLoginSuccess={onLoginSuccess}
          />
          <div className="text-center text-xs text-gray-400 space-x-4">
            <Link
              href="/terms-of-service"
              className="hover:text-gray-200 transition-colors"
            >
              {/* t('termsOfService') */}
              Terms of Service
            </Link>
            <span>|</span>
            <Link
              href="/privacy-policy"
              className="hover:text-gray-200 transition-colors"
            >
              {/* t('privacyPolicy') */}
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
