"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { LocaleContext } from "@/lib/contexts/locale-context";
import { langMap, Locale } from "@/lib/lang/locales";
import { StatusModal } from '@/components/ui/modal/status-modal';
import { useStatusStore } from '@/components/ui/modal/status-modal/utils/store';
import { useLoginModalStore } from '@/components/auth/login-modal/store';

function GlobalStatusModal() {
  const { isOpen, type, messageKey, title, message, closeStatus } = useStatusStore();
  const { openLoginModal } = useLoginModalStore();

  const handleStatusClose = () => {
    closeStatus();
    if (type === 'warning' && messageKey === 'login') {
      console.log('[GlobalStatusModal] Login warning closed, opening login modal');
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
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        refetchOnWindowFocus: false,
      },
    },
  }));

  const localeValue = {
    locale,
    t: langMap[locale],
  };

  return (
    <QueryClientProvider client={queryClient}>
      <LocaleContext.Provider value={localeValue}>
        {children}
        <GlobalStatusModal />
      </LocaleContext.Provider>
    </QueryClientProvider>
  );
}
