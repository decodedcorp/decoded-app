// 타입 정의
export interface DummyItem {
  id: string;
  imageUrl: string;
  type: 'item' | 'portrait' | 'video' | 'shorts';
  videoId?: string;
  title?: string;
  description?: string;
}

// 아이템 이미지 URL 배열
export const itemImages = [
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT7ZaRyRm8eYJ7KU9PZUoPtJBd5mCHWQb5OOA&s',
  'https://gbghcdn.cafe24.com/category9/24Q4/C44002EMFO1/BLU/02.jpg',
  'https://sitem.ssgcdn.com/51/41/74/item/1000566744151_i1_750.jpg',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSTlJkd224Krd3sdrvFAo86En2IE4WDesb6YczeKP_Si0tMb88H8aA9Klfi28W-AC_wxRo&usqp=CAU',
  'https://ambient.diskn.com/detailimg/24SS/WOMEN/pants/IW2D2PT29/charcoal/d01.jpg',
  'https://image.msscdn.net/thumbnails/images/goods_img/20250409/5008109/5008109_17442602015132_big.jpg?w=1200',
  'https://images.unsplash.com/photo-1579338559194-a162d19bf842',
  'https://images.unsplash.com/photo-1596755094514-f87e34085b2c',
];

// 인물 이미지 URL 배열
export const portraitImages = [
  'https://talkimg.imbc.com/TVianUpload/tvian/TViews/image/2023/05/18/da5c3b77-a0ce-4c18-b016-1b2a23ee4846.jpg',
  'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e',
  'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126',
  'https://images.unsplash.com/photo-1504439904031-93ded9f93e4e',
  'https://images.unsplash.com/photo-1618721405821-80ebc4b63d26',
  'https://i.namu.wiki/i/t_k13EpUnQRqmjrQt60CLlz_4_h6u3G8dDqTyMS6QqFZicXKXtzMYe-6eS0Bt8-FOqjg6_6bSB6IxJO5neoyyA.webp',
];

// 비디오 이미지 URL 배열
export const videoImages = [
  'https://images.unsplash.com/photo-1536240478700-b869070f9279',
  'https://images.unsplash.com/photo-1517649763962-0c623066013b',
  'https://images.unsplash.com/photo-1536146021566-627ce3c4d813',
  'https://images.unsplash.com/photo-1485846234645-a62644f84728',
  'https://images.unsplash.com/photo-1496559249665-c7e2874707ea',
];

// 쇼츠 이미지 URL 배열
export const shortsImages = [
  'https://www.youtube.com/shorts/kycsWDAfY2Y',
  'https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac',
  'https://images.unsplash.com/photo-1554080353-a576cf803bda',
  'https://images.unsplash.com/photo-1598550473359-9eb3809562b5',
  'https://images.unsplash.com/photo-1601469090944-c488be3157a7',
];

// YouTube 비디오 ID 배열
export const videoIds = [
  '5N0HeZvrrv8', 
  'jWQx2f-CErU', 
  'phuiiNCxRMg', 
  'Os_heh8vPfs', 
  'D8VEhcPeSlc'  
];

// YouTube 쇼츠 ID 배열
export const shortsIds = [
  'kycsWDAfY2Y', 
  'TClgsgqM9N0',
  'GwpSjRINEvQ',
  '5JnAJJDkPjk',
  'Gc3jmRynGeE',
  'y4Aq4W2aVgc'
];

// 타입에 따라 이미지를 생성하는 유틸리티 함수
export const getImageForType = (type: string, index: number): string => {
  const images = 
    type === 'portrait' ? portraitImages :
    type === 'video' ? videoImages :
    type === 'shorts' ? shortsImages : itemImages;
  
  return `${images[index % images.length]}?w=500&auto=format&fit=crop&q=80`;
};

// YouTube 썸네일 URL 생성 함수
export const getYouTubeThumbnail = (videoId: string, quality: 'default' | 'mq' | 'hq' | 'sd' | 'max' = 'hq') => {
  return `https://img.youtube.com/vi/${videoId}/${quality}default.jpg`;
};

// 더미 데이터를 생성하는 함수
export const generateDummyItems = (
  startKey: number, 
  count: number
): Array<DummyItem & { groupKey: number, key: number }> => {
  const types: ('item' | 'portrait' | 'video' | 'shorts')[] = ['item', 'portrait', 'video', 'shorts'];
  const nextItems = [];
  
  for (let i = 0; i < count; ++i) {
    const key = startKey + i;
    const type = types[i % types.length];
    let url = '';
    let videoId = '';
    
    // 타입에 따라 URL 및 비디오 ID 할당
    if (type === 'video') {
      videoId = videoIds[key % videoIds.length];
      url = `https://www.youtube.com/watch?v=${videoId}`;
    } else if (type === 'shorts') {
      videoId = shortsIds[key % shortsIds.length];
      url = `https://youtube.com/shorts/${videoId}`;
    } else {
      // 이미지 타입은 해당 타입의 이미지 배열에서 선택
      url = getImageForType(type, key);
    }
    
    nextItems.push({
      id: `item-${key}`,
      groupKey: Math.floor(key / count),
      key,
      type,
      imageUrl: url,
      videoId,
      title: `${type.charAt(0).toUpperCase() + type.slice(1)} ${key}`,
      description: `This is a ${type} item with ID ${key}`
    });
  }
  
  return nextItems;
};

// 페이징 처리를 위한 함수
export const fetchDummyItems = (page: number, pageSize: number = 20) => {
  const startKey = page * pageSize;
  return generateDummyItems(startKey, pageSize);
}; 