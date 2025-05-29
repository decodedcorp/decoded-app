import { aiApiClient } from '../ai-client';

export interface OGTags {
  title: string | null;
  description: string | null;
  image: string | null;
  url: string | null;
  siteName: string | null;
  type: string | null;
}

export interface Response_OGTags {
  status_code: number;
  description: string;
  data: OGTags;
}

export const metadataService = {
    // 기존 메소드 유지
    getOGTags: (url: string) =>
      aiApiClient.get<Response_OGTags>(`metadata/og-tags?url=${url}`),
      
    // 직접 호출하는 메소드 추가
    getOGTagsDirect: async (url: string) => {
      console.log('Direct fetch attempt for URL:', url);
      const apiUrl = `${process.env.NEXT_PUBLIC_AI_ENDPOINT}/metadata/og-tags?url=${encodeURIComponent(url)}`;
      console.log('Full API URL:', apiUrl);
      
      try {
        const response = await fetch(apiUrl);
        console.log('Direct fetch response status:', response.status);
        const data = await response.json();
        console.log('Direct fetch data:', data);
        return data;
      } catch (error) {
        console.error('Direct fetch error:', error);
        throw error;
      }
    }
  };
