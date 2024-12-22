import { NoImageItem } from './types';

// 실제 데이터가 연동되면 이 부분은 API 응답으로 대체됩니다.
const MOCK_NO_IMAGE_ITEM: NoImageItem = {
  info: {
    name: 'NO IMAGE',
    brands: ['DECODED'],
    affiliateUrl: '#',
    imageUrl: '',
    description: '이미지가 없는 아이템입니다.',
    price: ['', ''] as [string, string],
    category: 'no-image',
    hyped: 0,
    points: 100,
  },
  pos: {
    top: '0%',
    left: '0%',
  },
};

export function createNoImageItem(): NoImageItem {
  // 실제 구현에서는 API 호출로 대체됩니다.
  return MOCK_NO_IMAGE_ITEM;
} 