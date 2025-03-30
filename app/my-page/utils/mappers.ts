import { 
  MasonryItem, 
  LikedImage, 
  ProvideItem, 
  RequestData,
  MyPageItemBase
} from '../types';

/**
 * 다양한 타입의 마이페이지 데이터를 MasonryItem 배열로 변환하는 유틸리티 함수
 * 이미지만 표시하고 제목은 제외
 * 
 * @param items 변환할 아이템 배열
 * @param startIndex 시작 인덱스
 * @param groupKey 그룹 키
 * @returns MasonryItem 배열
 */
export function mapItemsToMasonryItems<T extends MyPageItemBase>(
  items: T[],
  startIndex: number = 0,
  groupKey: number = 0
): MasonryItem[] {
  return items.map((item, index) => {
    // UUID 생성 방식으로 변경 (간단한 구현)
    const randomPart = Math.random().toString(36).substring(2, 10);
    const uniqueId = `id_${item.image_doc_id}_${startIndex + index}_${groupKey}_${randomPart}`;
    
    // 랜덤한 비율 생성 (0.6 ~ 1.2 사이, 0.6은 세로로 긴 이미지, 1.2는 가로로 긴 이미지)
    // 값이 작을수록 이미지가 세로로 길어짐, 값이 클수록 가로로 길어짐
    const randomAspectRatio = 0.6 + Math.random() * 0.6;
    
    return {
      id: uniqueId,
      key: uniqueId, // key도 동일한 고유 ID 사용
      groupKey,
      data: {
        imageUrl: item.image_url,
        imageDocId: item.image_doc_id,
        aspectRatio: randomAspectRatio // 랜덤 비율 추가
      }
    };
  });
}

/**
 * 좋아요 이미지 데이터를 MasonryItem 배열로 변환
 */
export function mapLikesToMasonryItems(
  likes: LikedImage[],
  startIndex: number = 0,
  groupKey: number = 0
): MasonryItem[] {
  return mapItemsToMasonryItems(
    likes,
    startIndex,
    groupKey
  );
}

/**
 * 제공 데이터를 MasonryItem 배열로 변환
 */
export function mapProvidesToMasonryItems(
  provides: ProvideItem[],
  startIndex: number = 0,
  groupKey: number = 0
): MasonryItem[] {
  return mapItemsToMasonryItems(
    provides,
    startIndex,
    groupKey
  );
}

/**
 * 요청 데이터를 MasonryItem 배열로 변환
 */
export function mapRequestsToMasonryItems(
  requests: RequestData[],
  startIndex: number = 0,
  groupKey: number = 0
): MasonryItem[] {
  return mapItemsToMasonryItems(
    requests,
    startIndex,
    groupKey
  );
} 