'use client';

import React, { useRef, useEffect, useState, cloneElement, Children, isValidElement } from 'react';
import { useItemDetail } from '../context/item-detail-context';
import gsap from 'gsap';

// DetailsListProps는 이 파일에서 직접 사용되지 않는다면 제거하거나,
// 필요하다면 해당 컴포넌트로 옮기거나 올바르게 정의해야 합니다.
// interface DetailsListProps {
//   imageData: any;
//   selectedItemId?: string;
//   mainContainerRef?: React.RefObject<HTMLDivElement>;
//   bgContainerRef?: React.RefObject<HTMLDivElement>;
//   gridLayoutRef?: React.RefObject<HTMLDivElement>;
//   isExpanded: boolean;
// }

interface DetailSectionLayoutProps {
  children: React.ReactNode; // children은 ReactNode로 유지
  imageData: any; // 이 prop이 실제로 사용되는지 확인 필요
  selectedItemId?: string; // 이 prop이 실제로 사용되는지 확인 필요
  layoutType: 'masonry' | 'list';
}

export function DetailSectionLayout({ children, imageData, selectedItemId, layoutType }: DetailSectionLayoutProps) {
  const mainContainerRef = useRef<HTMLDivElement>(null);
  const bgContainerRef = useRef<HTMLDivElement>(null);
  const gridLayoutRef = useRef<HTMLDivElement>(null);
  const { selectedItemId: contextSelectedItemId } = useItemDetail();
  const isExpanded = !!contextSelectedItemId; // 컨텍스트의 selectedItemId를 기준으로 확장 여부 결정
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

    const currentMainContainer = mainContainerRef.current;
    const currentBgContainer = bgContainerRef.current;
    const currentGridLayout = gridLayoutRef.current;

    if (!currentMainContainer || !currentBgContainer || !currentGridLayout) {
      return;
    }

    setIsAnimating(true);
    window.dispatchEvent(new CustomEvent('layoutAnimationStart'));

    const tl = gsap.timeline({
      onComplete: () => {
        setIsAnimating(false);
        window.dispatchEvent(new CustomEvent('layoutAnimationComplete'));
      }
    });

    if (contextSelectedItemId) { // 확장
      tl.to(currentGridLayout, {
        gridTemplateColumns: 'minmax(350px, 500px) minmax(350px, 1fr)', // 이 값은 확장/축소 시 동일하므로, 애니메이션 대상이 맞는지 확인 필요
        duration: 0.4,
        ease: 'power2.inOut'
      })
      .to(currentMainContainer, {
        maxWidth: '100%',
        width: '100%',
        marginLeft: 0,
        marginRight: 0,
        padding: 0,
        duration: 0.4,
        ease: 'power2.inOut'
      }, '-=0.2')
      .to(currentBgContainer, {
        backgroundColor: 'transparent',
        borderRadius: 0,
        padding: 0,
        duration: 0.4,
        ease: 'power2.inOut'
      }, '-=0.2');
    } else { // 축소
      tl.to(currentGridLayout, { // 이 값은 확장/축소 시 동일하므로, 애니메이션 대상이 맞는지 확인 필요
        gridTemplateColumns: 'minmax(350px, 500px) minmax(350px, 1fr)',
        duration: 0.4,
        ease: 'power2.inOut'
      })
      .to(currentBgContainer, {
        backgroundColor: '#1A1A1A',
        borderRadius: '1rem',
        padding: '1.5rem',
        duration: 0.4,
        ease: 'power2.inOut'
      }, '-=0.2') // 순서 변경: 배경 복원 후 메인 컨테이너 복원
      .to(currentMainContainer, {
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
                // 자식 컴포넌트에 필요한 props를 전달합니다.
                // mainContainerRef, bgContainerRef, gridLayoutRef는 이 컴포넌트 내부의 것이므로
                // 자식에게 직접 전달할 필요는 없습니다. layoutType은 전달합니다.
                return cloneElement(child as React.ReactElement<any>, {
                  // mainContainerRef, // 내부 ref이므로 전달 X
                  // bgContainerRef,    // 내부 ref이므로 전달 X
                  // gridLayoutRef,     // 내부 ref이므로 전달 X
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