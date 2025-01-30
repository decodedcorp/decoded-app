"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { LocaleContext } from "@/lib/contexts/locale-context";
import { langMap, Locale } from "@/lib/lang/locales";

interface ProvidersProps {
  children: React.ReactNode;
  locale?: Locale;
}

export function Providers({ children, locale = "en" }: ProvidersProps) {
  const [queryClient] = useState(() => new QueryClient());

  const localeValue = {
    locale,
    t: langMap[locale],
  };

  return (
    <QueryClientProvider client={queryClient}>
      <LocaleContext.Provider value={localeValue}>
        {children}
      </LocaleContext.Provider>
    </QueryClientProvider>
  );
}
