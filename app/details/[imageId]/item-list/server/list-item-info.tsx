import { HoverItem } from '@/types/model.d';

interface ListItemInfoProps {
  item: HoverItem;
  isActive: boolean;
}

export function ListItemInfo({ item, isActive }: ListItemInfoProps) {
  const metadata = item.info?.item?.item?.metadata;
  
  // Primary category (more specific to more general)
  const primaryInfo = metadata?.product_type || 
    metadata?.sub_category || 
    metadata?.item_sub_class;

  // Secondary category (fallback hierarchy)
  const secondaryInfo = metadata?.category || 
    metadata?.item_class;
  
  const displayPrimary = primaryInfo ? primaryInfo.replace(/-/g, ' ') : 'Unknown Type';
  const displaySecondary = secondaryInfo ? secondaryInfo.replace(/-/g, ' ') : 'Unknown Category';

  return (
    <div className="flex flex-col gap-1.5">
      <div className="text-xs text-white/60 capitalize">
        {displaySecondary}
      </div>
      <div className="text-sm text-[#EAFD66] capitalize">
        {displayPrimary}
      </div>
    </div>
  );
}
