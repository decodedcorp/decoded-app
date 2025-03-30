'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { MasonryInfiniteGrid } from '@egjs/react-infinitegrid';
import type { MasonryItem } from '../../types';
import Image from 'next/image';

// 그리드 아이템 컴포넌트
const GridItem = React.memo(({ data, itemWidth, index }: { 
  data: MasonryItem['data'], 
  itemWidth: number,
  index: number
}) => {
  // 간결한 비율 계산
  let aspectRatio = data.aspectRatio || 0.8; // 기본값 4:5
  
  // 비율 허용 범위: 더 다양한 박스 모양 허용
  aspectRatio = Math.max(0.5, Math.min(aspectRatio, 2.0));
  
  const height = Math.floor(itemWidth / aspectRatio);
  // 이미지 로딩 상태 관리
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false); // 이미지 로드 오류 상태 추가

  // 이미지 URL이 없는 경우 로그
  useEffect(() => {
    if (!data.imageUrl) {
      console.warn('이미지 URL이 없습니다:', { 
        index, 
        imageDocId: data.imageDocId, 
        title: data.title 
      });
    }
  }, [data, index]);

  return (
    <div 
      className="masonry-item" 
      style={{ width: `${itemWidth}px`, padding: 0 }}
    > 
      <div 
        className="overflow-hidden relative group"
        style={{ 
          height: `${height}px`,
          backgroundColor: !isLoaded && data.imageUrl ? '#1e1e1e' : undefined,
          margin: 0,
          borderRadius: index % 4 === 0 ? '12px' : '6px', // 인덱스에 따라 다른 테두리 반경
          boxShadow: index % 2 === 0 
            ? '0 2px 8px rgba(0,0,0,0.05)' 
            : '0 1px 4px rgba(0,0,0,0.02)', // 인덱스에 따라 다른 그림자
        }}
      >
        {data.imageUrl ? (
          <>
            {/* 로딩 중 표시 */}
            {!isLoaded && !hasError && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-gray-600 border-t-gray-400 rounded-full animate-spin"></div>
              </div>
            )}
            
            {/* 오류 표시 */}
            {hasError && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                <div className="text-center p-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <p className="text-sm text-gray-400">이미지를 불러올 수 없습니다</p>
                </div>
              </div>
            )}
            
            {!hasError && (
              <Image
                src={data.imageUrl}
                alt={data.title || "이미지"}
                width={itemWidth}
                height={height}
                className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 ${
                  isLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                style={{ objectFit: 'cover' }}
                onLoad={() => {
                  console.log(`이미지 로드 성공: ${data.imageUrl?.substring(0, 50)}...`);
                  setIsLoaded(true);
                }}
                onError={(e) => {
                  console.error(`이미지 로드 실패: ${data.imageUrl}`, e);
                  setHasError(true);
                }}
                priority={index < 4}  // 처음 4개 이미지에 priority 설정
                unoptimized={false} // 이미지 최적화 활성화
              />
            )}
            
            {/* 호버 오버레이 */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              </div>
            </div>
          </>
        ) : (
          <div className="bg-zinc-800 w-full h-full flex items-center justify-center">
            <span className="text-gray-400 text-sm">이미지 없음</span>
          </div>
        )}
      </div>
    </div>
  );
});

GridItem.displayName = 'GridItem';

// 메인 Masonry 그리드 컴포넌트의 Props 타입
interface MasonryContentsGridProps {
  initialItems: MasonryItem[];
  itemWidth: number;
  gap: number;
  initialNextId?: string | null; // 초기 next_id 값을 받을 수 있는 속성 추가
  loadMore: (nextId: string | null) => Promise<{
    items: MasonryItem[];
    nextId: string | null;
  }>;
}

export default function MasonryContentsGrid({
  initialItems,
  itemWidth,
  gap,
  initialNextId = null, // 초기값 제공
  loadMore
}: MasonryContentsGridProps) {
  const [additionalItems, setAdditionalItems] = useState<MasonryItem[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMoreItems, setHasMoreItems] = useState(true);
  const [currentNextId, setCurrentNextId] = useState<string | null>(initialNextId);
  // 반응형 그리드를 위한 상태
  const [gridWidth, setGridWidth] = useState(0);
  const [calculatedItemWidth, setCalculatedItemWidth] = useState(itemWidth);
  const [calculatedGap, setCalculatedGap] = useState(gap);
  // 스크롤 상태 관리
  const [showEndMessage, setShowEndMessage] = useState(false);
  const endMessageTimerRef = React.useRef<NodeJS.Timeout | null>(null);
  // 네트워크 오류 상태 관리
  const [networkError, setNetworkError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  // 이미 사용한 next_id를 추적
  const [usedNextIds, setUsedNextIds] = useState<Set<string>>(new Set());
  
  // 무한 스크롤 관련 ref
  const loadMoreTriggerRef = React.useRef<HTMLDivElement | null>(null);
  const endMessageTriggerRef = React.useRef<HTMLDivElement | null>(null);
  
  // initialItems가 변경되었는지 확인하기 위한 이전 값 저장
  const [prevInitialItemsLength, setPrevInitialItemsLength] = useState(0);
  const [prevInitialItemsFirstKey, setPrevInitialItemsFirstKey] = useState<string | null>(null);
  
  // 재시도 횟수 및 마지막 시도 시간 추적을 위한 ref
  const retryRef = React.useRef({
    count: 0,
    lastNextId: null as string | null,
    lastAttemptTime: 0,
    backoffTime: 1000, // 초기 백오프 시간 (1초)
    maxRetries: 3 // 최대 재시도 횟수
  });
  
  // 반복 허용 최대 횟수 (이후로는 페이지네이션 중단)
  const MAX_NEXTID_REPEAT_COUNT = 2;
  
  // 마지막 로그 출력 시간을 추적하기 위한 ref (너무 많은 로그 방지)
  const lastLogTimeRef = React.useRef(0);
  // 마지막 append 요청 시간 추적
  const lastAppendRequestRef = React.useRef(0);
  // next_id 반복 횟수 추적을 위한 맵
  const nextIdCountRef = React.useRef<Map<string, number>>(new Map());
  
  // "더 이상 콘텐츠가 없습니다" 메시지 표시 함수
  const showEndOfContentMessage = () => {
    // 이미 타이머가 실행 중이면 중복 실행 방지
    if (endMessageTimerRef.current) {
      clearTimeout(endMessageTimerRef.current);
    }
    
    // 메시지 표시
    setShowEndMessage(true);
    
    // 2초 후에 메시지 숨김 (시간 단축)
    endMessageTimerRef.current = setTimeout(() => {
      setShowEndMessage(false);
      endMessageTimerRef.current = null;
    }, 2000);
  };
  
  // IntersectionObserver 설정 - 무한 스크롤 로딩을 위한 옵저버
  useEffect(() => {
    // 자동 로드 기능 비활성화 - 버튼 방식으로 전환
    console.log(`[Masonry] 자동 로드 기능이 비활성화되었습니다. 버튼을 사용해 데이터를 로드해주세요.`);
    // 기존 코드를 실행하지 않고 종료
    return;
  }, [hasMoreItems, isLoadingMore, networkError]);
  
  // IntersectionObserver 설정 - 더 이상 콘텐츠가 없을 때 메시지 표시를 위한 옵저버
  useEffect(() => {
    // 무한 스크롤을 사용하지 않으므로 이 효과도 비활성화
    return;
  }, [hasMoreItems, showEndMessage]);
  
  // 화면 크기에 따른 그리드 너비 및 아이템 너비 계산
  useEffect(() => {
    const updateGridDimensions = () => {
      // 그리드 컨테이너의 너비 계산
      const container = document.querySelector('.masonry-grid');
      if (!container) return;
      
      const containerWidth = container.clientWidth;
      setGridWidth(containerWidth);
      
      // 화면 너비에 따라 컬럼 수와 아이템 너비 계산
      let columns = 3; // 기본값
      let newGap = gap;
      
      if (window.innerWidth < 640) { // sm
        columns = 1;
        newGap = 8;
      } else if (window.innerWidth < 768) { // md
        columns = 2;
        newGap = 12;
      } else if (window.innerWidth < 1024) { // lg
        columns = 3;
        newGap = 16;
      } else if (window.innerWidth < 1280) { // xl
        columns = 4;
        newGap = 16;
      } else { // 2xl
        columns = 5;
        newGap = 16;
      }
      
      // 이용 가능한 공간에서 간격을 뺀 후 컬럼 수로 나누기
      const totalGapWidth = newGap * (columns - 1);
      const newItemWidth = Math.floor((containerWidth - totalGapWidth) / columns);
      
      setCalculatedItemWidth(newItemWidth);
      setCalculatedGap(newGap);
    };
    
    // 초기 계산
    updateGridDimensions();
    
    // 리사이즈 이벤트에 대한 리스너 추가
    window.addEventListener('resize', updateGridDimensions);
    
    // 클린업 함수
    return () => {
      window.removeEventListener('resize', updateGridDimensions);
    };
  }, [gap]);
  
  // 초기 next_id가 변경될 때 currentNextId 업데이트 및 usedNextIds 초기화
  useEffect(() => {
    if (initialNextId !== undefined && initialNextId !== currentNextId) {
      console.log(`initialNextId(${initialNextId})가 변경되어 currentNextId 업데이트`);
      setCurrentNextId(initialNextId);
      // 다른 필터로 변경된 경우 사용된 next_id 목록 초기화
      setUsedNextIds(new Set());
    }
  }, [initialNextId, currentNextId]);
  
  // 아이템 목록이 변경되면 추가 아이템 초기화 (nextId는 유지)
  useEffect(() => {
    // initialItems의 첫 번째 아이템의 키로 내용 변경 감지
    const firstItemKey = initialItems.length > 0 ? initialItems[0].key : null;
    
    // initialItems의 내용이 실제로 변경된 경우에만 초기화
    // (길이가 다르거나 첫 번째 아이템이 다른 경우)
    if (initialItems.length !== prevInitialItemsLength || 
        firstItemKey !== prevInitialItemsFirstKey) {
      console.log('실제 initialItems 변경 감지, 컴포넌트 데이터 초기화');
      
      // 추가 아이템 초기화
      setAdditionalItems([]);
      
      // 로딩 상태 및 더 불러올 아이템 여부 초기화
      setIsLoadingMore(false);
      setHasMoreItems(initialNextId !== null);
      
      // 이전 상태 업데이트
      setPrevInitialItemsLength(initialItems.length);
      setPrevInitialItemsFirstKey(firstItemKey);
      
      console.log('컴포넌트 데이터 초기화: 새로운 initialItems 수:', initialItems.length, '현재 next_id:', initialNextId);
    } else {
      console.log('initialItems 길이 변경 감지되었으나 내용 동일, 초기화 건너뜀');
    }
  }, [initialItems, prevInitialItemsLength, prevInitialItemsFirstKey, initialNextId]);
  
  // 초기 아이템 로드 후 첫 번째 무한 스크롤 트리거를 수동으로 작동시킴
  useEffect(() => {
    // 자동 로드 기능 비활성화 - 버튼 방식으로 전환
    console.log(`[Masonry] 초기 자동 로드 기능이 비활성화되었습니다. 버튼을 사용해 데이터를 로드해주세요.`);
    return;
    
    // 아래 코드는 실행되지 않습니다 (원래 코드는 주석 처리하지 않고 유지)
    // initialItems 데이터가 있고, 추가 아이템이 없으며, 로딩 중이 아니고, 더 불러올 항목이 있을 때만 실행
    if (initialItems.length > 0 && additionalItems.length === 0 && !isLoadingMore && hasMoreItems) {
      // 이미 타이머가 실행 중인지 확인하는 플래그
      let timerSet = false;
      
      // 타이머가 설정되지 않았을 때만 실행
      if (!timerSet) {
        timerSet = true;
        const timer = setTimeout(() => {
          timerSet = false;
          // 여전히 조건이 유효한지 확인 (상태가 변경되었을 수 있음)
          if (!isLoadingMore && hasMoreItems) {
            handleLoadMore();
          }
        }, 2000);
        
        return () => {
          clearTimeout(timer);
          timerSet = false;
        };
      }
    }
  }, [initialItems, additionalItems, isLoadingMore, hasMoreItems]);
  
  // initialItems가 변경될 때 nextIdCountRef 초기화
  useEffect(() => {
    // initialItems의 첫 번째 아이템의 키로 내용 변경 감지
    const firstItemKey = initialItems.length > 0 ? initialItems[0].key : null;
    
    // initialItems의 내용이 실제로 변경된 경우에만 초기화
    if (initialItems.length !== prevInitialItemsLength || 
        firstItemKey !== prevInitialItemsFirstKey) {
      console.log('nextIdCountRef 초기화 - 새로운 initialItems 감지');
      nextIdCountRef.current.clear();
      
      // 필터 변경 시 usedNextIds도 초기화
      setUsedNextIds(new Set());
    }
  }, [initialItems, prevInitialItemsLength, prevInitialItemsFirstKey]);
  
  // 모든 아이템을 결합 (초기 + 추가 아이템)
  const allItems = useMemo(() => {
    return [...initialItems, ...additionalItems];
  }, [initialItems, additionalItems]);
  
  // 중복 감지를 위한 함수
  const hasDuplicateKeys = useMemo(() => {
    const keys = new Set<string>();
    const duplicateKeys: string[] = [];
    
    for (const item of allItems) {
      if (keys.has(item.key)) {
        duplicateKeys.push(item.key);
      } else {
        keys.add(item.key);
      }
    }
    
    if (duplicateKeys.length > 0) {
      console.warn('Duplicate keys detected:', duplicateKeys);
      return true;
    }
    
    return false;
  }, [allItems]);
  
  // 무한 스크롤 데이터 로딩 함수
  const handleLoadMore = useCallback(async () => {
    // 클릭 시 로그 추가
    console.log(`[Masonry] 데이터 로드 버튼 클릭됨. 현재 상태: isLoadingMore=${isLoadingMore}, hasMoreItems=${hasMoreItems}, nextId=${currentNextId}`);
    
    // 이미 로딩 중이거나 더 이상 불러올 아이템이 없으면 중단
    if (isLoadingMore || !hasMoreItems || networkError) {
      console.log(`[Masonry] 로드 중단: isLoadingMore=${isLoadingMore}, hasMoreItems=${hasMoreItems}, networkError=${networkError}`);
      return;
    }
    
    // currentNextId가 이미 사용된 next_id인지 확인
    if (currentNextId !== null && usedNextIds.has(currentNextId)) {
      console.log(`[Masonry] 경고: 이미 사용된 next_id(${currentNextId})로의 요청 감지.`);
      
      // next_id 반복 횟수 추적 (nextIdCountRef를 직접 수정)
      const currentCount = nextIdCountRef.current.get(currentNextId) || 0;
      const newCount = currentCount + 1;
      nextIdCountRef.current.set(currentNextId, newCount);
      
      console.log(`[Masonry] nextIdCountRef 값 업데이트: ${currentNextId} = ${newCount} (Map 크기: ${nextIdCountRef.current.size})`);
      
      // 반복 횟수가 최대 허용 횟수 이상이면 더 이상 요청하지 않음
      if (newCount >= MAX_NEXTID_REPEAT_COUNT) {
        console.log(`[Masonry] 경고: next_id(${currentNextId})가 ${newCount}번 반복되었습니다. 더 이상 데이터를 로드하지 않습니다.`);
        setHasMoreItems(false);
        return;
      }
      
      console.log(`[Masonry] 이미 사용된 next_id이지만 일단 요청을 진행합니다. 반복 횟수: ${newCount}/${MAX_NEXTID_REPEAT_COUNT}`);
    }
    
    try {
      console.log(`[Masonry] 데이터 로드 시작: nextId=${currentNextId}`);
      setIsLoadingMore(true);
      
      // 현재 스코프에서 값을 캡쳐하여 사용
      const nextIdToUse = currentNextId;
      
      // next_id가 null이 아닌 경우 사용한 next_id 목록에 추가
      if (nextIdToUse !== null) {
        // usedNextIds를 함수형 업데이트로 수정 (클로저 문제 방지)
        setUsedNextIds(prev => {
          // 새로운 Set 객체 생성 (불변성 유지)
          const newSet = new Set(prev);
          newSet.add(nextIdToUse);
          console.log(`[Masonry] next_id 추적에 추가: ${nextIdToUse} (현재 등록된 next_id 수: ${newSet.size}, 등록된 ID: ${[...newSet].join(', ')})`);
          return newSet;
        });
      }
      
      // nextId를 사용하여 다음 데이터 로드
      const result = await loadMore(nextIdToUse);
      console.log(`[Masonry] 데이터 로드 결과:`, {
        itemsCount: result.items.length,
        newNextId: result.nextId,
        hasMoreItems,
        usedNextIdsCount: usedNextIds.size
      });
      
      // 네트워크 오류가 해결되었다면 재시도 카운트와 백오프 시간 초기화
      retryRef.current.count = 0;
      retryRef.current.backoffTime = 1000;
      setRetryCount(0);
      
      // 응답에서 받은 next_id가 이미 사용된 것인지 확인
      if (result.nextId !== null && usedNextIds.has(result.nextId)) {
        console.log(`[Masonry] 경고: API가 이미 사용된 next_id(${result.nextId})를 반환했습니다.`);
        
        // next_id 반복 횟수 추적
        const currentCount = nextIdCountRef.current.get(result.nextId) || 0;
        const newCount = currentCount + 1;
        nextIdCountRef.current.set(result.nextId, newCount);
        
        // 반복 횟수가 최대 허용 횟수 이상이면 더 이상 요청하지 않음
        if (newCount >= MAX_NEXTID_REPEAT_COUNT) {
          console.log(`[Masonry] 경고: next_id(${result.nextId})가 ${newCount}번 반복되었습니다. 더 이상 데이터를 로드하지 않습니다.`);
          setHasMoreItems(false);
          return;
        }
        
        // 대신, 새 데이터가 있으면 계속 진행
        if (result.items.length > 0) {
          console.log(`[Masonry] 이미 사용된 next_id이지만 새 데이터가 있어 계속 진행합니다. 반복 횟수: ${newCount}/${MAX_NEXTID_REPEAT_COUNT}`);
          setCurrentNextId(result.nextId);
        } else {
          console.log(`[Masonry] 이미 사용된 next_id이고 새 데이터도 없어 중단합니다.`);
          setHasMoreItems(false);
          return;
        }
      }
      
      // 다음 요청을 위한 nextId 설정
      const prevNextId = currentNextId;
      if (result.nextId !== prevNextId) {
        console.log(`[Masonry] next_id 변경: ${prevNextId} → ${result.nextId}`);
        setCurrentNextId(result.nextId);
      } else if (result.nextId === null) {
        // API에서 next_id가 null, 더 이상 데이터 없음
        console.log(`[Masonry] API가 next_id를 null로 반환했습니다. 더 이상 데이터가 없습니다.`);
        
        // 하지만, initialNextId가 있으면 다시 시도해볼 수 있음 - API와 상태 불일치 해결
        if (initialNextId !== null) {
          console.log(`[Masonry] initialNextId(${initialNextId})가 있으므로 다시 시도합니다.`);
          setCurrentNextId(initialNextId);
          // hasMoreItems를 true로 유지하여 다시 시도할 수 있게 함
          setTimeout(() => {
            setIsLoadingMore(false);
          }, 1000);
          return;
        } else {
          setHasMoreItems(false);
        }
      } else {
        // 계속 같은 next_id가 반환되는 경우 (백엔드 문제)
        if (prevNextId === result.nextId && prevNextId !== null) {
          console.log(`[Masonry] 경고: API가 계속 동일한 next_id(${result.nextId})를 반환합니다.`);
          
          // next_id 반복 횟수 추적
          const currentCount = nextIdCountRef.current.get(result.nextId) || 0;
          const newCount = currentCount + 1;
          nextIdCountRef.current.set(result.nextId, newCount);
          
          // 반복 횟수가 최대 허용 횟수 이상이면 더 이상 요청하지 않음
          if (newCount >= MAX_NEXTID_REPEAT_COUNT) {
            console.log(`[Masonry] 경고: next_id(${result.nextId})가 ${newCount}번 반복되었습니다. 더 이상 데이터를 로드하지 않습니다.`);
            setHasMoreItems(false);
            return;
          }
          
          // 아이템이 있으면 계속 진행 (최대 허용 횟수까지)
          if (result.items.length > 0) {
            console.log(`[Masonry] 같은 next_id지만 새 데이터(${result.items.length}개)가 있어 계속 진행합니다. 반복 횟수: ${newCount}/${MAX_NEXTID_REPEAT_COUNT}`);
            // return문 제거로 계속 진행
          } else {
            // 데이터가 없으면 중단
            console.log(`[Masonry] 같은 next_id이고 새 데이터도 없어 중단합니다.`);
            setHasMoreItems(false);
            return;
          }
        }
      }
      
      // API가 nextId를 null로 반환했지만 create-mypage-hooks에서 여전히 nextId가 있다고 판단하는 경우 처리
      // 여기서 initialNextId를 확인하고 상태가 불일치할 경우 다시 시도
      if (result.nextId === null && initialNextId !== null) {
        console.log(`[Masonry] API는 nextId를 null로 반환했지만 initialNextId(${initialNextId})가 있습니다. 불일치 감지.`);
        
        // 아이템이 없는 경우에만 initialNextId를 사용하여 다시 시도
        if (result.items.length === 0) {
          console.log(`[Masonry] 불일치 해결을 위해 initialNextId를 사용하여 다시 시도합니다.`);
          setCurrentNextId(initialNextId);
          // hasMoreItems를 true로 유지하고 잠시 후 다시 시도
          setTimeout(() => {
            setIsLoadingMore(false);
          }, 1500);
          return;
        }
      }

      // 응답 받은 아이템이 없는 경우 처리
      if (result.items.length === 0) {
        console.log(`[Masonry] API가 아이템을 반환하지 않았습니다.`);
        
        // 아이템이 없고 API가 nextId를 null로 반환한 경우에도, 
        // initialNextId가 존재하면 다시 시도 (상태 불일치 해결)
        if (initialNextId !== null && initialNextId !== currentNextId) {
          console.log(`[Masonry] 아이템은 없지만 initialNextId(${initialNextId})로 다시 시도합니다.`);
          setCurrentNextId(initialNextId);
          setTimeout(() => {
            setIsLoadingMore(false);
          }, 1000);
          return;
        }
        
        // 아이템이 없지만 next_id가 있으면 계속 시도
        if (result.nextId && !usedNextIds.has(result.nextId)) {
          console.log(`[Masonry] 아이템은 없지만 새로운 next_id(${result.nextId})가 있습니다. 재시도합니다.`);
          setIsLoadingMore(false);
          // 다음 next_id로 설정하고 잠시 후 다시 시도 (단, 최대 백오프 시간 제한)
          setCurrentNextId(result.nextId);
          const delayTime = Math.min(retryRef.current.backoffTime, 5000);
          // 단일 타이머 사용 - 중복 호출 방지
          const timerId = setTimeout(() => {
            // 상태가 여전히 유효한지 재확인
            if (hasMoreItems && !isLoadingMore) {
              handleLoadMore();
            }
          }, delayTime);
          
          // 이전 타이머가 있다면 정리
          return () => clearTimeout(timerId);
        } else {
          console.log(`[Masonry] 아이템이 없고 사용 가능한 next_id도 없습니다. 로드를 중단합니다.`);
          
          // 그러나 initialNextId가 여전히 존재하는 경우, API 응답과 앱 상태 간의 불일치가 있을 수 있음
          // 이 경우 한 번 더 시도해볼 수 있음
          if (initialNextId) {
            console.log(`[Masonry] API 응답과 앱 상태 간 불일치 가능성. initialNextId(${initialNextId})로 한 번 더 시도합니다.`);
            // initialNextId로 다시 설정하고 한 번 더 시도
            setCurrentNextId(initialNextId);
            
            // 약간의 지연 후 재시도 (최대 1회)
            setTimeout(() => {
              if (!isLoadingMore) {
                handleLoadMore();
              }
            }, 2000);
            return;
          }
          
          setHasMoreItems(false);
          setIsLoadingMore(false);
        }
        return;
      }
      
      // 중복 아이템 필터링 (강화된 로직)
      // 1. 이미지 ID 기반 중복 확인 (주요 중복 감지 방법)
      const existingImageIds = new Set(
        allItems
          .filter(item => item.data.imageDocId) // imageDocId가 있는 항목만 필터링
          .map(item => item.data.imageDocId)
      );
      
      // 2. 아이템 키 기반 중복 확인 (보조 확인)
      const existingKeys = new Set(
        allItems.map(item => item.key)
      );
      
      const filteredItems = result.items.filter(item => {
        // 이미지 ID가 있는 경우 이미지 ID로 중복 확인 (주요 방법)
        if (item.data.imageDocId) {
          const isDuplicate = existingImageIds.has(item.data.imageDocId);
          if (isDuplicate) {
            return false;
          }
          // 중복이 아니면 바로 Set에 추가 (이후 비교를 위해)
          existingImageIds.add(item.data.imageDocId);
        }
        
        // 키 중복 확인 (보조 방법)
        const hasUniqueKey = !existingKeys.has(item.key);
        if (!hasUniqueKey) {
          return false;
        }
        // 중복이 아니면 바로 Set에 추가 (이후 비교를 위해)
        existingKeys.add(item.key);
        
        // 중복이 아닌 항목만 유지
        return true;
      });
      
      // 결과 next_id가 이미 사용된 것인지 확인하고 nextIdCountRef 업데이트
      if (result.nextId !== null) {
        const nextIdCount = nextIdCountRef.current.get(result.nextId) || 0;
        const updatedCount = nextIdCount + 1;
        nextIdCountRef.current.set(result.nextId, updatedCount);
        console.log(`[Masonry] next_id(${result.nextId}) 반복 감지 및 카운트 증가: ${updatedCount}/${MAX_NEXTID_REPEAT_COUNT}`);
        
        // 이미 이 next_id로 여러 번 요청했는데 최대 반복 횟수를 초과한 경우
        if (updatedCount >= MAX_NEXTID_REPEAT_COUNT && usedNextIds.has(result.nextId)) {
          console.log(`[Masonry] 경고: next_id(${result.nextId})가 ${updatedCount}번 반복되어 최대 횟수(${MAX_NEXTID_REPEAT_COUNT})를 초과했습니다. 페이지네이션 강제 종료.`);
          setHasMoreItems(false);
          setIsLoadingMore(false);
          return;
        }
      }
      
      // 연속적인 중복 데이터 감지 (페이지네이션 종료 조건)
      const duplicateCount = result.items.length - filteredItems.length;
      const duplicateRatio = result.items.length > 0 ? duplicateCount / result.items.length : 0;

      console.log(`[Masonry] 중복 필터링 결과: 원본 ${result.items.length}개, 필터링 후 ${filteredItems.length}개, 중복률: ${(duplicateRatio * 100).toFixed(1)}%`);
      
      // filteredItems가 비어있으면 모든 아이템이 중복인 것으로 판단
      if (filteredItems.length === 0 && result.items.length > 0) {
        console.log(`[Masonry] 경고: 모든 아이템이 중복입니다. 새로운 데이터가 없습니다.`);
        
        // 중복률 100%이면서 next_id가 null이거나 반복되는 경우는 더 이상 진행하지 않음
        if (result.nextId === null || usedNextIds.has(result.nextId)) {
          console.log(`[Masonry] 경고: 중복 데이터와 반복/종료된 next_id 감지. 페이지네이션을 즉시 종료합니다.`);
          setHasMoreItems(false);
          setIsLoadingMore(false);
          return;
        }
        
        // next_id가 있고 아직 사용하지 않은 경우, 다음 페이지 시도
        if (result.nextId) {
          console.log(`[Masonry] 중복 데이터 감지되었으나 next_id(${result.nextId})가 새로운 값이므로 한 번 더 시도합니다.`);
          setIsLoadingMore(false);
          setCurrentNextId(result.nextId);
          // 약간의 지연 후 다시 요청 (UI 프리징 방지)
          const delayTimer = setTimeout(() => {
            // 상태가 여전히 유효한지 재확인
            if (hasMoreItems && !isLoadingMore) {
              handleLoadMore();
            }
          }, 1000);
          
          return () => clearTimeout(delayTimer);
        } else {
          // nextId가 null인 경우
          console.log(`[Masonry] 중복 제거 후 새 데이터가 없고 next_id도 null입니다. 페이지네이션 종료.`);
          setHasMoreItems(false);
          setIsLoadingMore(false);
          return;
        }
      }
      
      // 높은 중복률 감지 (90% 이상)
      if (duplicateRatio >= 0.9 && result.items.length >= 5) {
        // 이미 usedNextIds에 포함된 next_id인 경우, 중복 데이터만 계속 나오고 있을 가능성 높음
        if (result.nextId && usedNextIds.has(result.nextId)) {
          const countForThisNextId = nextIdCountRef.current.get(result.nextId) || 0;
          
          // 2번 이상 같은 next_id로 호출했는데도 계속 중복 데이터가 많이 나오면 중단
          if (countForThisNextId >= 2) {
            console.log(`[Masonry] 경고: 높은 중복률(${(duplicateRatio * 100).toFixed(1)}%)과 반복된 next_id(${countForThisNextId}회). 페이지네이션 종료.`);
            setHasMoreItems(false);
            setIsLoadingMore(false);
            return;
          }
        }
      }
      
      // 새로운 아이템이 너무 적은 경우 (필터링 후 2개 이하면서 중복률이 80% 이상)
      if (filteredItems.length <= 2 && duplicateRatio >= 0.8 && result.items.length >= 5) {
        if (result.nextId === null || usedNextIds.has(result.nextId)) {
          console.log(`[Masonry] 경고: 대부분 중복 데이터만 남음 (${filteredItems.length}개만 고유). 페이지네이션 종료.`);
          setHasMoreItems(false);
          setIsLoadingMore(false);
          return;
        }
      }
      
      // 새 아이템 추가
      setAdditionalItems(prev => [...prev, ...filteredItems]);
      
    } catch (error) {
      console.error('아이템 로딩 중 오류 발생:', error);
      // 네트워크 오류 상태 설정
      setNetworkError(true);
      
      // 재시도 횟수와 백오프 시간 관리 (지수 백오프)
      retryRef.current.count += 1;
      setRetryCount(retryRef.current.count);
      
      // 백오프 시간 계산 (지수적으로 증가, 최대 30초)
      retryRef.current.backoffTime = Math.min(
        retryRef.current.backoffTime * 2, 
        30000
      );
      
      // 최대 재시도 횟수를 초과한 경우 더 이상 로드하지 않음
      if (retryRef.current.count >= retryRef.current.maxRetries) {
        setHasMoreItems(false);
      }
    } finally {
      setIsLoadingMore(false);
    }
  }, [isLoadingMore, hasMoreItems, networkError, currentNextId, usedNextIds, allItems, initialNextId]);
  
  // 디버깅용 로그
  useEffect(() => {
    console.log({
      initialItemsLength: initialItems.length,
      additionalItemsLength: additionalItems.length,
      totalItems: allItems.length,
      itemKeys: allItems.map(item => item.key), // 모든 키 로깅
    });
    
    // 중복 키 감지
    const keySet = new Set<string>();
    const duplicateKeys: string[] = [];
    
    allItems.forEach(item => {
      if (keySet.has(item.key)) {
        duplicateKeys.push(item.key);
      } else {
        keySet.add(item.key);
      }
    });
    
    if (duplicateKeys.length > 0) {
      console.error('Duplicate keys detected:', duplicateKeys);
    }
  }, [allItems, initialItems, additionalItems]);
  
  // 컴포넌트 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      if (endMessageTimerRef.current) {
        clearTimeout(endMessageTimerRef.current);
      }
    };
  }, []);
  
  // 네트워크 오류 상태 초기화 (주기적으로 재시도 가능하도록)
  useEffect(() => {
    // 네트워크 오류가 발생한 경우 일정 시간 후에 상태 초기화
    if (networkError) {
      const timer = setTimeout(() => {
        console.log('네트워크 오류 상태 초기화, 재시도 가능');
        setNetworkError(false);
        // 백오프 시간은 유지 (retryRef에 저장됨)
      }, retryRef.current.backoffTime);
      
      return () => clearTimeout(timer);
    }
  }, [networkError]);
  
  // 데이터가 없는 경우 표시할 메시지
  if (allItems.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400">
        <p>표시할 콘텐츠가 없습니다</p>
      </div>
    );
  }
  
  return (
    <div className="relative pb-20 w-full">
      {/* 네트워크 오류 메시지 */}
      {networkError && (
        <div className="sticky top-0 z-50 bg-red-500 text-white p-2 text-center">
          <p>네트워크 오류가 발생했습니다. {retryRef.current.backoffTime / 1000}초 후 자동으로 재시도합니다.</p>
        </div>
      )}
      <MasonryInfiniteGrid
        className="masonry-grid"
        style={{ 
          width: '100%'
        }}
        gap={calculatedGap}
        align="justify"
        column={0} // auto-columns
        columnSize={calculatedItemWidth}
        threshold={1000}
        useFirstRender={true}
        useFit={true}
        useResizeObserver={true}
        observeChildren={true}
        attributePrefix="data-grid-"
        renderOnPropertyChange={true}
        preserveUIOnDestroy={true}
      >
        {/* 모든 아이템을 렌더링하되, 각 아이템에 고유한 키를 부여하여 중복 방지 */}
        {allItems.map((item, index) => {
          // 더 강화된 고유 키 생성
          // 1. imageDocId가 있으면 이를 우선 사용 (가장 신뢰할 수 있는 식별자)
          // 2. key 값 사용 (백업 식별자)
          // 3. 인덱스 추가 (마지막 수단)
          const uniqueKey = item.data.imageDocId 
            ? `img_${item.data.imageDocId}` 
            : `key_${item.key}_idx_${index}`;
          
          return (
            <GridItem
              key={uniqueKey}
              data-grid-groupkey={item.groupKey}
              data={item.data}
              itemWidth={calculatedItemWidth}
              index={index}
            />
          );
        })}
      </MasonryInfiniteGrid>
      
      {/* 로딩 스피너 */}
      {isLoadingMore && (
        <div className="flex justify-center my-8">
          <div className="w-10 h-10 border-4 border-gray-600 border-t-white rounded-full animate-spin"></div>
        </div>
      )}
      
      {/* 데이터 로드 버튼 - 무한 스크롤 대신 사용 */}
      {hasMoreItems && !isLoadingMore && (
        <div className="flex justify-center my-8">
          <button
            onClick={() => {
              console.log("[Masonry] 더 불러오기 버튼 클릭됨");
              handleLoadMore();
            }}
            className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg font-semibold text-lg flex items-center gap-2"
          >
            <span>더 불러오기</span>
            {currentNextId && (
              <span className="text-sm opacity-70">(next_id: {currentNextId.substring(0, 8)}...)</span>
            )}
          </button>
        </div>
      )}
      
      {/* 로드 완료 메시지 */}
      {!hasMoreItems && !isLoadingMore && (
        <div className="flex flex-col items-center my-6 text-gray-400">
          <p className="mb-2">모든 콘텐츠를 불러왔습니다</p>
          {nextIdCountRef.current.size > 0 && (
            <p className="text-xs opacity-70">
              (반복되는 데이터 감지로 로드가 중단되었습니다)
            </p>
          )}
        </div>
      )}
      
      {/* 참조를 위한 숨겨진 요소 (타입 오류 방지) */}
      <div ref={loadMoreTriggerRef} style={{ display: 'none' }} data-testid="scroll-trigger" />
      <div ref={endMessageTriggerRef} style={{ display: 'none' }} />
    </div>
  );
}
