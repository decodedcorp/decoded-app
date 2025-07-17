'use client';

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
  const [isHovered, setIsHovered] = useState(false);
  const [infoPosition, setInfoPosition] = useState<
    | 'default'
    | 'top'
    | 'bottom'
    | 'left'
    | 'right'
    | 'top-right'
    | 'top-left'
    | 'bottom-right'
    | 'bottom-left'
  >('default');

  const handleClick = () => {
    navigateToDetail(item.info.item.item._id, {
      imageId: params.imageId as string,
    });
  };

  useEffect(() => {
    const updatePosition = () => {
      if (!buttonRef.current) return;

      const rect = buttonRef.current.getBoundingClientRect();
      const parentRect =
        buttonRef.current.parentElement?.parentElement?.getBoundingClientRect();

      if (!parentRect) return;

      const relativeTop =
        ((rect.top - parentRect.top) / parentRect.height) * 100;
      const relativeLeft =
        ((rect.left - parentRect.left) / parentRect.width) * 100;

      const EDGE_THRESHOLD = 15;

      // 모서리 케이스 먼저 체크
      if (relativeTop < EDGE_THRESHOLD && relativeLeft < EDGE_THRESHOLD) {
        setInfoPosition('bottom-right'); // 좌상단 모서리
      } else if (
        relativeTop < EDGE_THRESHOLD &&
        relativeLeft > 100 - EDGE_THRESHOLD
      ) {
        setInfoPosition('bottom-left'); // 우상단 모서리
      } else if (
        relativeTop > 100 - EDGE_THRESHOLD &&
        relativeLeft < EDGE_THRESHOLD
      ) {
        setInfoPosition('top-right'); // 좌하단 모서리
      } else if (
        relativeTop > 100 - EDGE_THRESHOLD &&
        relativeLeft > 100 - EDGE_THRESHOLD
      ) {
        setInfoPosition('top-left'); // 우하단 모서리
      }
      // 일반 경계 케이스
      else if (relativeTop < EDGE_THRESHOLD) {
        setInfoPosition('bottom');
      } else if (relativeTop > 100 - EDGE_THRESHOLD) {
        setInfoPosition('top');
      } else if (relativeLeft < EDGE_THRESHOLD) {
        setInfoPosition('right');
      } else if (relativeLeft > 100 - EDGE_THRESHOLD) {
        setInfoPosition('left');
      } else {
        setInfoPosition('default');
      }
    };

    updatePosition();
  }, []);

  return (
    <div
      ref={buttonRef}
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <BrandInfo
        brandName={item.info.item.brand_name}
        brandLogoUrl={item.info.item.brand_logo_image_url}
        isActive={isActive}
        position={infoPosition}
      />
      <InfoButton item={item} isActive={isActive} onClick={handleClick} />
    </div>
  );
}
