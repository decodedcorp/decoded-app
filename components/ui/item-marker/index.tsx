"use client";

import { ItemButtonProps } from '@/types/button.d';
import { InfoButton } from './info-button';
import { BrandInfo } from './brand-info';
import { useNavigateToDetail } from '@/lib/hooks/common/useNavigateToDetail';
import { useParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

interface ItemButtonContainerProps extends ItemButtonProps {
  variant?: 'default' | 'search';
}

export function ItemButton({
  item,
  isActive,
  variant = 'default',
  className,
}: ItemButtonContainerProps) {
  const params = useParams();
  const navigateToDetail = useNavigateToDetail();
  const buttonRef = useRef<HTMLDivElement>(null);
  const [brandInfoPosition, setBrandInfoPosition] = useState<'top' | 'bottom' | 'left' | 'right'>('top');

  const handleClick = () => {
    navigateToDetail(item.info.item.item._id, { 
      imageId: params.imageId as string 
    });
  };

  useEffect(() => {
    const checkPosition = () => {
      if (!buttonRef.current) return;
      
      const rect = buttonRef.current.getBoundingClientRect();
      const parentRect = buttonRef.current.parentElement?.getBoundingClientRect();
      
      if (!parentRect) return;

      // 버튼이 부모 컨테이너의 경계에 얼마나 가까운지 계산
      const topSpace = rect.top - parentRect.top;
      const bottomSpace = parentRect.bottom - rect.bottom;
      const leftSpace = rect.left - parentRect.left;
      const rightSpace = parentRect.right - rect.right;

      // 여백이 부족한 방향 확인 (예: 20px 기준)
      const MARGIN = 20;
      
      if (topSpace < MARGIN) {
        setBrandInfoPosition('bottom');
      } else if (bottomSpace < MARGIN) {
        setBrandInfoPosition('top');
      } else if (leftSpace < MARGIN) {
        setBrandInfoPosition('right');
      } else if (rightSpace < MARGIN) {
        setBrandInfoPosition('left');
      } else {
        setBrandInfoPosition('top'); // 기본값
      }
    };

    checkPosition();
    window.addEventListener('resize', checkPosition);
    return () => window.removeEventListener('resize', checkPosition);
  }, []);

  return (
    <div ref={buttonRef} className={`relative ${className}`}>
      <BrandInfo
        brandName={item.info.item.brand_name}
        brandLogoUrl={item.info.item.brand_logo_image_url}
        isActive={isActive}
        position={brandInfoPosition}
      />
      <InfoButton 
        item={item} 
        isActive={isActive} 
        onClick={handleClick}
      />
    </div>
  );
}
