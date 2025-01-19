import { DetailPageState, HoverItem } from '@/types/model.d';
import { MainImage } from '../../server/main-image';
import { ImagePopup } from '@/app/details/ui/popup/popup';
import { AddItemButton } from '../add-item-button';

interface ImageSectionProps {
  imageUrl: string;
  detailPageState: DetailPageState;
  currentIndex: number | null;
  isTouch: boolean;
  hoveredItem: number | null;
  onTouch: () => void;
  setHoveredItem: (index: number | null) => void;
  onItemClick: (item: HoverItem) => void;
  onAddItem?: () => void;
}

export function ImageSection({
  imageUrl,
  detailPageState,
  currentIndex,
  isTouch,
  hoveredItem,
  onTouch,
  setHoveredItem,
  onItemClick,
  onAddItem,
}: ImageSectionProps) {
  return (
    <div className="relative w-ful" onClick={onTouch}>
      <MainImage imageUrl={imageUrl} detailPageState={detailPageState} />
      <div className="absolute inset-0 z-10">
        <ImagePopup
          detailPageState={detailPageState}
          currentIndex={currentIndex}
          isTouch={isTouch}
          hoveredItem={hoveredItem}
          setHoveredItem={setHoveredItem}
          onItemClick={onItemClick}
        />
      </div>
    </div>
  );
}
