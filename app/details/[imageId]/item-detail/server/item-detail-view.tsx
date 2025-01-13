import { HoverItem, ItemDocument } from '@/types/model.d';
import { ClientItemDetailActions } from '@/app/details/[imageId]/item-detail/client/client-actions';

interface ItemDetailViewProps {
  item: HoverItem;
  onClose: () => void;
}

export default function ItemDetailView({ item, onClose }: ItemDetailViewProps) {
  // Transform HoverItem to ItemDocument
  const itemDocument: ItemDocument = {
    Id: item.info.item.item._id,
    requester: '',
    requestedAt: new Date().toISOString(),
    imgUrl: item.info.item.item.img_url || undefined,
    like: 0,
    metadata: {
      name: item.info.item.item.metadata.name || undefined,
      category: item.info.item.item.metadata.category || undefined,
      description: item.info.item.item.metadata.description || undefined,
    }
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