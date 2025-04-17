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
  
  // 비디오 ID 예시
  const videoIds = [
    'dQw4w9WgXcQ', // Rick Astley - Never Gonna Give You Up
    '9bZkp7q19f0', // PSY - Gangnam Style
    'JGwWNGJdvx8', // Ed Sheeran - Shape of You
    'kJQP7kiw5Fk', // Luis Fonsi - Despacito
    'hT_nvWreIhg', // OneRepublic - Counting Stars
    'RgKAFK5djSk', // Wiz Khalifa - See You Again
    'fRh_vgS2dFE', // Justin Bieber - Sorry
    'OPf0YbXqDm0', // Mark Ronson - Uptown Funk
    '09R8_2nJtjg', // Maroon 5 - Sugar
    'YQHsXMglC9A', // Adele - Hello
  ];
  
  // 이미지 예시
  const imageUrls = [
    'https://images.unsplash.com/photo-1541888946425-d81bb19240f5',
    'https://images.unsplash.com/photo-1664575602554-2087b04935a5',
    'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61',
    'https://images.unsplash.com/photo-1664575600397-88fb18a55bd4',
    'https://images.unsplash.com/photo-1664575600796-ffa828c5cb6e',
    'https://images.unsplash.com/photo-1664575601786-b00156752b61',
    'https://images.unsplash.com/photo-1664575601907-65d3db8b627a',
    'https://images.unsplash.com/photo-1664575602276-972ec64add77',
    'https://images.unsplash.com/photo-1664575601141-9b91422ed141',
    'https://images.unsplash.com/photo-1664575601329-1ba3fa96b30e',
    'https://images.unsplash.com/photo-1664575601555-32dbb6594ee7',
    'https://images.unsplash.com/photo-1664575601446-49513e88d96f',
    'https://images.unsplash.com/photo-1664575601746-8dae132efb05',
    'https://images.unsplash.com/photo-1664575601689-2cefdbe553b8',
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
      title: `Item ${key}`,
    };
    
    // 비디오 타입이면 비디오 ID 추가
    if (type === 'video' || type === 'shorts') {
      item.videoId = videoIds[Math.floor(Math.random() * videoIds.length)];
    }
    
    items.push(item);
  }
  
  return items;
} 