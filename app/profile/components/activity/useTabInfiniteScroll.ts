"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { TabType } from "@/components/Header/nav/modal/types/mypage";
import { ContentItem } from "./ContentCard";
import { BoardItem } from "./BoardCard";

// 통합 아이템 타입 (콘텐츠 또는 게시판)
export type TabItem = ContentItem | BoardItem;

// 페이지네이션을 위한 타입
interface ApiResponse<T> {
  data: T[];
  next_id?: string;
  has_more?: boolean;
}

interface UseTabInfiniteScrollProps {
  tabType: TabType;
  filter: string;
  apiEndpoint: string;
}

export function useTabInfiniteScroll<T extends TabItem>({ 
  tabType, 
  filter, 
  apiEndpoint 
}: UseTabInfiniteScrollProps) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [nextId, setNextId] = useState<string | undefined>(undefined);
  const observer = useRef<IntersectionObserver | null>(null);
  
  // 마지막 아이템 요소 참조 콜백
  const lastItemRef = useCallback((node: HTMLDivElement) => {
    if (loading) return;
    
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        loadMoreItems();
      }
    });
    
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);
  
  // 데이터 초기화 함수
  const resetData = useCallback(() => {
    setItems([]);
    setNextId(undefined);
    setHasMore(true);
    setError(null);
  }, []);
  
  // 아이템 더 불러오기
  const loadMoreItems = useCallback(async () => {
    if (loading || !hasMore) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // 필터링 및 페이지네이션 파라미터 구성
      const params = new URLSearchParams();
      params.append('type', tabType);
      
      if (filter !== 'all') {
        params.append('sort', filter);
      }
      
      if (nextId) {
        params.append('next_id', nextId);
      }
      
      // API 호출
      const url = `${apiEndpoint}?${params.toString()}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }
      
      const result: ApiResponse<T> = await response.json();
      
      // 결과 처리
      setItems(prevItems => [...prevItems, ...result.data]);
      setNextId(result.next_id);
      setHasMore(result.has_more ?? false);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, tabType, filter, nextId, apiEndpoint]);
  
  // 탭이나 필터 변경 시 데이터 초기화 및 새로운 데이터 로드
  useEffect(() => {
    resetData();
    loadMoreItems();
  }, [tabType, filter, resetData]);
  
  return {
    items,
    loading,
    error,
    hasMore,
    lastItemRef,
    resetData,
    loadMoreItems
  };
} 