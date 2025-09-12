import {
  LoginResponse,
  User,
  BackendLoginResponse,
  AuthError,
  NetworkError,
  UserRole,
  UserStatus,
} from '../types/auth';
import { GetUserProfile } from '../../../api/generated';

/**
 * API 응답을 도메인 타입으로 변환하는 매퍼
 */
export class ResponseMapper {
  /**
   * 백엔드 로그인 응답을 LoginResponse로 변환 (새로운 단순한 구조)
   */
  static mapLoginResponse(data: any): LoginResponse {
    if (process.env.NODE_ENV === 'development') {
      console.log('[ResponseMapper] Raw backend response:', JSON.stringify(data, null, 2));
      console.log('[ResponseMapper] Response type:', typeof data);
      console.log('[ResponseMapper] Response keys:', Object.keys(data));
    }

    if (!data.access_token) {
      throw new AuthError('Invalid access token in response', 400, 'INVALID_ACCESS_TOKEN');
    }

    // 새로운 백엔드 응답 구조 사용
    const userDocId = data.user_doc_id;
    if (!userDocId) {
      console.error('[ResponseMapper] Missing user_doc_id. Available data:', {
        hasUserDocId: !!data.user_doc_id,
        dataKeys: Object.keys(data)
      });
      throw new AuthError('Invalid user data in response', 400, 'INVALID_USER_DATA');
    }

    const loginResponse: LoginResponse = {
      access_token: {
        access_token: data.access_token,
        salt: data.salt,
        user_doc_id: userDocId,
        has_sui_address: data.has_sui_address,
      },
      refresh_token: '', // 새로운 백엔드 구조에서는 refresh_token 없음
      user: data.user || {
        // /api/auth/google에서 이미 user 객체를 만들어서 보내주면 그것을 사용
        // 없으면 기본값 사용
        doc_id: userDocId,
        email: data.email || '', 
        nickname: data.aka || '', // ✨ 백엔드 aka 필드 사용
        role: 'user' as UserRole,
        status: 'active' as UserStatus,
      },
    };

    if (process.env.NODE_ENV === 'development') {
      console.log('[ResponseMapper] Successfully mapped response:', {
        hasAccessToken: !!loginResponse.access_token,
        hasRefreshToken: !!loginResponse.refresh_token,
        hasUser: !!loginResponse.user,
        userDocId: loginResponse.user.doc_id,
        salt: loginResponse.access_token.salt,
        hasSuiAddress: loginResponse.access_token.has_sui_address,
      });
    }

    return loginResponse;
  }

  /**
   * GetUserProfile을 User 타입으로 변환
   */
  static mapUserProfile(data: GetUserProfile): User {
    return {
      doc_id: '', // GetUserProfile에는 doc_id가 없으므로 빈 문자열
      email: '', // GetUserProfile에는 email이 없음
      nickname: data.aka || 'Unknown User',
      role: 'user' as UserRole, // 기본값
      status: 'active' as UserStatus, // 기본값
      sui_address: data.sui_address || undefined,
    };
  }

  /**
   * 사용자 역할을 UserRole로 변환
   */
  private static mapUserRole(role?: string): UserRole {
    if (!role) return 'user';

    const roleLower = role.toLowerCase();
    if (roleLower === 'admin' || roleLower === 'administrator') {
      return 'admin';
    }
    if (roleLower === 'moderator' || roleLower === 'mod') {
      return 'moderator';
    }
    return 'user';
  }

  /**
   * 사용자 상태를 UserStatus로 변환
   */
  private static mapUserStatus(status?: string): UserStatus {
    if (!status) return 'active';

    const statusLower = status.toLowerCase();
    if (statusLower === 'inactive' || statusLower === 'suspended') {
      return 'inactive';
    }
    return 'active';
  }

  /**
   * 에러 응답을 AuthError로 변환
   */
  static mapErrorResponse(error: any): AuthError {
    if (error instanceof AuthError) {
      return error;
    }

    if (error instanceof TypeError && error.message.includes('fetch')) {
      return new AuthError('Network connection failed', 0, 'NETWORK_ERROR');
    }

    // API 에러 응답 처리
    if (error?.response?.data) {
      const { message, detail, error_code } = error.response.data;
      return new AuthError(
        message || detail || 'API request failed',
        error.response.status,
        error_code,
      );
    }

    // 일반적인 에러 처리
    const message = error?.message || 'Unknown error occurred';
    const status = error?.status || error?.statusCode || 500;
    const code = error?.code || 'UNKNOWN_ERROR';

    return new AuthError(message, status, code);
  }
}
