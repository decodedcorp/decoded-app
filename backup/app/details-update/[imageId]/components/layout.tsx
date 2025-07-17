'use client';

import { useRef, useEffect, useState } from 'react';
import React from 'react';
import { DetailsList } from './item-list-section/server/details-list';
import { useItemDetail } from '../context/item-detail-context';
import gsap from 'gsap';

interface DetailsListProps {
  imageData: any;
  selectedItemId?: string;
  mainContainerRef?: React.MutableRefObject<HTMLDivElement | null>;
  bgContainerRef?: React.MutableRefObject<HTMLDivElement | null>;
  gridLayoutRef?: React.MutableRefObject<HTMLDivElement | null>;
  isExpanded: boolean;
}

interface DetailLayoutProps {
  children: React.ReactElement<{
    mainContainerRef?: React.MutableRefObject<HTMLDivElement | null>;
    bgContainerRef?: React.MutableRefObject<HTMLDivElement | null>;
    gridLayoutRef?: React.MutableRefObject<HTMLDivElement | null>;
    layoutType: 'masonry' | 'list';
  }>[];
  imageData: any;
  selectedItemId?: string;
  layoutType: 'masonry' | 'list';
}

export default function DetailLayout({ children, imageData, selectedItemId, layoutType }: DetailLayoutProps) {
  const mainContainerRef = useRef<HTMLDivElement>(null);
  const bgContainerRef = useRef<HTMLDivElement>(null);
  const gridLayoutRef = useRef<HTMLDivElement>(null);
  const { selectedItemId: contextSelectedItemId } = useItemDetail();
  const isExpanded = !!contextSelectedItemId;
  const [isFirstRender, setIsFirstRender] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isFirstRender) {
      // 첫 렌더링 시에는 애니메이션 없이 초기 스타일만 적용
      if (mainContainerRef.current && bgContainerRef.current && gridLayoutRef.current) {
        gsap.set(mainContainerRef.current, {
          maxWidth: '960px',
          width: '100%',
          marginLeft: 'auto',
          marginRight: 'auto',
          padding: '0 1rem'
        });

        gsap.set(bgContainerRef.current, {
          backgroundColor: '#1A1A1A',
          borderRadius: '1rem',
          padding: '1.5rem'
        });

        gsap.set(gridLayoutRef.current, {
          gridTemplateColumns: 'minmax(350px, 500px) minmax(350px, 1fr)'
        });
      }
      setIsFirstRender(false);
      return;
    }

    if (contextSelectedItemId && mainContainerRef.current && bgContainerRef.current && gridLayoutRef.current) {
      // 레이아웃 확장
      setIsAnimating(true);
      window.dispatchEvent(new CustomEvent('layoutAnimationStart'));
      
      const tl = gsap.timeline({
        onComplete: () => {
          setIsAnimating(false);
          // 애니메이션 완료 후 그리드 업데이트를 위한 이벤트 발생
          window.dispatchEvent(new CustomEvent('layoutAnimationComplete'));
        }
      });
      
      // 그리드 레이아웃 변경 (먼저 시작)
      tl.to(gridLayoutRef.current, {
        gridTemplateColumns: 'minmax(350px, 500px) minmax(350px, 1fr)',
        duration: 0.4,
        ease: 'power2.inOut'
      });

      // 메인 컨테이너 확장
      tl.to(mainContainerRef.current, {
        maxWidth: '100%',
        width: '100%',
        marginLeft: 0,
        marginRight: 0,
        padding: 0,
        duration: 0.4,
        ease: 'power2.inOut'
      }, '-=0.2');

      // 배경 컨테이너 전환
      tl.to(bgContainerRef.current, {
        backgroundColor: 'transparent',
        borderRadius: 0,
        padding: 0,
        duration: 0.4,
        ease: 'power2.inOut'
      }, '-=0.2');

    } else if (mainContainerRef.current && bgContainerRef.current && gridLayoutRef.current) {
      // 레이아웃 축소
      setIsAnimating(true);
      window.dispatchEvent(new CustomEvent('layoutAnimationStart'));
      
      const tl = gsap.timeline({
        onComplete: () => {
          setIsAnimating(false);
          // 애니메이션 완료 후 그리드 업데이트를 위한 이벤트 발생
          window.dispatchEvent(new CustomEvent('layoutAnimationComplete'));
        }
      });
      
      // 그리드 레이아웃 변경 (먼저 시작)
      tl.to(gridLayoutRef.current, {
        gridTemplateColumns: 'minmax(350px, 500px) minmax(350px, 1fr)',
        duration: 0.4,
        ease: 'power2.inOut'
      });

      // 배경 컨테이너 복원
      tl.to(bgContainerRef.current, {
        backgroundColor: '#1A1A1A',
        borderRadius: '1rem',
        padding: '1.5rem',
        duration: 0.4,
        ease: 'power2.inOut'
      }, '-=0.2');

      // 메인 컨테이너 복원
      tl.to(mainContainerRef.current, {
        maxWidth: '960px',
        width: '100%',
        marginLeft: 'auto',
        marginRight: 'auto',
        padding: '0 1rem',
        duration: 0.4,
        ease: 'power2.inOut'
      }, '-=0.2');
    }
  }, [contextSelectedItemId, isFirstRender]);

  return (
    <div className="min-h-screen pt-16 sm:pt-24 bg-black">
      <div ref={mainContainerRef} className="w-full sm:max-w-[960px] mx-auto px-0 sm:px-4 mb-0 sm:mb-8 lg:mb-16">
        <div ref={bgContainerRef} className="bg-transparent sm:bg-transparent lg:bg-[#1A1A1A] sm:rounded-2xl p-0 sm:p-4 lg:p-6">
          <div 
            ref={gridLayoutRef} 
            className="grid grid-cols-1 lg:grid-cols-[minmax(350px,500px)_minmax(350px,1fr)] items-start justify-center gap-6"
          >
            {React.Children.map(children, child => {
              if (React.isValidElement(child)) {
                return React.cloneElement(child, {
                  mainContainerRef,
                  bgContainerRef,
                  gridLayoutRef,
                  layoutType
                });
              }
              return child;
            })}
          </div>
        </div>
      </div>
    </div>
  );
} 