import { HoverItem } from './types';

export function createNoImageItem(): HoverItem {
  return {
    id: 'no-image',
    info: {
      category: 'CLOTHING',
      description: 'No information available',
      point: 100,
    },
    brands: [],
    images: [],
    pos: { x: 0, y: 0 },
  };
} 