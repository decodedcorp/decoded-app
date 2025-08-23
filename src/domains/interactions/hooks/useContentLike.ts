'use client';

import { useState, useEffect, useCallback } from 'react';
import { useContentLikeStats, useLikeContent, useUnlikeContent } from './useInteractions';

/**
 * 콘텐츠 좋아요 관리를 위한 통합 훅
 * 
 * @param contentId - 콘텐츠 ID
 * @returns 좋아요 상태와 액션들
 * 
 * @example
 * ```tsx
 * const { isLiked, likeCount, toggleLike, isLoading } = useContentLike(contentId);
 * ```
 */
export const useContentLike = (contentId: string) => {
  // 로컬 상태 (낙관적 업데이트용)
  const [optimisticIsLiked, setOptimisticIsLiked] = useState<boolean | null>(null);
  const [optimisticLikeCount, setOptimisticLikeCount] = useState<number | null>(null);

  // 서버 데이터 가져오기
  const { 
    data: likeStats, 
    isLoading: isStatsLoading,
    error: statsError 
  } = useContentLikeStats(contentId);

  // 뮤테이션 훅들
  const likeMutation = useLikeContent();
  const unlikeMutation = useUnlikeContent();

  // 서버 데이터로 로컬 상태 초기화
  useEffect(() => {
    if (likeStats && optimisticIsLiked === null) {
      // is_liked 속성이 API 응답에 없으므로 기본값 사용
      setOptimisticIsLiked(false);
      setOptimisticLikeCount(likeStats.total_likes || 0);
    }
  }, [likeStats, optimisticIsLiked]);

  // 현재 상태 계산 (낙관적 업데이트가 있으면 우선 사용)
  const isLiked = optimisticIsLiked ?? false;
  const likeCount = optimisticLikeCount ?? likeStats?.total_likes ?? 0;
  const isLoading = isStatsLoading || likeMutation.isPending || unlikeMutation.isPending;

  // 좋아요 토글 함수
  const toggleLike = useCallback(async () => {
    if (!contentId || isLoading) return;

    const newIsLiked = !isLiked;
    const newLikeCount = isLiked ? likeCount - 1 : likeCount + 1;

    // 낙관적 업데이트
    setOptimisticIsLiked(newIsLiked);
    setOptimisticLikeCount(newLikeCount);

    try {
      if (newIsLiked) {
        await likeMutation.mutateAsync(contentId);
      } else {
        await unlikeMutation.mutateAsync(contentId);
      }
    } catch (error) {
      // 에러 시 이전 상태로 롤백
      setOptimisticIsLiked(isLiked);
      setOptimisticLikeCount(likeCount);
      
      console.error('Failed to toggle content like:', error);
      
      // 에러 알림 (선택적)
      if (typeof window !== 'undefined' && 'alert' in window) {
        alert('좋아요 처리 중 오류가 발생했습니다. 다시 시도해주세요.');
      }
    }
  }, [contentId, isLiked, likeCount, isLoading, likeMutation, unlikeMutation]);

  // 에러 상태 리셋 함수
  const resetError = useCallback(() => {
    likeMutation.reset();
    unlikeMutation.reset();
  }, [likeMutation, unlikeMutation]);

  return {
    /** 현재 좋아요 상태 */
    isLiked,
    /** 전체 좋아요 수 */
    likeCount,
    /** 좋아요 토글 함수 */
    toggleLike,
    /** 로딩 상태 */
    isLoading,
    /** 에러 상태 */
    error: likeMutation.error || unlikeMutation.error || statsError,
    /** 에러 리셋 함수 */
    resetError,
    /** 최근 좋아요 수 (24시간) */
    recentLikes: likeStats?.recent_likes ?? 0,
  };
};

export default useContentLike;