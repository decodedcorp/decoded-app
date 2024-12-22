import { HoverItem } from '@/types/model.d';

interface ListItemInfoProps {
  item: HoverItem;
  isActive: boolean;
}

export function ListItemInfo({ item, isActive }: ListItemInfoProps) {
  return (
    <div className="flex flex-col justify-center flex-1 min-w-0">
      <div className="text-xs text-white/40 mb-1">
        {item.info.category?.toUpperCase()}
      </div>
      <div className="text-xs text-white/60 mb-1">
        {item.info.brands?.[0].replace(/_/g, ' ').toUpperCase()}
      </div>
      <div className="text-sm text-white truncate">
        {item.info.name}
      </div>
    </div>
  );
} 