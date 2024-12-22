import { ItemButtonProps } from '@/types/button.d';
import { SearchButton } from '../search/search-button';
import { InfoButton } from '../info/info-button';
import { ItemDetailPopup } from '../../popup/item-detail-popup';

interface ItemButtonContainerProps extends ItemButtonProps {
  variant?: 'default' | 'search';
}

export function ItemButton({
  item,
  isActive,
  variant = 'default',
  position = 'right',
  className,
}: ItemButtonContainerProps) {
  return (
    <div className={`relative ${className}`}>
      {variant === 'search' ? (
        <SearchButton />
      ) : (
        <InfoButton item={item} isActive={isActive} />
      )}
      <ItemDetailPopup item={item} isVisible={isActive} position={position} />
    </div>
  );
}
