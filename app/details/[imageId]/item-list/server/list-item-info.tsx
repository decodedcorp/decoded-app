import { HoverItem } from '@/types/model.d';

interface ListItemInfoProps {
  item: HoverItem;
  isActive: boolean;
}

export function ListItemInfo({ item, isActive }: ListItemInfoProps) {
  const category = item.info?.item?.item?.metadata?.category;
  const subCategory = item.info?.item?.item?.metadata?.sub_category;

  return (
    <div className="flex flex-col gap-1.5">
      <div className="text-xs text-white/60 capitalize">
        {category?.replace(/-/g, ' ')}
      </div>
      <div className="text-sm text-[#EAFD66] capitalize">
        {subCategory?.replace(/-/g, ' ')}
      </div>
    </div>
  );
}
