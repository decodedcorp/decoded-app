'use client';

import { ItemRow } from './item-row';

export interface ItemListSectionProps {
  items: {
    id: string;
    category: string;
    subCategory: string;
    imageUrl?: string;
  }[];
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
