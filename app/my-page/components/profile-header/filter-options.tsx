'use client';

import { useCallback } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

// 필터 타입
type ContentFilter = 'all' | 'likes' | 'provides' | 'requests';

export default function FilterOptions() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // 현재 활성화된 필터 가져오기
  const activeFilter = (searchParams.get('filter') as ContentFilter) || 'all';

  // 필터 변경 핸들러
  const handleFilterChange = useCallback(
    (filter: ContentFilter) => {
      // 새로운 SearchParams 객체 생성
      const params = new URLSearchParams(searchParams);
      params.set('filter', filter);

      // 라우터로 URL 업데이트
      router.push(`${pathname}?${params.toString()}`);
    },
    [pathname, router, searchParams]
  );

  return (
    <div className="flex flex-col gap-4">
      {/* 콘텐츠 필터링 버튼 */}
      <div className="flex gap-4">
        <button
          onClick={() => handleFilterChange('all')}
          className={`px-4 py-2 rounded ${
            activeFilter === 'all' ? 'bg-zinc-700' : 'bg-zinc-900'
          }`}
        >
          전체
        </button>
        <button
          onClick={() => handleFilterChange('likes')}
          className={`px-4 py-2 rounded ${
            activeFilter === 'likes' ? 'bg-zinc-700' : 'bg-zinc-900'
          }`}
        >
          좋아요
        </button>
        <button
          onClick={() => handleFilterChange('provides')}
          className={`px-4 py-2 rounded ${
            activeFilter === 'provides' ? 'bg-zinc-700' : 'bg-zinc-900'
          }`}
        >
          제공한 아이템
        </button>
        <button
          onClick={() => handleFilterChange('requests')}
          className={`px-4 py-2 rounded ${
            activeFilter === 'requests' ? 'bg-zinc-700' : 'bg-zinc-900'
          }`}
        >
          요청한 아이템
        </button>
      </div>
    </div>
  );
}
