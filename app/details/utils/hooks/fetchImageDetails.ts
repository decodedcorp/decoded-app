import { transformToDetailPageState } from '@/lib/utils/object/transform';
import type { DetailPageState } from '@/types/model.d';

interface ImageResponse {
  data: {
    image: {
      title: string | null;
      description: string;
      like: number;
      style: string | null;
      img_url: string;
      source: string | null;
      upload_by: string;
      doc_id: string;
      decoded_percent: number;
      items: Record<string, any>;
    };
  };
}

export async function getImageDetails(imageId: string): Promise<DetailPageState> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_SERVICE_ENDPOINT}/image/${imageId}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch image details');
  }

  const data = (await response.json()) as ImageResponse;

  if (!data?.data?.image) {
    throw new Error('Invalid API response structure');
  }

  const imageData = data.data.image;
  const apiData = {
    title: imageData.title || null,
    description: imageData.description || '',
    like: imageData.like || 0,
    style: imageData.style || null,
    img_url: imageData.img_url,
    source: imageData.source || null,
    upload_by: imageData.upload_by || '',
    doc_id: imageData.doc_id || '',
    decoded_percent: imageData.decoded_percent || 0,
    items: imageData.items || {},
  };

  return transformToDetailPageState(apiData);
} 