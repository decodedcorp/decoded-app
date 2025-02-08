"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { LocaleContext } from "@/lib/contexts/locale-context";
import { langMap, Locale } from "@/lib/lang/locales";
import { StatusModal } from '@/components/ui/modal/status-modal';
import { useStatusStore } from '@/components/ui/modal/status-modal/utils/store';

function GlobalStatusModal() {
  const { isOpen, type, messageKey, title, message, closeStatus } = useStatusStore();

  return (
    <StatusModal
      isOpen={isOpen}
      onClose={closeStatus}
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
