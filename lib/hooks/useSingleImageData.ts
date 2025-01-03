import { useState, useEffect } from 'react';
import { imagesAPI } from '@/lib/api/images';
import {
  DetailPageState,
  HoverItem,
  ImagePosition,
  ItemInfo,
} from '@/types/model';

export interface ImageDetail {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  updateAt: Date;
  hyped: number;
  items: {
    position: ImagePosition;
    identity: {
      id: string;
      name: string;
      category: string;
      profileImageUrl?: string;
    };
    category: {
      itemClass: string;
      itemSubClass: string;
      category?: string;
      subCategory?: string;
      productType: string;
    };
  }[];
}

export function useSingleImageData(imageId: string, isFeatured: boolean) {
  const [detailPageState, setDetailPageState] =
    useState<DetailPageState | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchImageData() {
      try {
        setLoading(true);
        const imageData = await imagesAPI.getImageDetail(imageId);

        // API 응답을 DetailPageState 형식으로 변환
        setDetailPageState({
          img: {
            title: imageData.title,
            description: imageData.description,
            imageUrl: imageData.imageUrl,
            updateAt: new Date(),
            hyped: 0,
          },
          itemList: imageData.items.map(
            (item): HoverItem => ({
              pos: item.position,
              info: {
                identity: item.identity,
                category: `${item.category.itemClass}/${
                  item.category.itemSubClass
                }/${item.category.category || ''}/${
                  item.category.subCategory || ''
                }/${item.category.productType}`,
              },
            })
          ),
          brandUrlList: new Map(),
          brandImgList: new Map(),
          artistImgList: [],
          artistList: [],
          artistArticleList: [],
        });
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error('Failed to fetch image data')
        );
      } finally {
        setLoading(false);
      }
    }

    if (imageId) {
      fetchImageData();
    }
  }, [imageId, isFeatured]);

  return { detailPageState, loading, error };
}
