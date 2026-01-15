"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { getQueryClient } from "@/lib/react-query/client";
import { ThemeProvider } from "next-themes";

// Supabase 브라우저 클라이언트 초기화 (side-effect import)
import "@/lib/supabase/init";

/**
 * App-level providers wrapper
 *
 * This component wraps the app with React Query's QueryClientProvider
 * and includes the DevTools for development.
 */
export function AppProviders({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        {children}
      </ThemeProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
