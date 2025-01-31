import type { RandomImageResource, RandomItemResource } from '../client/images';
import type { APIResponse } from '../types/request';
import { cookies } from 'next/headers';

const SERVICE_ENDPOINT = process.env.NEXT_PUBLIC_SERVICE_ENDPOINT;

export async function getRandomResources(): Promise<{
  status_code: number;
  description: string;
  data: {
    label: 'image' | 'item';
    resources: (RandomImageResource | RandomItemResource)[];
  };
}> {
  if (!SERVICE_ENDPOINT) {
    throw new Error('SERVICE_ENDPOINT is not defined');
  }

  try {
    // 쿠키에서 액세스 토큰 가져오기
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('access_token')?.value;

    const requestUrl = `${SERVICE_ENDPOINT}/random?limit=10`;

    const response = await fetch(requestUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
      },
      next: {
        revalidate: 60, // 1분마다 재검증
      },
    });

    if (!response.ok) {
      const responseText = await response.text();
      console.error('Failed to fetch random resources:', {
        status: response.status,
        statusText: response.statusText,
        url: response.url,
        responseBody: responseText,
      });
      throw new Error(
        `Failed to fetch random resources: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();

    if (!data.data?.resources) {
      console.error('Invalid API response structure:', data);
      throw new Error('Invalid API response structure');
    }

    return data;
  } catch (error) {
    console.error('Error in getRandomResources:', error);
    // 에러가 발생하면 빈 리소스 배열 반환
    return {
      status_code: 500,
      description: error instanceof Error ? error.message : 'Unknown error',
      data: {
        label: 'image',
        resources: [],
      },
    };
  }
}
