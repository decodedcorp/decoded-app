import { ContentFilter, MasonryItem, LoadDataResult } from '../types';
import {
  mapLikesToMasonryItems,
  mapProvidesToMasonryItems,
  mapRequestsToMasonryItems,
} from './mappers';

import { UseQueryResult, UseInfiniteQueryResult } from '@tanstack/react-query';

// 쿼리 결과 타입 간소화
type QueryResults = {
  likesQuery: UseQueryResult<any>;
  providesQuery: UseQueryResult<any>;
  requestsQuery: UseQueryResult<any>;
  infiniteLikesQuery: UseInfiniteQueryResult<any>;
  infiniteProvidesQuery: UseInfiniteQueryResult<any>;
  infiniteRequestsQuery: UseInfiniteQueryResult<any>;
};

// 중복 next_id 추적을 위한 Set
const usedNextIds = new Set<string>();

// next_id가 반복되는 횟수를 추적
const repeatedNextIds = new Map<string, number>();

// 최대 허용 반복 횟수 (같은 next_id가 이 횟수만큼 반환되면 더 이상 요청하지 않음)
const MAX_REPEATED_NEXTID = 3;

// 초기화 이벤트 리스너 등록 (클라이언트 측에서만 실행)
if (typeof window !== 'undefined') {
  window.addEventListener('reset-next-id-tracking', (event: Event) => {
    const customEvent = event as CustomEvent;
    const filter = customEvent.detail?.filter || 'all';
    console.log(`[data-loaders] next_id 추적 초기화: ${filter} 필터`);
    usedNextIds.clear();
    repeatedNextIds.clear(); // 반복 추적도 초기화
  });
}

/**
 * 특정 필터에 대한 로딩 상태를 확인하는 함수
 */
export function isDataLoading(
  filter: ContentFilter,
  {
    likesQuery,
    providesQuery,
    requestsQuery,
  }: Pick<QueryResults, 'likesQuery' | 'providesQuery' | 'requestsQuery'>
): boolean {
  // 전체 데이터를 불러올 때는 모든 쿼리의 로딩 상태 확인
  if (filter === 'all') {
    return (
      likesQuery.isLoading || providesQuery.isLoading || requestsQuery.isLoading
    );
  }

  // 특정 필터에 대한 로딩 상태만 확인
  switch (filter) {
    case 'likes':
      return likesQuery.isLoading;
    case 'provides':
      return providesQuery.isLoading;
    case 'requests':
      return requestsQuery.isLoading;
    default:
      return false;
  }
}

/**
 * 현재 필터에 따라 데이터를 가져와 MasonryItem 배열로 변환하는 함수
 */
export function loadFilteredData(
  filter: ContentFilter,
  {
    likesQuery,
    providesQuery,
    requestsQuery,
  }: Pick<QueryResults, 'likesQuery' | 'providesQuery' | 'requestsQuery'>
): MasonryItem[] {
  let newItems: MasonryItem[] = [];
  let nextKey = 0;

  if (filter === 'all') {
    // 모든 데이터를 합쳐서 반환
    if (likesQuery.data) {
      const likes = likesQuery.data.data.likes || [];
      const likesItems = mapLikesToMasonryItems(likes, nextKey, 0);
      nextKey += likesItems.length;
      newItems = [...newItems, ...likesItems];
    }

    if (providesQuery.data) {
      const provides = providesQuery.data.data.provides || [];
      const providesItems = mapProvidesToMasonryItems(provides, nextKey, 0);
      nextKey += providesItems.length;
      newItems = [...newItems, ...providesItems];
    }

    if (requestsQuery.data) {
      const requests = requestsQuery.data.data.requests || [];
      const requestsItems = mapRequestsToMasonryItems(requests, nextKey, 0);
      newItems = [...newItems, ...requestsItems];
    }

    return newItems;
  }

  // 특정 필터에 대한 데이터만 반환
  switch (filter) {
    case 'likes':
      if (likesQuery.data) {
        const likes = likesQuery.data.data.likes || [];
        newItems = mapLikesToMasonryItems(likes);
      }
      break;

    case 'provides':
      if (providesQuery.data) {
        const provides = providesQuery.data.data.provides || [];
        newItems = mapProvidesToMasonryItems(provides);
      }
      break;

    case 'requests':
      if (requestsQuery.data) {
        const requests = requestsQuery.data.data.requests || [];
        newItems = mapRequestsToMasonryItems(requests);
      }
      break;
  }

  return newItems;
}

/**
 * 지정된 필터에 대해 다음 페이지 데이터를 로드하는 함수
 */
export async function loadMoreFilteredData(
  filter: ContentFilter,
  currentItems: MasonryItem[],
  nextId: string | null,
  queries: QueryResults
): Promise<{ items: MasonryItem[]; nextId: string | null }> {
  console.log(
    `[data-loaders] loadMoreFilteredData 호출됨 - filter: ${filter}, nextId: ${nextId}`
  );

  // 이미 사용된 nextId인 경우, 무한 루프 방지
  if (nextId !== null && usedNextIds.has(nextId)) {
    console.log(`[data-loaders] 경고: 이미 사용된 next_id(${nextId}) 감지. 하지만 계속 진행합니다.`);
    // return { items: [], nextId: null }; // 무한 루프 방지 비활성화
  }
  
  // next_id가 반복되는 횟수 확인
  if (nextId !== null) {
    const currentCount = repeatedNextIds.get(nextId) || 0;
    
    // 동일한 next_id로 최대 허용 횟수 이상 요청되면 중단 
    if (currentCount >= MAX_REPEATED_NEXTID) {
      console.log(`[data-loaders] 경고: next_id(${nextId})가 ${currentCount}번 반복되었습니다. 하지만 계속 진행합니다.`);
      // return { items: [], nextId: null }; // 무한 루프 방지 비활성화 
    }
    
    // 반복 횟수 증가
    repeatedNextIds.set(nextId, currentCount + 1);
    console.log(`[data-loaders] next_id(${nextId}) 반복 횟수: ${currentCount + 1}/${MAX_REPEATED_NEXTID}`);
  }
  
  // 유효한 nextId를 추적 목록에 추가
  if (nextId !== null) {
    usedNextIds.add(nextId);
    console.log(`[data-loaders] next_id 추적 등록: ${nextId} (현재 등록된 next_id 수: ${usedNextIds.size})`);
  }

  const { infiniteLikesQuery, infiniteProvidesQuery, infiniteRequestsQuery } =
    queries;
  let moreItems: MasonryItem[] = [];
  let newNextId: string | null = null;
  const startIndex = currentItems.length;

  // 다음 groupKey 값을 현재 아이템 목록의 마지막 그룹 키보다 1 큰 값으로 설정
  // 아이템이 없으면 0으로 시작
  const nextGroupKey =
    currentItems.length > 0
      ? Math.max(...currentItems.map((item) => item.groupKey)) + 1
      : 0;

  console.log(
    `기존 아이템 수: ${currentItems.length}, 다음 groupKey: ${nextGroupKey}`
  );

  // 각 쿼리의 상태 로깅
  console.log('쿼리 상태:', {
    likesHasNextPage: infiniteLikesQuery.hasNextPage,
    providesHasNextPage: infiniteProvidesQuery.hasNextPage,
    requestsHasNextPage: infiniteRequestsQuery.hasNextPage,
  });

  try {
    // 진행 중인 다음 페이지 요청이 있으면 기다립니다
    if (
      infiniteLikesQuery.isFetchingNextPage ||
      infiniteProvidesQuery.isFetchingNextPage ||
      infiniteRequestsQuery.isFetchingNextPage
    ) {
      console.log(
        '이미 다음 페이지 요청이 진행 중입니다. 완료될 때까지 기다립니다.'
      );
      await Promise.allSettled([
        infiniteLikesQuery.isFetchingNextPage
          ? new Promise((resolve) => setTimeout(resolve, 500))
          : Promise.resolve(),
        infiniteProvidesQuery.isFetchingNextPage
          ? new Promise((resolve) => setTimeout(resolve, 500))
          : Promise.resolve(),
        infiniteRequestsQuery.isFetchingNextPage
          ? new Promise((resolve) => setTimeout(resolve, 500))
          : Promise.resolve(),
      ]);
    }

    if (filter === 'all') {
      // 'all' 필터에서는 하나씩 순차적으로 로드
      if (infiniteLikesQuery.hasNextPage) {
        console.log('likes에서 다음 페이지 로드 시도');

        // next_id 로그 남기기
        if (nextId) {
          console.log(`likes - 요청 next_id: ${nextId}`);
        }

        try {
          // React Query hasNextPage와 실제 nextId 검증
          console.log(`[data-loaders] likes hasNextPage 상태: ${infiniteLikesQuery.hasNextPage}, nextId: ${nextId}`);
          
          // 상태가 불일치하면 직접 다음 페이지 가져오기 시도
          if (nextId && !infiniteLikesQuery.hasNextPage) {
            console.log(`[data-loaders] React Query hasNextPage 상태와 nextId 불일치: 수동으로 요청을 진행합니다.`);
            // 직접 API 호출 방식으로 변경할 필요 있음 (fetchNextPage 대신)
            await infiniteLikesQuery.fetchNextPage();
            // React Query getNextPageParam에서 nextId를 올바르게 사용하도록 로깅
            console.log(`[data-loaders] 다음 호출에서 nextId ${nextId}가 사용되도록 합니다.`);
          } else {
            // 일반적인 방식으로 다음 페이지 가져오기
            await infiniteLikesQuery.fetchNextPage();
          }
        } catch (error) {
          console.error(`[data-loaders] likes 페이지 로드 중 오류:`, error);
        }
        
        const pages = infiniteLikesQuery.data?.pages;
        if (pages?.length) {
          const latestPage = pages[pages.length - 1];

          // 데이터 구조 상세 로깅
          console.log('likes 응답 데이터 구조:', {
            hasData: !!latestPage?.data,
            dataKeys: latestPage?.data ? Object.keys(latestPage.data) : [],
            likesExists: !!latestPage?.data?.likes,
            likesIsArray: Array.isArray(latestPage?.data?.likes),
            likesLength: Array.isArray(latestPage?.data?.likes)
              ? latestPage.data.likes.length
              : 'N/A',
            nextId: latestPage?.data?.next_id,
          });

          if (
            latestPage?.data?.likes &&
            Array.isArray(latestPage.data.likes) &&
            latestPage.data.likes.length > 0
          ) {
            moreItems = mapLikesToMasonryItems(
              latestPage.data.likes,
              startIndex,
              nextGroupKey
            );
            newNextId = latestPage.data.next_id;
            console.log(
              `likes 페이지 로드 완료: ${moreItems.length}개 아이템, next_id: ${newNextId}`
            );
          } else {
            console.log('likes 페이지에 데이터가 없습니다');
            // 데이터가 없어도 next_id가 있으면 그대로 유지 (이후 페이지 데이터가 있을 수 있음)
            if (latestPage?.data?.next_id) {
              newNextId = latestPage.data.next_id;
              console.log(`데이터는 없지만 next_id 유지: ${newNextId}`);
            }
          }
        } else {
          console.log('likes 페이지 데이터가 없습니다');
        }
      } else if (infiniteProvidesQuery.hasNextPage) {
        console.log('provides에서 다음 페이지 로드 시도');

        // next_id 로그 남기기
        if (nextId) {
          console.log(`provides - 요청 next_id: ${nextId}`);
        }

        await infiniteProvidesQuery.fetchNextPage();

        const pages = infiniteProvidesQuery.data?.pages;
        if (pages?.length) {
          const latestPage = pages[pages.length - 1];

          // 데이터 구조 상세 로깅
          console.log('provides 응답 데이터 구조:', {
            hasData: !!latestPage?.data,
            dataKeys: latestPage?.data ? Object.keys(latestPage.data) : [],
            providesExists: !!latestPage?.data?.provides,
            providesIsArray: Array.isArray(latestPage?.data?.provides),
            providesLength: Array.isArray(latestPage?.data?.provides)
              ? latestPage.data.provides.length
              : 'N/A',
            nextId: latestPage?.data?.next_id,
          });

          if (
            latestPage?.data?.provides &&
            Array.isArray(latestPage.data.provides) &&
            latestPage.data.provides.length > 0
          ) {
            moreItems = mapProvidesToMasonryItems(
              latestPage.data.provides,
              startIndex,
              nextGroupKey
            );
            newNextId = latestPage.data.next_id;
            console.log(
              `provides 페이지 로드 완료: ${moreItems.length}개 아이템, next_id: ${newNextId}`
            );
          } else {
            console.log('provides 페이지에 데이터가 없습니다');
            // 데이터가 없어도 next_id가 있으면 그대로 유지 (이후 페이지 데이터가 있을 수 있음)
            if (latestPage?.data?.next_id) {
              newNextId = latestPage.data.next_id;
              console.log(`데이터는 없지만 next_id 유지: ${newNextId}`);
            }
          }
        } else {
          console.log('provides 페이지 데이터가 없습니다');
        }
      } else if (infiniteRequestsQuery.hasNextPage) {
        console.log('requests에서 다음 페이지 로드 시도');

        // next_id 로그 남기기
        if (nextId) {
          console.log(`requests - 요청 next_id: ${nextId}`);
        }

        await infiniteRequestsQuery.fetchNextPage();

        const pages = infiniteRequestsQuery.data?.pages;
        if (pages?.length) {
          const latestPage = pages[pages.length - 1];

          // 데이터 구조 상세 로깅
          console.log('requests 응답 데이터 구조:', {
            hasData: !!latestPage?.data,
            dataKeys: latestPage?.data ? Object.keys(latestPage.data) : [],
            requestsExists: !!latestPage?.data?.requests,
            requestsIsArray: Array.isArray(latestPage?.data?.requests),
            requestsLength: Array.isArray(latestPage?.data?.requests)
              ? latestPage.data.requests.length
              : 'N/A',
            nextId: latestPage?.data?.next_id,
          });

          if (
            latestPage?.data?.requests &&
            Array.isArray(latestPage.data.requests) &&
            latestPage.data.requests.length > 0
          ) {
            moreItems = mapRequestsToMasonryItems(
              latestPage.data.requests,
              startIndex,
              nextGroupKey
            );
            newNextId = latestPage.data.next_id;
            console.log(
              `requests 페이지 로드 완료: ${moreItems.length}개 아이템, next_id: ${newNextId}`
            );
          } else {
            console.log('requests 페이지에 데이터가 없습니다');
            // 데이터가 없어도 next_id가 있으면 그대로 유지 (이후 페이지 데이터가 있을 수 있음)
            if (latestPage?.data?.next_id) {
              newNextId = latestPage.data.next_id;
              console.log(`데이터는 없지만 next_id 유지: ${newNextId}`);
            }
          }
        } else {
          console.log('requests 페이지 데이터가 없습니다');
        }
      } else {
        console.log('모든 쿼리에서 다음 페이지가 없습니다 (all 필터)');
      }

      console.log(
        `'all' 필터 로드 결과: ${moreItems.length}개 아이템, next_id: ${newNextId}`
      );
      return { items: moreItems, nextId: newNextId };
    }

    // 특정 필터에 대한 데이터 로드
    switch (filter) {
      case 'likes': {
        console.log('likes 필터에서 다음 페이지 로드 시도');

        // next_id 로그 남기기
        if (nextId) {
          console.log(`likes 필터 - 요청 next_id: ${nextId}`);
        }

        try {
          // React Query hasNextPage와 실제 nextId 검증
          console.log(`[data-loaders] likes 필터 hasNextPage 상태: ${infiniteLikesQuery.hasNextPage}, nextId: ${nextId}`);
          
          // 상태가 불일치하면 직접 다음 페이지 가져오기 시도
          if (nextId && !infiniteLikesQuery.hasNextPage) {
            console.log(`[data-loaders] React Query hasNextPage 상태와 nextId 불일치: 수동으로 요청을 진행합니다.`);
            // 직접 API 호출 방식으로 변경할 필요 있음 (fetchNextPage 대신)
            await infiniteLikesQuery.fetchNextPage();
            // React Query getNextPageParam에서 nextId를 올바르게 사용하도록 로깅
            console.log(`[data-loaders] 다음 호출에서 nextId ${nextId}가 사용되도록 합니다.`);
          } else {
            // 일반적인 방식으로 다음 페이지 가져오기
            await infiniteLikesQuery.fetchNextPage();
          }
        } catch (error) {
          console.error(`[data-loaders] likes 페이지 로드 중 오류:`, error);
          // 오류 발생 시 빈 결과 반환
          console.log(`[data-loaders] 오류로 인해 빈 결과 반환, 하지만 next_id는 유지: ${nextId}`);
          return { items: [], nextId }; // 오류가 발생해도 next_id 유지
        }
        
        const pages = infiniteLikesQuery.data?.pages;
        if (pages?.length) {
          const latestPage = pages[pages.length - 1];

          // 데이터 구조 상세 로깅
          console.log('likes 필터 응답 데이터 구조:', {
            hasData: !!latestPage?.data,
            dataKeys: latestPage?.data ? Object.keys(latestPage.data) : [],
            likesExists: !!latestPage?.data?.likes,
            likesIsArray: Array.isArray(latestPage?.data?.likes),
            likesLength: Array.isArray(latestPage?.data?.likes)
              ? latestPage.data.likes.length
              : 'N/A',
            nextId: latestPage?.data?.next_id,
          });

          // 여기서 데이터 확인 로직 개선 - API 응답에 데이터가 있는지 더 엄격하게 체크
          if (
            latestPage?.data?.likes &&
            Array.isArray(latestPage.data.likes)
          ) {
            // 실제 아이템 수를 로그로 확인
            console.log(`[디버그] likes 배열의 아이템 수: ${latestPage.data.likes.length}`);
            console.log(`[디버그] likes 배열의 첫 번째 아이템:`, latestPage.data.likes[0]);
            
            if (latestPage.data.likes.length > 0) {
              moreItems = mapLikesToMasonryItems(
                latestPage.data.likes,
                startIndex,
                nextGroupKey
              );
              
              // 매핑된 아이템 결과 확인
              console.log(`[디버그] 매핑된 아이템 수: ${moreItems.length}`);
              if (moreItems.length > 0) {
                console.log(`[디버그] 첫 번째 매핑된 아이템:`, moreItems[0]);
              }
              
              newNextId = latestPage.data.next_id;
              console.log(
                `likes 필터 페이지 로드 완료: ${moreItems.length}개 아이템, next_id: ${newNextId}`
              );
            } else {
              console.log('likes 필터 페이지에 데이터가 있지만 아이템이 없습니다');
              // 데이터가 없어도 next_id가 있으면 그대로 유지 (이후 페이지 데이터가 있을 수 있음)
              if (latestPage?.data?.next_id) {
                newNextId = latestPage.data.next_id;
                console.log(`데이터는 없지만 next_id 유지: ${newNextId}`);
              }
            }
          } else {
            console.log('likes 필터 페이지에 데이터가 없습니다');
            // 데이터가 없어도 next_id가 있으면 그대로 유지 (이후 페이지 데이터가 있을 수 있음)
            if (latestPage?.data?.next_id) {
              newNextId = latestPage.data.next_id;
              console.log(`데이터는 없지만 next_id 유지: ${newNextId}`);
            }
          }
        } else {
          console.log('likes 필터 페이지 데이터가 없습니다');
        }
        break;
      }

      case 'provides': {
        console.log('provides 필터에서 다음 페이지 로드 시도');

        // next_id 로그 남기기
        if (nextId) {
          console.log(`provides 필터 - 요청 next_id: ${nextId}`);
        }

        await infiniteProvidesQuery.fetchNextPage();

        const pages = infiniteProvidesQuery.data?.pages;
        if (pages?.length) {
          const latestPage = pages[pages.length - 1];

          // 데이터 구조 상세 로깅
          console.log('provides 응답 데이터 구조:', {
            hasData: !!latestPage?.data,
            dataKeys: latestPage?.data ? Object.keys(latestPage.data) : [],
            providesExists: !!latestPage?.data?.provides,
            providesIsArray: Array.isArray(latestPage?.data?.provides),
            providesLength: Array.isArray(latestPage?.data?.provides)
              ? latestPage.data.provides.length
              : 'N/A',
            nextId: latestPage?.data?.next_id,
          });

          if (
            latestPage?.data?.provides &&
            Array.isArray(latestPage.data.provides) &&
            latestPage.data.provides.length > 0
          ) {
            moreItems = mapProvidesToMasonryItems(
              latestPage.data.provides,
              startIndex,
              nextGroupKey
            );
            newNextId = latestPage.data.next_id;
            console.log(
              `provides 페이지 로드 완료: ${moreItems.length}개 아이템, next_id: ${newNextId}`
            );
          } else {
            console.log('provides 페이지에 데이터가 없습니다');
            // 데이터가 없어도 next_id가 있으면 그대로 유지 (이후 페이지 데이터가 있을 수 있음)
            if (latestPage?.data?.next_id) {
              newNextId = latestPage.data.next_id;
              console.log(`데이터는 없지만 next_id 유지: ${newNextId}`);
            }
          }
        } else {
          console.log('provides 페이지 데이터가 없습니다');
        }
        break;
      }

      case 'requests': {
        console.log('requests 필터에서 다음 페이지 로드 시도');

        // next_id 로그 남기기
        if (nextId) {
          console.log(`requests 필터 - 요청 next_id: ${nextId}`);
        }

        await infiniteRequestsQuery.fetchNextPage();

        const pages = infiniteRequestsQuery.data?.pages;
        if (pages?.length) {
          const latestPage = pages[pages.length - 1];

          // 데이터 구조 상세 로깅
          console.log('requests 응답 데이터 구조:', {
            hasData: !!latestPage?.data,
            dataKeys: latestPage?.data ? Object.keys(latestPage.data) : [],
            requestsExists: !!latestPage?.data?.requests,
            requestsIsArray: Array.isArray(latestPage?.data?.requests),
            requestsLength: Array.isArray(latestPage?.data?.requests)
              ? latestPage.data.requests.length
              : 'N/A',
            nextId: latestPage?.data?.next_id,
          });

          if (
            latestPage?.data?.requests &&
            Array.isArray(latestPage.data.requests) &&
            latestPage.data.requests.length > 0
          ) {
            moreItems = mapRequestsToMasonryItems(
              latestPage.data.requests,
              startIndex,
              nextGroupKey
            );
            newNextId = latestPage.data.next_id;
            console.log(
              `requests 페이지 로드 완료: ${moreItems.length}개 아이템, next_id: ${newNextId}`
            );
          } else {
            console.log('requests 페이지에 데이터가 없습니다');
            // 데이터가 없어도 next_id가 있으면 그대로 유지 (이후 페이지 데이터가 있을 수 있음)
            if (latestPage?.data?.next_id) {
              newNextId = latestPage.data.next_id;
              console.log(`데이터는 없지만 next_id 유지: ${newNextId}`);
            }
          }
        } else {
          console.log('requests 페이지 데이터가 없습니다');
        }
        break;
      }
    }

    console.log(
      `최종 로드 결과 (${filter} 필터): ${moreItems.length}개 아이템, next_id: ${newNextId}`
    );
    return { items: moreItems, nextId: newNextId };
  } catch (error) {
    console.error('데이터 로드 중 오류 발생:', error);
    return { items: [], nextId: null };
  }
}
