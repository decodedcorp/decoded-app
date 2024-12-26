import { HoverItem } from '@/types/model.d';

export function createNoImageItem(): HoverItem {
  return {
    id: 'no-image',
    info: {
      name: 'No Information Item',
      category: 'CLOTHING',
      description: 'No information available',
      brands: [],
      imageUrl: '',
      affiliateUrl: '',
      price: ['', ''],
      hyped: 0,
    },
    pos: {
      top: '0',
      left: '0',
    }
  };
} 