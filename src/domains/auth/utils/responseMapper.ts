import { LoginResponse, User } from '../types/auth';
import { GetUserProfile } from '../../../api/generated';

/**
 * API 응답을 도메인 타입으로 변환하는 매퍼
 */
export class ResponseMapper {
  /**
   * 백엔드 로그인 응답을 LoginResponse로 변환
   */
  static mapLoginResponse(data: any): LoginResponse {
    return {
      access_token: {
        salt: data.access_token?.salt || '',
        user_doc_id: data.access_token?.user_doc_id || '',
        access_token: data.access_token?.access_token || data.access_token || '',
        has_sui_address: data.access_token?.has_sui_address || false,
      },
      refresh_token: data.refresh_token || '',
      user: {
        doc_id: data.user?.doc_id || data.access_token?.user_doc_id || '',
        email: data.user?.email || '',
        nickname: data.user?.nickname || '',
        role: data.user?.role || 'user',
        status: data.user?.status || 'active',
      },
    };
  }

  /**
   * GetUserProfile을 User 타입으로 변환
   */
  static mapUserProfile(profile: GetUserProfile, docId: string): User {
    return {
      doc_id: docId,
      email: '', // GetUserProfile에는 email이 없음
      nickname: profile.aka || '',
      role: 'user' as const, // 기본값
      status: 'active' as const, // 기본값
      sui_address: profile.sui_address || undefined,
      createdAt: undefined,
      updatedAt: undefined,
    };
  }

  /**
   * 백엔드 에러 응답을 표준 에러로 변환
   */
  static mapErrorResponse(error: any): Error {
    if (error?.response?.data?.message) {
      return new Error(error.response.data.message);
    }
    if (error?.message) {
      return new Error(error.message);
    }
    return new Error('An unexpected error occurred');
  }

  /**
   * API 응답이 성공인지 확인
   */
  static isSuccessResponse(response: any): boolean {
    return response && response.status >= 200 && response.status < 300;
  }

  /**
   * API 응답에서 데이터 추출
   */
  static extractData<T>(response: any): T {
    if (this.isSuccessResponse(response)) {
      return response.data || response;
    }
    throw this.mapErrorResponse(response);
  }
}
