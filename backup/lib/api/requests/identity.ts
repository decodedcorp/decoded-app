import { apiClient } from '../client';
import type { Response_GetDocumentResponse_ } from '../types/models/Response_GetDocumentResponse_';

// 아티스트/아이덴티티 문서 타입 정의
export interface IdentityDoc {
  _id: string;
  name: {
    en: string;
    ko: string;
  };
  category: string;
  profile_image_url: string | null;
  links: any | null;
  created_at: string;
}

// 제네릭 응답 타입
export interface DocumentResponse<T> {
  status_code: number;
  description: string;
  data: {
    docs: T;
    next_id: string | null;
    metadata: any | null;
  };
}

export const identityService = {
  // 아이덴티티(아티스트) 정보 조회 시 구체적인 타입 지정
  getIdentityInfo: (identityId: string) =>
    apiClient.get<DocumentResponse<IdentityDoc>>(`identity/${identityId}`),
}; 