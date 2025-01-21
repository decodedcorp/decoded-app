import type { DecodedItem } from '@/lib/api/types/image';

const API_URL = process.env.NODE_ENV === 'production'
  ? process.env.NEXT_PUBLIC_DB_ENDPOINT
  : process.env.NEXT_PUBLIC_LOCAL_DB_ENDPOINT;

interface ImageResponse {
  status_code: number;
  description: string;
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
      items: {
        [key: string]: DecodedItem[];
      };
    };
  };
}

export async function getImageDetails(imageId: string) {
  try {
    const response = await fetch(`${API_URL}/image/${imageId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 60 },
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const { data: { image } } = await response.json();
    const firstCategory = Object.keys(image.items)[0];

    return {
      items: image.items[firstCategory],
      img_url: image.img_url,
      title: image.title,
      description: image.description,
      like: image.like,
      doc_id: image.doc_id,
      style: image.style,
      decoded_percent: image.decoded_percent
    };
  } catch (error) {
    console.error('Error in getImageDetails:', error);
    throw new Error('Failed to fetch image details');
  }
}
