import { ItemButtonProps } from '@/types/button.d';
import { SearchButton } from '../search/search-button';
import { InfoButton } from '../info/info-button';

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
      {variant === 'search' ? (
        <SearchButton />
      ) : (
        <InfoButton item={item} isActive={isActive} />
      )}
    </div>
  );
}
