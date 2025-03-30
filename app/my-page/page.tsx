'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import ProfileHeader from './components/profile-header';
import MasonryContentsGrid from './components/contents-grid/masonry-contents-grid';
import {
  useMyPageLikesImage,
  useMyPageProvides,
  useMyPageRequests,
  useInfiniteMyPageLikesImage,
  useInfiniteMyPageProvides,
  useInfiniteMyPageRequests,
} from '@/lib/hooks/mypage';
import { ContentFilter, MasonryItem } from './types';
import { isDataLoading, loadFilteredData, loadMoreFilteredData } from './utils';

export default function MyPage() {
  const [items, setItems] = useState<MasonryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [initialNextId, setInitialNextId] = useState<string | null>(null);
  const searchParams = useSearchParams();

  // URL에서 필터 파라미터 가져오기
  const activeFilter = (searchParams.get('filter') as ContentFilter) || 'all';

  // 사용된 next_id 추적을 초기화하는 함수
  const resetNextIdTracking = () => {
    // 모듈에서 직접 정의한 변수를 초기화할 수 없으므로, 다른 접근 방식 필요
    // 여기서는 데이터 로더에 함수를 노출하는 방식을 사용
    // utils/data-loaders에서 외부 초기화 함수를 제공해야 함
    if (typeof window !== 'undefined') {
      // 전역 이벤트로 초기화 요청 발행
      const event = new CustomEvent('reset-next-id-tracking', { detail: { filter: activeFilter } });
      window.dispatchEvent(event);
      console.log(`[마이페이지] next_id 추적 초기화 이벤트 발행: ${activeFilter} 필터`);
    }
  };

  // 필터 변경 시 next_id 추적 초기화
  useEffect(() => {
    resetNextIdTracking();
  }, [activeFilter]);

  // 쿼리 훅 사용
  const likesQuery = useMyPageLikesImage();
  const providesQuery = useMyPageProvides();
  const requestsQuery = useMyPageRequests();

  // 무한 스크롤을 위한 훅
  const infiniteLikesQuery = useInfiniteMyPageLikesImage();
  const infiniteProvidesQuery = useInfiniteMyPageProvides();
  const infiniteRequestsQuery = useInfiniteMyPageRequests();

  // 쿼리 결과들을 하나의 객체로 모음
  const queries = {
    likesQuery,
    providesQuery,
    requestsQuery,
    infiniteLikesQuery,
    infiniteProvidesQuery,
    infiniteRequestsQuery,
  };

  // 데이터 로드 및 변환 처리
  useEffect(() => {
    setLoading(true);

    // 모든 필요한 쿼리가 로딩 완료되었는지 확인
    const isLoading = isDataLoading(activeFilter, queries);

    if (!isLoading) {
      // 필터에 맞는 데이터 로드
      const newItems = loadFilteredData(activeFilter, queries);
      setItems(newItems);
      
      // 필터에 따라 초기 next_id 설정
      let nextId: string | null = null;
      
      if (activeFilter === 'all') {
        // all 필터의 경우 첫 번째 사용 가능한 next_id 사용
        if (likesQuery.data?.data?.next_id) {
          nextId = likesQuery.data.data.next_id;
          console.log('all 필터: likes next_id 사용:', nextId);
        } else if (providesQuery.data?.data?.next_id) {
          nextId = providesQuery.data.data.next_id;
          console.log('all 필터: provides next_id 사용:', nextId);
        } else if (requestsQuery.data?.data?.next_id) {
          nextId = requestsQuery.data.data.next_id;
          console.log('all 필터: requests next_id 사용:', nextId);
        }
      } else {
        // 특정 필터의 경우 해당 쿼리의 next_id 사용
        switch (activeFilter) {
          case 'likes':
            nextId = likesQuery.data?.data?.next_id || null;
            console.log('likes 필터: next_id 설정:', nextId);
            break;
          case 'provides':
            nextId = providesQuery.data?.data?.next_id || null;
            console.log('provides 필터: next_id 설정:', nextId);
            break;
          case 'requests':
            nextId = requestsQuery.data?.data?.next_id || null;
            console.log('requests 필터: next_id 설정:', nextId);
            break;
        }
      }
      
      // 초기 next_id 업데이트
      console.log(`초기 next_id 설정: "${nextId}" (필터: ${activeFilter})`);
      setInitialNextId(nextId);
      setLoading(false);
    }
  }, [
    activeFilter,
    likesQuery.data,
    likesQuery.isLoading,
    providesQuery.data,
    providesQuery.isLoading,
    requestsQuery.data,
    requestsQuery.isLoading,
  ]);

  // 추가 아이템 로드 함수 (무한 스크롤용)
  const loadMoreItems = async (
    nextId: string | null
  ): Promise<{
    items: MasonryItem[];
    nextId: string | null;
  }> => {
    try {
      console.log(`[마이페이지] loadMoreItems 호출됨 - nextId: "${nextId}", 현재 필터: ${activeFilter}`);
      
      // next_id가 명시적으로 null인 경우에도 로그 출력
      if (nextId === null) {
        console.log('[마이페이지] 경고: nextId가 null인 상태로 loadMoreItems가 호출됨');
        
        // 디버깅: 각 쿼리의 hasNextPage 상태 확인
        console.log('[마이페이지] 쿼리 상태:', {
          likesHasNextPage: infiniteLikesQuery.hasNextPage,
          providesHasNextPage: infiniteProvidesQuery.hasNextPage,
          requestsHasNextPage: infiniteRequestsQuery.hasNextPage,
          likesIsFetching: infiniteLikesQuery.isFetching,
          providesIsFetching: infiniteProvidesQuery.isFetching,
          requestsIsFetching: infiniteRequestsQuery.isFetching,
        });
      }
      
      // 호출하기 전 next_id를 캐치해둠 (비교용)
      const requestedNextId = nextId;
      
      // 필터에 맞는 다음 페이지 데이터 로드
      const result = await loadMoreFilteredData(
        activeFilter,
        items,
        nextId,
        queries
      );

      console.log(`[마이페이지] loadMoreItems 결과:`, {
        itemCount: result.items.length,
        requestedNextId: requestedNextId,
        returnedNextId: result.nextId,
        isSameNextId: result.nextId === requestedNextId && result.nextId !== null
      });

      // 데이터가 없는데 요청한 next_id와 반환된 next_id가 동일한 경우 처리
      if (result.items.length === 0 && result.nextId === requestedNextId && result.nextId !== null) {
        console.log(`[마이페이지] 경고: 아이템 없이 동일한 next_id가 반환되었습니다. 무한 루프 방지를 위해 nextId를 null로 설정합니다.`);
        return { items: [], nextId: null };
      }

      return result;
    } catch (error) {
      console.error('[마이페이지] Error loading more items:', error);
      return { items: [], nextId: null };
    }
  };

  // 현재 로딩 상태 확인
  const isLoading = isDataLoading(activeFilter, queries);

  return (
    <div className="min-h-screen bg-black text-white pt-24 px-16">
      <ProfileHeader />

      {/* 로딩 표시 */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
        </div>
      ) : (
        /* 마소닉 그리드 컴포넌트 */
        <section className="mt-8">
          <MasonryContentsGrid
            initialItems={items}
            loadMore={loadMoreItems}
            itemWidth={280}
            gap={20}
            initialNextId={initialNextId}
          />
        </section>
      )}
    </div>
  );
}
