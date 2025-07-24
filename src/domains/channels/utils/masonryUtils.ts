import { MasonryItem, CtaCardType, EmptyItemType } from '../types/masonry';

// mock 데이터 (신규/인기 랜덤 플래그 추가)
export function getMockItems(): MasonryItem[] {
  return Array.from({ length: 36 }).map((_, i) => ({
    title: [
      'WiseType',
      'Jolie Ngo',
      'Delphine Lejeune',
      'Balmer Hählen',
      'Eunji Lee',
      'Jung-Lee Type Foundry',
      'Studio XYZ',
      'Artisan',
      'Pixel Lab',
      'Soundwave',
      'TypeLab',
      'DesignHub',
    ][i % 12],
    imageUrl: i % 4 === 0 ? undefined : `https://picsum.photos/seed/${i}/400/500`,
    category: [
      'Outerwear',
      'Footwear',
      'Accessories',
      'Bags',
      'Jewelry',
      'Streetwear',
      'Sportswear',
      'Designer',
      'Vintage',
      'Sustainable',
      'Unisex',
      'Kids',
    ][i % 12],
    editors: [
      [
        { name: 'Alice', avatarUrl: 'https://randomuser.me/api/portraits/women/1.jpg' },
        { name: 'Bob', avatarUrl: 'https://randomuser.me/api/portraits/men/2.jpg' },
        { name: 'Carol', avatarUrl: 'https://randomuser.me/api/portraits/women/3.jpg' },
      ],
      [
        { name: 'Dave', avatarUrl: 'https://randomuser.me/api/portraits/men/4.jpg' },
        { name: 'Eve', avatarUrl: 'https://randomuser.me/api/portraits/women/5.jpg' },
        { name: 'Frank', avatarUrl: 'https://randomuser.me/api/portraits/men/6.jpg' },
        { name: 'Grace', avatarUrl: 'https://randomuser.me/api/portraits/women/7.jpg' },
        { name: 'Heidi', avatarUrl: 'https://randomuser.me/api/portraits/women/8.jpg' },
      ],
      [
        { name: 'Ivan', avatarUrl: 'https://randomuser.me/api/portraits/men/9.jpg' },
        { name: 'Judy', avatarUrl: 'https://randomuser.me/api/portraits/women/10.jpg' },
        { name: 'Mallory', avatarUrl: 'https://randomuser.me/api/portraits/women/11.jpg' },
        { name: 'Oscar', avatarUrl: 'https://randomuser.me/api/portraits/men/12.jpg' },
        { name: 'Peggy', avatarUrl: 'https://randomuser.me/api/portraits/women/13.jpg' },
        { name: 'Sybil', avatarUrl: 'https://randomuser.me/api/portraits/women/14.jpg' },
        { name: 'Trent', avatarUrl: 'https://randomuser.me/api/portraits/men/15.jpg' },
      ],
    ][i % 3],
    date: [
      'May 28, 2025',
      'May 28, 2025',
      'Feb 16, 2025',
      'Jan 25, 2025',
      'Jan 18, 2025',
      'Jan 18, 2025',
      'Mar 10, 2025',
      'Apr 2, 2025',
      'Feb 20, 2025',
      'Mar 5, 2025',
      'Apr 15, 2025',
      'May 1, 2025',
    ][i % 12],
    isNew: i % 5 === 0,
    isHot: i % 7 === 0,
  }));
}

// 이미지 없는 카드 분산: 이미지 없는 카드만 따로 추출 후, 일정 간격마다 삽입
export function distributeNoImageCards(items: MasonryItem[]): MasonryItem[] {
  const withImage = items.filter((item) => item.imageUrl);
  const noImage = items.filter((item) => !item.imageUrl);
  const result: MasonryItem[] = [];
  let noImageIdx = 0;
  for (let i = 0; i < withImage.length; i++) {
    result.push(withImage[i]);
    // 5개마다 이미지 없는 카드 삽입
    if ((i + 1) % 5 === 0 && noImageIdx < noImage.length) {
      result.push(noImage[noImageIdx++]);
    }
  }
  // 남은 이미지 없는 카드 뒤에 추가
  while (noImageIdx < noImage.length) {
    result.push(noImage[noImageIdx++]);
  }
  return result;
}

// 비어있는 아이템 추가: 일정 간격마다 채널 추가 아이템 삽입
export function insertEmptyItems(
  items: Array<MasonryItem | CtaCardType>,
  interval = 6,
): Array<MasonryItem | CtaCardType | EmptyItemType> {
  const result: Array<MasonryItem | CtaCardType | EmptyItemType> = [];
  let emptyCount = 0;

  items.forEach((item, idx) => {
    if (idx !== 0 && idx % interval === 0) {
      // 비어있는 아이템 삽입
      const emptyIdx = emptyCount++;
      result.push({
        type: 'empty',
        id: `empty-${idx}`,
        title: 'Add New Channel',
        category: 'Create',
      });
    }
    result.push(item);
  });

  return result;
}

// Masonry 레이아웃 + CTA 카드 랜덤 삽입
export function insertSpecialCards(
  items: MasonryItem[],
  interval = 8,
): Array<MasonryItem | CtaCardType> {
  const result: Array<MasonryItem | CtaCardType> = [];
  let ctaCount = 0;
  items.forEach((item, idx) => {
    if (idx !== 0 && idx % interval === 0) {
      // CTA 카드 종류를 순환/랜덤하게 삽입
      const ctaIdx = ctaCount++ % 3;
      result.push({ type: 'cta', id: `cta-${idx}`, ctaIdx });
    }
    result.push(item);
  });
  return result;
}
