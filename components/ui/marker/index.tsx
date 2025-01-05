import { ItemButtonProps } from '@/types/button.d';
import { InfoButton } from './info-button';
import { BrandInfo } from './brand-info';

interface ItemButtonContainerProps extends ItemButtonProps {
  variant?: 'default' | 'search';
}

export function ItemButton({
  item,
  isActive,
  variant = 'default',
  className,
}: ItemButtonContainerProps) {
  return (
    <div className={`relative ${className}`}>
      <BrandInfo
        brandName={item.info.item.brand_name}
        brandLogoUrl={item.info.item.brand_logo_image_url}
        isActive={isActive}
      />
      <InfoButton item={item} isActive={isActive} />
    </div>
  );
}
