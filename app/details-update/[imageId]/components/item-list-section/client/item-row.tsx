'use client';

import { cn } from '@/lib/utils/style';
import Image from 'next/image';
import { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { useItemDetail } from '../../../context/item-detail-context';
import { MasonryGrid } from './masonry-grid';

interface ItemRowProps {
  id: string;
  category: string;
  subCategory: string;
  imageUrl?: string;
  mainContainerRef?: React.RefObject<HTMLDivElement>;
  bgContainerRef?: React.RefObject<HTMLDivElement>;
  gridLayoutRef?: React.RefObject<HTMLDivElement>;
}

export function ItemRow({ 
  id, 
  category, 
  subCategory, 
  imageUrl,
  mainContainerRef,
  bgContainerRef,
  gridLayoutRef
}: ItemRowProps) {
  const { selectedItemId, setSelectedItemId } = useItemDetail();
  const isSelected = selectedItemId === id;
  const [showGrid, setShowGrid] = useState(false);
  
  const rowRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const gridContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isSelected) {
      gsap.to(rowRef.current, {
        backgroundColor: '#262626',
        duration: 0.3,
        ease: 'power2.out'
      });
      
      gsap.to(contentRef.current, {
        x: 20,
        duration: 0.3,
        ease: 'power2.out'
      });
    } else {
      gsap.to(rowRef.current, {
        backgroundColor: 'transparent',
        duration: 0.3,
        ease: 'power2.out'
      });
      
      gsap.to(contentRef.current, {
        x: 0,
        duration: 0.3,
        ease: 'power2.out'
      });
    }
  }, [isSelected]);

  useEffect(() => {
    setShowGrid(!!selectedItemId);
  }, [selectedItemId]);

  const handleItemClick = () => {
    setSelectedItemId(isSelected ? null : id);
  };

  const handleBackClick = () => {
    setSelectedItemId(null);
  };

  return (
    <>
      {!showGrid && (
        <div
          ref={rowRef}
          onClick={handleItemClick}
          className={cn(
            'flex items-center px-3 py-3.5 hover:bg-neutral-900 cursor-pointer group',
            isSelected && 'bg-neutral-900'
          )}
        >
          <div className="w-16 h-16 rounded bg-neutral-800 mr-3 overflow-hidden flex-shrink-0">
            {imageUrl && (
              <Image
                src={imageUrl}
                alt={category}
                width={64}
                height={64}
                className="w-full h-full object-cover"
                unoptimized
              />
            )}
          </div>
          <div ref={contentRef} className="flex-1 space-y-0.5">
            <div className="text-xs text-neutral-400 font-medium">{category}</div>
            <div className="text-xs text-neutral-500">{subCategory}</div>
          </div>
          <div className="text-neutral-600 group-hover:text-neutral-400 transition-colors">
            <svg
              className={cn(
                'w-4 h-4 transition-transform',
                isSelected && 'rotate-90'
              )}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </div>
      )}

      {showGrid && isSelected && (
        <div 
          ref={gridContainerRef}
          className="w-full"
        >
          <MasonryGrid 
            category={category}
            subCategory={subCategory}
            onBackClick={handleBackClick}
          />
        </div>
      )}
    </>
  );
}
