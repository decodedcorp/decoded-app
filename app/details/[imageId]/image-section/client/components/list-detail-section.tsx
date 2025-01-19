import { useCategories } from '@/lib/hooks/features/ui/useCategories';
import { HoverItem, DetailPageState } from '@/types/model.d';
import { ListHeader } from '@/app/details/[imageId]/item-list/client/list-header';
import { ListItems } from '@/app/details/[imageId]/item-list/client/list-items';
import ItemDetailView from '@/app/details/[imageId]/item-detail/server/item-detail-view';

interface ListDetailSectionProps {
  itemList: HoverItem[];
  isDetailVisible: boolean;
  selectedItem: HoverItem | null;
  currentIndex: number | null;
  hoveredItem: number | null;
  detailPageState: DetailPageState;
  setCurrentIndex: (index: number | null) => void;
  setHoveredItem: (index: number | null) => void;
  setSelectedItem: (item: HoverItem | null) => void;
  onItemClick: (item: HoverItem) => void;
  onBack: () => void;
}

export function ListDetailSection({
  detailPageState,
  itemList,
  isDetailVisible,
  selectedItem,
  currentIndex,
  hoveredItem,
  setCurrentIndex,
  setHoveredItem,
  setSelectedItem,
  onItemClick,
  onBack,
}: ListDetailSectionProps) {
  const {
    activeCategory,
    setActiveCategory,
    availableCategories,
    filteredItems,
  } = useCategories({ itemList });

  return (
    <div className="w-[388px] shrink-0">
      <div className="relative h-full overflow-hidden">
        {/* 리스트 뷰 */}
        <div
          className={`absolute inset-0 flex flex-col transition-transform duration-300 ease-in-out ${
            isDetailVisible ? '-translate-x-full' : 'translate-x-0'
          }`}
        >
          <div className="flex flex-col h-full">
            <ListHeader
              onCategoryChange={setActiveCategory}
              availableCategories={availableCategories}
              itemList={itemList}
              detailPageState={detailPageState}
            />
            <div className="flex-1 min-h-0 overflow-y-auto">
              <ListItems
                items={filteredItems}
                currentIndex={currentIndex}
                setCurrentIndex={setCurrentIndex}
                hoveredItem={hoveredItem}
                setHoveredItem={setHoveredItem}
                onItemClick={onItemClick}
              />
            </div>
          </div>
        </div>

        {/* 상세 뷰 */}
        <div
          className={`absolute inset-0 flex flex-col transition-transform duration-300 ease-in-out ${
            isDetailVisible ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {selectedItem && (
            <ItemDetailView
              key={selectedItem.info.item.item._id}
              item={selectedItem}
              onClose={() => {
                onBack();
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
