import type { ApiImage, ImageItemData, ImageDetail } from '../_types/image-grid';

// 더미 이미지 URL들 (Unsplash에서 가져온 무료 이미지들)
const DUMMY_IMAGE_URLS = [
  'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=400&h=400&fit=crop',

];

// 더미 ApiImage 배열 생성
export function createDummyApiImages(count: number): ApiImage[] {
  return Array.from({ length: count }).map((_, i) => ({
    image_doc_id: `dummy-doc-${i}`,
    image_url: DUMMY_IMAGE_URLS[i % DUMMY_IMAGE_URLS.length],
    items: 0,
    at: new Date().toISOString(),
  }));
}

// 더미 ImageItemData 배열 생성
export function createDummyImageItems(count: number): ImageItemData[] {
  return Array.from({ length: count }).map((_, i) => ({
    id: `dummy-${i}`,
    row: Math.floor(i / 5),
    col: i % 5,
    src: DUMMY_IMAGE_URLS[i % DUMMY_IMAGE_URLS.length],
    alt: `Dummy image ${i}`,
    left: (i % 5) * 300,
    top: Math.floor(i / 5) * 300,
    loaded: true,
    image_doc_id: `dummy-doc-${i}`,
    width: 300,
    height: 300,
    likes: Math.floor(Math.random() * 100),
    x: (i % 5) * 300,
    y: Math.floor(i / 5) * 300,
  }));
} 