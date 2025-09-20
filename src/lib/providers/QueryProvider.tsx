'use client';

import React from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const isDevelopment = process.env.NODE_ENV === 'development';

// Create QueryClient instance with aggressive caching for speed
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 적극적인 캐시 전략 - 전체 앱 성능 향상
      staleTime: 15 * 60 * 1000, // 15분 - 대부분의 데이터가 자주 변경되지 않음
      gcTime: 2 * 60 * 60 * 1000, // 2시간 - 메모리에 더 오래 유지하여 빠른 네비게이션

      // 빠른 실패 정책
      retry: (failureCount, error) => {
        // 401, 403, 404 에러는 재시도하지 않음
        if (error instanceof Error) {
          const errorString = error.message.toLowerCase();
          if (errorString.includes('401') || errorString.includes('403') || errorString.includes('404')) {
            return false;
          }
        }
        // 네트워크 에러는 1회만 재시도
        return failureCount < 1;
      },
      retryDelay: 500, // 빠른 재시도

      // 불필요한 리페치 방지 - 캐시 우선 사용
      refetchOnWindowFocus: false,
      refetchOnMount: false, // 캐시된 데이터 즉시 사용
      refetchOnReconnect: false,

      // 백그라운드 업데이트 최적화
      refetchInterval: false,
      refetchIntervalInBackground: false,

      // 성능 최적화 옵션
      notifyOnChangeProps: ['data', 'error'], // 필요한 prop만 구독
    },
    mutations: {
      retry: 0, // 뮤테이션은 재시도하지 않음 (빠른 피드백)
      networkMode: 'online',
    },
  },
});

interface QueryProviderProps {
  children: React.ReactNode;
}

/**
 * React Query Provider component
 * Enables React Query usage throughout the app with optimized caching.
 */
export const QueryProvider: React.FC<QueryProviderProps> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {isDevelopment && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
};
