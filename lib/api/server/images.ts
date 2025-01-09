import { headers } from 'next/headers';
import type { DetailPageState, ImageData, DecodedItem } from '../types/image';
import type { APIResponse } from '../types/request';

const API_ENDPOINT = process.env.NEXT_PUBLIC_SERVICE_ENDPOINT;

if (!API_ENDPOINT) {
  throw new Error('NEXT_PUBLIC_SERVICE_ENDPOINT is not defined');
}

function transformImageData(rawImage: any): DetailPageState {
  // API 응답을 DetailPageState 형식으로 변환
  const itemList = Object.entries(rawImage.img?.items || {}).flatMap(([key, items]: [string, any]) => {
    if (!Array.isArray(items)) return [];
    
    return items.map((item: any) => ({
      imageDocId: rawImage.doc_id,
      info: {
        item: {
          item: {
            _id: item.item.item._id,
            name: item.item.item.metadata?.name || '',
            description: item.item.item.metadata?.description,
            img_url: item.item.item.img_url,
            price: item.item.item.price,
            metadata: item.item.item.metadata,
          },
          brand_name: item.item.brand_name,
          brand_logo_image_url: item.item.brand_logo_image_url,
        },
      },
      pos: {
        top: parseFloat(item.position?.top || '0'),
        left: parseFloat(item.position?.left || '0'),
      },
    }));
  });

  return {
    title: rawImage.title || null,
    description: rawImage.description || null,
    like: rawImage.like || 0,
    style: rawImage.style || null,
    img_url: rawImage.img_url,
    source: rawImage.source || null,
    upload_by: rawImage.upload_by || '',
    doc_id: rawImage.doc_id,
    decoded_percent: rawImage.decoded_percent || 0,
    img: {
      title: rawImage.img?.title,
      description: rawImage.img?.description,
      items: rawImage.img?.items || {},
    },
    itemList,
  };
}

export async function getImageDetail(imageId: string): Promise<APIResponse<DetailPageState>> {
  try {
    console.log('Fetching images list for:', { imageId });

    // 1. 먼저 이미지 목록을 가져옵니다
    const response = await fetch(`${API_ENDPOINT}/images`, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      cache: 'no-store'
    });

    if (!response.ok) {
      const errorDetails = {
        status: response.status,
        statusText: response.statusText,
        url: response.url,
      };
      console.error('API Error (images list):', JSON.stringify(errorDetails, null, 2));
      throw new Error(`Failed to fetch images list: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    // 2. 응답에서 해당 이미지를 찾습니다
    const rawImage = data.data?.images?.find((img: any) => img.doc_id === imageId);

    if (!rawImage) {
      console.error('Image not found in response:', {
        imageId,
        totalImages: data.data?.images?.length || 0
      });
      return {
        status_code: 404,
        description: 'Image not found',
        data: null as unknown as DetailPageState
      };
    }

    // 3. 이미지 데이터를 DetailPageState 형식으로 변환
    const transformedImage = transformImageData(rawImage);

    return {
      status_code: 200,
      description: 'Success',
      data: transformedImage
    };

  } catch (error) {
    console.error('Error fetching image detail:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      imageId,
      stack: error instanceof Error ? error.stack : undefined
    });
    
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'An unexpected error occurred while fetching image details';
    
    return {
      status_code: 500,
      description: errorMessage,
      data: null as unknown as DetailPageState
    };
  }
} 