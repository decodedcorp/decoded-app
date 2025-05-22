'use client';

import { useRef, useEffect } from 'react';
import React from 'react';
import { DetailsList } from './item-list-section/server/details-list';
import { useItemDetail } from '../context/item-detail-context';
import gsap from 'gsap';

interface DetailsListProps {
  imageData: any;
  selectedItemId?: string;
  mainContainerRef?: React.RefObject<HTMLDivElement>;
  bgContainerRef?: React.RefObject<HTMLDivElement>;
  gridLayoutRef?: React.RefObject<HTMLDivElement>;
}

interface DetailLayoutProps {
  children: React.ReactElement | React.ReactElement[];
  imageData: any;
  selectedItemId?: string;
}

export function DetailLayout({ children, imageData, selectedItemId }: DetailLayoutProps) {
  const mainContainerRef = useRef<HTMLDivElement>(null);
  const bgContainerRef = useRef<HTMLDivElement>(null);
  const gridLayoutRef = useRef<HTMLDivElement>(null);
  const { selectedItemId: contextSelectedItemId } = useItemDetail();

  useEffect(() => {
    if (contextSelectedItemId && mainContainerRef.current && bgContainerRef.current && gridLayoutRef.current) {
      // 레이아웃 확장
      const tl = gsap.timeline();
      
      // 섹션 즉시 사라짐
      tl.set(mainContainerRef.current, {
        maxWidth: '100%',
        width: '100%',
        marginLeft: 0,
        marginRight: 0,
        padding: 0
      });

      tl.set(bgContainerRef.current, {
        backgroundColor: 'transparent',
        borderRadius: 0,
        padding: 0
      });

      // 그리드 레이아웃 변경 (약간의 지연 후)
      tl.to(gridLayoutRef.current, {
        gridTemplateColumns: 'minmax(350px, 500px) minmax(350px, 1fr)',
        duration: 0.5,
        ease: 'power2.inOut',
        delay: 0.2
      });
    } else if (mainContainerRef.current && bgContainerRef.current && gridLayoutRef.current) {
      // 레이아웃 축소
      const tl = gsap.timeline();
      
      // 그리드 레이아웃 변경
      tl.to(gridLayoutRef.current, {
        gridTemplateColumns: 'minmax(350px, 500px) minmax(350px, 1fr)',
        duration: 0.5,
        ease: 'power2.inOut'
      });

      // 섹션 즉시 복원
      tl.set(bgContainerRef.current, {
        backgroundColor: '#1A1A1A',
        borderRadius: '1rem',
        padding: '1.5rem'
      });

      tl.set(mainContainerRef.current, {
        maxWidth: '960px',
        width: '100%',
        marginLeft: 'auto',
        marginRight: 'auto',
        padding: '0 1rem'
      });
    }
  }, [contextSelectedItemId]);

  const childrenWithRefs = React.Children.map(children, child => {
    if (React.isValidElement(child)) {
      if (child.type === DetailsList || (typeof child.type === 'function' && child.type.name === 'DetailsList')) {
        return React.cloneElement(child, {
          mainContainerRef,
          bgContainerRef,
          gridLayoutRef
        } as DetailsListProps);
      }
      return child;
    }
    return child;
  });

  return (
    <div className="min-h-screen pt-16 sm:pt-24 bg-black">
      <div ref={mainContainerRef} className="w-full sm:max-w-[960px] mx-auto px-0 sm:px-4 mb-0 sm:mb-8 lg:mb-16">
        <div ref={bgContainerRef} className="bg-transparent sm:bg-transparent lg:bg-[#1A1A1A] sm:rounded-2xl p-0 sm:p-4 lg:p-6">
          <div 
            ref={gridLayoutRef} 
            className="grid grid-cols-1 lg:grid-cols-[minmax(350px,500px)_minmax(350px,1fr)] items-start justify-center gap-6"
          >
            {childrenWithRefs}
          </div>
        </div>
      </div>
    </div>
  );
} 