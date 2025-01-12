'use client';

import { RefObject, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Activity } from '../types/activity';

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
  onAnimationComplete
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
        y: 20
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.3,
        stagger: 0.05,
        ease: "power2.out",
        clearProps: "all",
        onComplete: () => {
          isFirstRender.current = false;
          prevActivities.current = activities;
        }
      }
    );
  }, [activities]);

  // 실시간 업데이트 애니메이션
  useEffect(() => {
    if (!feedRef.current || isFirstRender.current) return;
    
    const feedItems = Array.from(feedRef.current.children);
    if (!feedItems.length) return;

    // 새로운 아이템이 추가되고 오래된 아이템이 제거되는 경우
    if (activities.length === prevActivities.current.length) {
      const lastItem = feedItems[feedItems.length - 1];
      const firstItem = feedItems[0];

      // 첫 번째 아이템 페이드아웃 및 위로 이동
      gsap.to(firstItem, {
        opacity: 0,
        y: -20,
        scale: 0.95,
        duration: 0.2,
        ease: "power2.out",
      });

      // 중간 아이템들 위로 이동
      const middleItems = feedItems.slice(1, -1);
      if (middleItems.length) {
        gsap.to(middleItems, {
          y: -82, // 카드 높이만큼 위로 이동
          duration: 0.3,
          ease: "power2.out",
          stagger: 0.02,
          clearProps: "all"
        });
      }

      // 새로운 아이템 페이드인 및 아래에서 위로
      gsap.fromTo(
        lastItem,
        {
          opacity: 0,
          y: 20,
          scale: 0.95
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.3,
          ease: "power2.out",
          clearProps: "all",
          onComplete: () => {
            onAnimationComplete();
          }
        }
      );
    }

    prevActivities.current = activities;
  }, [activities, onAnimationComplete]);

  return null;
} 