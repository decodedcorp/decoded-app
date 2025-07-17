'use client';

import React, { useRef, useEffect, useState, cloneElement, Children, isValidElement } from 'react';
import { useItemDetail } from '../context/item-detail-context';
import gsap from 'gsap';

interface DetailViewLayoutProps {
  children: React.ReactNode;
  imageData: any;
  selectedItemId?: string;
  layoutType: 'masonry' | 'list';
}

export function DetailViewLayout({ children, imageData, selectedItemId, layoutType }: DetailViewLayoutProps) {
  const mainContainerRef = useRef<HTMLDivElement>(null);
  const bgContainerRef = useRef<HTMLDivElement>(null);
  const gridLayoutRef = useRef<HTMLDivElement>(null);
  const { selectedItemId: contextSelectedItemId } = useItemDetail();
  // selectedItemId prop과 contextSelectedItemId를 구분해야 합니다.
  // UI 확장 여부는 contextSelectedItemId를 사용하고 있으므로 그대로 둡니다.
  const isExpanded = !!contextSelectedItemId;
  const [isFirstRender, setIsFirstRender] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isFirstRender) {
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

    // GSAP 애니메이션 로직 (mainContainerRef, bgContainerRef, gridLayoutRef 사용)
    // 확장 로직
    if (contextSelectedItemId && mainContainerRef.current && bgContainerRef.current && gridLayoutRef.current) {
      setIsAnimating(true);
      window.dispatchEvent(new CustomEvent('layoutAnimationStart'));
      
      const tl = gsap.timeline({
        onComplete: () => {
          setIsAnimating(false);
          window.dispatchEvent(new CustomEvent('layoutAnimationComplete'));
        }
      });
      
      tl.to(gridLayoutRef.current, {
        gridTemplateColumns: 'minmax(350px, 500px) minmax(350px, 1fr)',
        duration: 0.4,
        ease: 'power2.inOut'
      });

      tl.to(mainContainerRef.current, {
        maxWidth: '100%',
        width: '100%',
        marginLeft: 0,
        marginRight: 0,
        padding: 0,
        duration: 0.4,
        ease: 'power2.inOut'
      }, '-=0.2');

      tl.to(bgContainerRef.current, {
        backgroundColor: 'transparent',
        borderRadius: 0,
        padding: 0,
        duration: 0.4,
        ease: 'power2.inOut'
      }, '-=0.2');

    // 축소 로직
    } else if (mainContainerRef.current && bgContainerRef.current && gridLayoutRef.current) {
      setIsAnimating(true);
      window.dispatchEvent(new CustomEvent('layoutAnimationStart'));
      
      const tl = gsap.timeline({
        onComplete: () => {
          setIsAnimating(false);
          window.dispatchEvent(new CustomEvent('layoutAnimationComplete'));
        }
      });
      
      tl.to(gridLayoutRef.current, {
        gridTemplateColumns: 'minmax(350px, 500px) minmax(350px, 1fr)',
        duration: 0.4,
        ease: 'power2.inOut'
      });

      tl.to(bgContainerRef.current, {
        backgroundColor: '#1A1A1A',
        borderRadius: '1rem',
        padding: '1.5rem',
        duration: 0.4,
        ease: 'power2.inOut'
      }, '-=0.2');

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
            {Children.map(children, child => {
              if (isValidElement(child)) {
                // 자식 컴포넌트에 필요한 ref와 props를 전달합니다.
                // 원래 코드에서는 mainContainerRef, bgContainerRef, gridLayoutRef를 전달했습니다.
                // 이 ref들은 DetailViewLayout 내부에서 생성 및 관리됩니다.
                return cloneElement(child as React.ReactElement<any>, {
                  mainContainerRef,
                  bgContainerRef,
                  gridLayoutRef,
                  layoutType // layoutType prop도 자식에게 전달
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