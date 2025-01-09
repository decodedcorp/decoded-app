import { BoxPosition as BoxPositionType } from '../../utils/types';
import { useHeroBannerImage } from '../../utils/heroBannerImage';
import { isEmptyBannerState } from '../../utils/heroBannerImage';
import { PlaceholderContainer } from './components/placeholder-container';
import { BoxPosition } from './components/box-position';

interface BoxContainerProps {
  positions: BoxPositionType;
  leftBoxCount: number;
  rightBoxCount: number;
  onBoxHover?: (
    isHovered: boolean,
    event?: React.MouseEvent,
    isLarge?: boolean
  ) => void;
}

export function BoxContainer({
  positions,
  leftBoxCount,
  rightBoxCount,
  onBoxHover,
}: BoxContainerProps) {
  const { processedImage, loading } = useHeroBannerImage();

  if (isEmptyBannerState(loading, processedImage)) {
    return (
      <PlaceholderContainer
        positions={positions}
        leftBoxCount={leftBoxCount}
        rightBoxCount={rightBoxCount}
        onBoxHover={onBoxHover}
      />
    );
  }

  const { mainImage, itemImages } = processedImage!;

  // Process mainImage to handle null img_url
  const processedMainImage = mainImage && mainImage.img_url ? {
    ...mainImage,
    img_url: mainImage.img_url,
  } : undefined;

  const largeBoxPosition =
    leftBoxCount === 1 && rightBoxCount === 2
      ? 'LEFT_TOP'
      : rightBoxCount === 1 && leftBoxCount === 2
      ? 'RIGHT_TOP'
      : null;

  // Helper function to safely get item image
  const getItemImage = (index: number) => {
    // 아이템이 없거나 인덱스가 범위를 벗어난 경우
    if (!itemImages.length || index >= itemImages.length) {
      // 메인 이미지 정보만 반환 (아이템 정보 없이)
      return mainImage ? {
        doc_id: mainImage.doc_id,
        img_url: null,
        title: null,
        style: null,
      } : undefined;
    }
    
    // 실제 아이템이 있는 경우
    const item = itemImages[index];
    if (!item) {
      return mainImage ? {
        doc_id: mainImage.doc_id,
        img_url: null,
        title: null,
        style: null,
      } : undefined;
    }

    // 아이템 정보 전체 반환 (이미지가 없어도 아이템 정보는 유지)
    return item;
  };

  // Calculate item indices for each position
  const leftTopIndex = 0;
  const leftBottomIndex = leftBoxCount === 1 ? 0 : 1;
  const rightTopIndex = leftBoxCount;
  const rightBottomIndex = leftBoxCount + (rightBoxCount === 2 ? 1 : 0);

  return (
    <div className="relative w-full h-full">
      {positions.LEFT_TOP && (
        <BoxPosition
          top={positions.LEFT_TOP.top}
          left={positions.LEFT_TOP.left}
          isLarge={largeBoxPosition === 'LEFT_TOP'}
          onHover={onBoxHover}
          image={largeBoxPosition === 'LEFT_TOP' ? processedMainImage : getItemImage(leftTopIndex)}
        />
      )}

      {positions.LEFT_BOTTOM && (
        <BoxPosition
          top={positions.LEFT_BOTTOM.top}
          left={positions.LEFT_BOTTOM.left}
          onHover={onBoxHover}
          image={getItemImage(leftBottomIndex)}
        />
      )}

      {positions.RIGHT_TOP && (
        <BoxPosition
          top={positions.RIGHT_TOP.top}
          right={positions.RIGHT_TOP.right}
          isLarge={largeBoxPosition === 'RIGHT_TOP'}
          onHover={onBoxHover}
          image={
            largeBoxPosition === 'RIGHT_TOP'
              ? processedMainImage
              : getItemImage(rightTopIndex)
          }
        />
      )}

      {positions.RIGHT_BOTTOM && (
        <BoxPosition
          top={positions.RIGHT_BOTTOM.top}
          right={positions.RIGHT_BOTTOM.right}
          onHover={onBoxHover}
          image={getItemImage(rightBottomIndex)}
        />
      )}
    </div>
  );
}
