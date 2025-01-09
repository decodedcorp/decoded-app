import { HoverItem } from '@/types/model.d';
import ItemDetailView from './item-detail-view';

interface ItemDetailProps {
  item: HoverItem;
  onClose: () => void;
}

export default function ItemDetail({ item, onClose }: ItemDetailProps) {
  return <ItemDetailView item={item} onClose={onClose} />;
}
