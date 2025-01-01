import { ItemButtonProps } from '@/types/button.d';
import { InfoButton } from './info-button';

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
      <InfoButton item={item} isActive={isActive} />
    </div>
  );
}
