import { DecodedItem } from '@/lib/api/types/image';
import { ItemListSection } from '../client/item-list';
import { getCategoryInfo } from '../../../../utils/hooks/category';
import { ItemActionsWrapper } from '../client/item-actions-wrapper';
import { DetailSlideSection } from '../../item-detail-section/detail-slide-section';
interface DetailsListProps {
  imageData: {
    items: DecodedItem[];
    img_url: string;
    title: string | null;
    description: string;
    like: number;
    doc_id: string;
    style: string | null;
    decoded_percent: number;
  };
  selectedItemId?: string;
}

export function DetailsList({ imageData, selectedItemId }: DetailsListProps) {
  // 데이터 유효성 검사
  if (!imageData || !Array.isArray(imageData.items)) {
    console.error('Invalid imageData:', imageData);
    return null;
  }

  const { items } = imageData;

  // 아이템 데이터 변환
  const processedItems = items
    .map((item) => {
      try {
        const metadata = item?.item?.item?.metadata;
        if (!metadata) return null;

        const categories = getCategoryInfo(metadata);
        const category = categories.find((cat) => cat.depth === 3)?.displayName;
        const subCategory = categories.find(
          (cat) => cat.depth === 4
        )?.displayName;

        // Return null if required fields are missing
        if (!category || !subCategory || !item?.item?.item?._id) return null;

        return {
          category,
          subCategory,
          imageUrl: item?.item?.item?.img_url || undefined, // null을 undefined로 변환
          id: item?.item?.item?._id,
        };
      } catch (error) {
        console.error('Error processing item:', error);
        return null;
      }
    })
    .filter((item): item is NonNullable<typeof item> => item !== null); // type guard 추가

  // 최상위 카테고리 찾기
  const topLevelCategory =
    items
      .map((item) => getCategoryInfo(item?.item?.item?.metadata))
      .flat()
      .find((cat) => cat?.depth === 1)?.displayName || 'FASHION';

  return (
    <div className="w-full h-full flex flex-col relative">
      {/* 기본 컨텐츠 */}
      <div className="w-full h-full flex flex-col">
        {/* 헤더: 제목이 있을 때만 표시 */}
        {imageData.title && (
          <div className="px-3 py-2.5 border-b border-neutral-800">
            <h1 className="text-sm text-neutral-300 font-medium truncate">
              {imageData.title}
            </h1>
          </div>
        )}

        {/* 카테고리 헤더 */}
        <div className="px-3 pb-2.5 border-b border-neutral-800">
          <h2 className="text-sm font-medium text-neutral-400">
            {topLevelCategory}
          </h2>
        </div>

        {/* 아이템 리스트 */}
        <div className="flex-1 min-h-0">
          <ItemListSection items={processedItems} />
        </div>

        {/* 푸터: 기능 버튼들 */}
        <div className="px-4 pt-3 border-t border-neutral-800">
          <ItemActionsWrapper
            initialLikeCount={imageData.like || 0}
            imageId={imageData.doc_id}
          />
        </div>
      </div>

      {/* 상세 정보 슬라이드 오버레이 */}
      <DetailSlideSection />
    </div>
  );
}
