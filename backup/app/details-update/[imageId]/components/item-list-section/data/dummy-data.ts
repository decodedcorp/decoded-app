// 더미 아이템 인터페이스
export interface DummyItem {
  type: 'image' | 'video' | 'shorts' | 'portrait' | 'square';
  imageUrl: string;
  videoId?: string;
  title?: string;
  groupKey: number;
  key: number;
}

// YouTube 썸네일 URL 가져오기
export function getYouTubeThumbnail(videoId: string, quality: 'default' | 'hq' | 'mq' | 'sd' | 'maxres' = 'default') {
  return `https://img.youtube.com/vi/${videoId}/${quality}default.jpg`;
}

// 더미 아이템 목록 생성
export function fetchDummyItems(groupKey: number, count: number): DummyItem[] {
  const items: DummyItem[] = [];
  const types: ('image' | 'video' | 'shorts' | 'portrait' | 'square')[] = ['image', 'video', 'shorts', 'portrait', 'square'];
  
  // 패션 관련 YouTube 비디오 ID
  const videoIds = [
    'dQw4w9WgXcQ', // 패션 룩북
    '9bZkp7q19f0', // 스타일링 팁
    'JGwWNGJdvx8', // 패션 트렌드
    'kJQP7kiw5Fk', // 스트리트 패션
    'hT_nvWreIhg', // 패션 쇼
    'RgKAFK5djSk', // 패션 리뷰
    'fRh_vgS2dFE', // 패션 하울
    'OPf0YbXqDm0', // 패션 브랜드
    '09R8_2nJtjg', // 패션 디자인
    'YQHsXMglC9A', // 패션 트렌드
  ];
  
  // 패션 관련 이미지 URL
  const imageUrls = [
    'https://images.unsplash.com/photo-1483985988355-763728e1935b', // 패션 쇼핑
    'https://images.unsplash.com/photo-1490481651871-ab68de25d43d', // 패션 모델
    'https://images.unsplash.com/photo-1445205170230-053b83016050', // 패션 스타일
    'https://images.unsplash.com/photo-1529139574466-a303027c1d8b', // 패션 포즈
    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f', // 패션 룩
    'https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc', // 패션 스트리트
    'https://images.unsplash.com/photo-1496747611176-843222e1e57c', // 패션 디테일
    'https://images.unsplash.com/photo-1485968579580-b6d095142e6e', // 패션 액세서리
    'https://images.unsplash.com/photo-1490481651871-ab68de25d43d', // 패션 포즈
    'https://images.unsplash.com/photo-1485968579580-b6d095142e6e', // 패션 스타일
    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f', // 패션 룩
    'https://images.unsplash.com/photo-1445205170230-053b83016050', // 패션 모델
    'https://images.unsplash.com/photo-1529139574466-a303027c1d8b', // 패션 스타일
    'https://images.unsplash.com/photo-1496747611176-843222e1e57c', // 패션 디테일
  ];
  
  // 패션 관련 제목
  const titles = [
    'Spring Collection 2024',
    'Summer Street Style',
    'Urban Fashion Look',
    'Minimalist Wardrobe',
    'Luxury Fashion Show',
    'Street Style Inspiration',
    'Fashion Week Highlights',
    'Trendy Outfit Ideas',
    'Fashion Editorial',
    'Style Guide 2024',
    'Fashion Trends',
    'Street Fashion',
    'Fashion Photography',
    'Style Inspiration'
  ];
  
  // 아이템 생성
  for (let i = 0; i < count; i++) {
    const typeIndex = Math.floor(Math.random() * types.length);
    const type = types[typeIndex];
    const key = groupKey * count + i;
    
    let item: DummyItem = {
      key,
      groupKey,
      type,
      imageUrl: imageUrls[Math.floor(Math.random() * imageUrls.length)],
      title: titles[Math.floor(Math.random() * titles.length)],
    };
    
    // 비디오 타입이면 비디오 ID 추가
    if (type === 'video' || type === 'shorts') {
      item.videoId = videoIds[Math.floor(Math.random() * videoIds.length)];
    }
    
    items.push(item);
  }
  
  return items;
} 