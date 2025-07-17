'use client';

import { useState, useCallback, useEffect } from 'react';
import { Activity } from '../utils/types';

interface UseActivityAnimationProps {
  activities: Activity[];
  isPaused: boolean;
}

export function useActivityAnimation({
  activities,
  isPaused,
}: UseActivityAnimationProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const VISIBLE_SIZE = 6;

  // 현재 표시할 활동 계산 - 항상 최신 활동을 보여줌
  const visibleActivities = activities.slice(0, VISIBLE_SIZE);

  // 애니메이션 완료 핸들러
  const handleAnimationComplete = useCallback(() => {
    setIsAnimating(false);
  }, []);

  return {
    visibleActivities,
    isAnimating,
    hasMoreActivities: activities.length > VISIBLE_SIZE,
    onAnimationComplete: handleAnimationComplete,
  };
}
