'use client';

import { HoverItem, ItemDocument,DetailItemDocument } from '@/types/model.d';
import { ClientItemDetailActions } from '@/app/details/[imageId]/item-detail/client/client-actions';

interface ItemDetailViewProps {
  item: HoverItem;
  onClose: () => void;
}

export default function ItemDetailView({ item, onClose }: ItemDetailViewProps) {
  const itemDocument: DetailItemDocument = {
    _id: item.info.item.item._id,
    title: item.info.item.item.metadata.name || '',
    imageUrl: item.info.item.item.img_url || '',
    createdAt: item.info.item.item.created_at || '',
    updatedAt: item.info.item.item.updated_at || '',
    metadata: {
      name: item.info.item.item.metadata.name,
      description: item.info.item.item.metadata.description,
      brand: item.info.item.item.metadata.brand,
      designedBy: item.info.item.item.metadata.designed_by,
      material: item.info.item.item.metadata.material,
      color: item.info.item.item.metadata.color,
      itemClass: item.info.item.item.metadata.item_class,
      itemSubClass: item.info.item.item.metadata.item_sub_class,
      category: item.info.item.item.metadata.category,
      subCategory: item.info.item.item.metadata.sub_category,
      productType: item.info.item.item.metadata.product_type
    },
    links: []
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="h-auto flex flex-col">
        <ClientItemDetailActions 
          item={item}
          itemDocument={itemDocument}
          onClose={onClose}
        />
      </div>
    </div>
  );
} 