'use client';

import { RefObject, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Activity } from '../utils/types';

interface UseActivityFeedAnimationProps {
  feedRef: RefObject<HTMLDivElement>;
  hasMoreActivities: boolean;
  activities: Activity[];
  onAnimationComplete: () => void;
}

export function useActivityFeedAnimation({
  feedRef,
  hasMoreActivities,
  activities,
  onAnimationComplete,
}: UseActivityFeedAnimationProps) {
  const isFirstRender = useRef(true);
  const prevActivitiesLength = useRef(activities.length);
  const prevActivities = useRef<Activity[]>([]);

  // 초기 렌더링 애니메이션
  useEffect(() => {
    if (!feedRef.current || !isFirstRender.current) return;

    const feedItems = Array.from(feedRef.current.children);
    if (!feedItems.length) return;

    gsap.fromTo(
      feedItems,
      {
        opacity: 0,
        y: -20,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.3,
        stagger: {
          from: "start",
          amount: 0.3
        },
        ease: 'power2.out',
        clearProps: 'all',
        onComplete: () => {
          isFirstRender.current = false;
          prevActivities.current = activities;
          onAnimationComplete();
        },
      }
    );
  }, [activities, onAnimationComplete]);

  // 실시간 업데이트 애니메이션
  useEffect(() => {
    if (!feedRef.current || isFirstRender.current) return;

    const feedItems = Array.from(feedRef.current.children);
    if (!feedItems.length) return;

    // 새로운 아이템이 추가되고 오래된 아이템이 제거되는 경우
    if (activities.length === prevActivities.current.length) {
      const lastItem = feedItems[feedItems.length - 1];

      // 기존 아이템들 위로 이동
      gsap.to(feedItems.slice(0, -1), {
        y: -82,
        duration: 0.3,
        ease: 'power2.out',
        stagger: 0.02,
        clearProps: 'all',
      });

      // 새로운 아이템 페이드인 및 아래에서 위로
      gsap.fromTo(
        lastItem,
        {
          opacity: 0,
          y: 20,
          scale: 0.95,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.3,
          ease: 'power2.out',
          clearProps: 'all',
          onComplete: () => {
            onAnimationComplete();
          },
        }
      );
    }

    prevActivities.current = activities;
  }, [activities, onAnimationComplete]);

  return null;
}
