"use client";

import { ItemButtonProps } from '@/types/button.d';
import { InfoButton } from './info-button';
import { BrandInfo } from './brand-info';
import { useNavigateToDetail } from '@/lib/hooks/common/useNavigateToDetail';
import { useParams } from 'next/navigation';

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

  const handleClick = () => {
    navigateToDetail(item.info.item.item._id, { 
      imageId: params.imageId as string 
    });
  };

  return (
    <div className={`relative ${className}`}>
      <BrandInfo
        brandName={item.info.item.brand_name}
        brandLogoUrl={item.info.item.brand_logo_image_url}
        isActive={isActive}
      />
      <InfoButton 
        item={item} 
        isActive={isActive} 
        onClick={handleClick}
      />
    </div>
  );
}
