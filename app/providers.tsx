"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, useMemo, useCallback, memo } from "react";
import { LocaleContext } from "@/lib/contexts/locale-context";
import { langMap, Locale } from "@/lib/lang/locales";
import { StatusModal } from "@/components/ui/modal/status-modal";
import { useStatusStore } from "@/components/ui/modal/status-modal/utils/store";
import { useLoginModalStore } from "@/components/auth/login-modal/store";
import { Toaster } from "sonner";

// 최적화된 글로벌 상태 모달 컴포넌트
const GlobalStatusModal = memo(function GlobalStatusModal() {
  const { isOpen, type, messageKey, title, message, closeStatus } =
    useStatusStore();
  const { openLoginModal } = useLoginModalStore();

  // 상태 핸들러 메모화
  const handleStatusClose = useCallback(() => {
    closeStatus();
    if (type === "warning" && messageKey === "login") {
      console.log(
        "[GlobalStatusModal] Login warning closed, opening login modal"
      );
      setTimeout(() => {
        openLoginModal();
      }, 300);
    }
  }, [closeStatus, type, messageKey, openLoginModal]);

  return (
    <StatusModal
      isOpen={isOpen}
      onClose={handleStatusClose}
      type={type}
      messageKey={messageKey}
      title={title}
      message={message}
    />
  );
});

// 토스터 설정 메모화
const toasterConfig = {
  position: "top-center" as const,
  toastOptions: {
    style: {
      background: "#333",
      color: "white",
      border: "1px solid #444",
    },
    duration: 3000,
  },
};

interface ProvidersProps {
  children: React.ReactNode;
  locale?: Locale;
}

export const Providers = memo(function Providers({ 
  children, 
  locale = "en" 
}: ProvidersProps) {
  // QueryClient 인스턴스 메모화 (한 번만 생성)
  const [queryClient] = useState(() => {
    return new QueryClient({
      defaultOptions: {
        queries: {
          retry: (failureCount, error: any) => {
            // 네트워크 오류는 최대 2번 재시도
            if (error?.code === "NETWORK_ERROR" && failureCount < 2) {
              return true;
            }

            // 인증 오류는 재시도하지 않음
            if (error?.status === 401) {
              return false;
            }

            // 기타 오류는 1번만 재시도
            return failureCount < 1;
          },
          retryDelay: (attemptIndex) =>
            Math.min(1000 * 2 ** attemptIndex, 30000),
          staleTime: 5 * 60 * 1000, // 5분
          gcTime: 10 * 60 * 1000, // 10분 (이전 cacheTime)
          refetchOnWindowFocus: false, // 윈도우 포커스시 자동 refetch 비활성화 (성능 개선)
        },
        mutations: {
          retry: 1, // 뮤테이션도 1번 재시도
        },
      },
    });
  });

  // Locale context 값 메모화
  const localeValue = useMemo(() => ({
    locale,
    t: langMap[locale],
  }), [locale]);

  return (
    <QueryClientProvider client={queryClient}>
      <LocaleContext.Provider value={localeValue}>
        {children}
        <GlobalStatusModal />
        <Toaster {...toasterConfig} />
      </LocaleContext.Provider>
    </QueryClientProvider>
  );
});

// 개발 환경에서 디스플레이 네임 설정
if (process.env.NODE_ENV === 'development') {
  Providers.displayName = 'Providers';
  GlobalStatusModal.displayName = 'GlobalStatusModal';
}
