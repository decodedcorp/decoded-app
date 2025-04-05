"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { LocaleContext } from "@/lib/contexts/locale-context";
import { langMap, Locale } from "@/lib/lang/locales";
import { StatusModal } from "@/components/ui/modal/status-modal";
import { useStatusStore } from "@/components/ui/modal/status-modal/utils/store";
import { useLoginModalStore } from "@/components/auth/login-modal/store";
import { Toaster } from "sonner";

function GlobalStatusModal() {
  const { isOpen, type, messageKey, title, message, closeStatus } =
    useStatusStore();
  const { openLoginModal } = useLoginModalStore();

  const handleStatusClose = () => {
    closeStatus();
    if (type === "warning" && messageKey === "login") {
      console.log(
        "[GlobalStatusModal] Login warning closed, opening login modal"
      );
      setTimeout(() => {
        openLoginModal();
      }, 300);
    }
  };

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
}

interface ProvidersProps {
  children: React.ReactNode;
  locale?: Locale;
}

export function Providers({ children, locale = "en" }: ProvidersProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: (failureCount, error: any) => {
              if (error?.code === "NETWORK_ERROR" && failureCount < 2) {
                return true;
              }

              if (error?.status === 401) {
                return false;
              }

              return failureCount < 1;
            },
            retryDelay: (attemptIndex) =>
              Math.min(1000 * 2 ** attemptIndex, 30000),
            staleTime: 5 * 60 * 1000,
            gcTime: 10 * 60 * 1000,
          },
        },
      })
  );

  const localeValue = {
    locale,
    t: langMap[locale],
  };

  return (
    <QueryClientProvider client={queryClient}>
      <LocaleContext.Provider value={localeValue}>
        {children}
        <GlobalStatusModal />
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: "#333",
              color: "white",
              border: "1px solid #444",
            },
            duration: 3000,
          }}
        />
      </LocaleContext.Provider>
    </QueryClientProvider>
  );
}
