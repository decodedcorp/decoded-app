'use client';

import { ItemRow } from './item-row';

interface ProcessedItem {
  category: string;
  subCategory: string;
  imageUrl: string;
  id: string;
}

interface ItemListSectionProps {
  items: ProcessedItem[];
}

export function ItemListSection({ items }: ItemListSectionProps) {
  return (
    <div className="relative h-full">
      <div className="h-full overflow-y-auto">
        {items.map((item) => (
          <ItemRow
            key={item.id}
            id={item.id}
            category={item.category}
            subCategory={item.subCategory}
            imageUrl={item.imageUrl}
          />
        ))}
      </div>
    </div>
  );
}
