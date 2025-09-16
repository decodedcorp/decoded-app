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
   * 백엔드 로그인 응답을 LoginResponse로 변환 (타입 안전성 강화)
   */
  static mapLoginResponse(data: BackendLoginResponse): LoginResponse {
    if (process.env.NODE_ENV === 'development') {
      console.log('[ResponseMapper] Raw backend response:', JSON.stringify(data, null, 2));
      console.log('[ResponseMapper] Response type:', typeof data);
      console.log('[ResponseMapper] Response keys:', Object.keys(data));
    }

    // 새로운 백엔드 응답 구조 처리
    let accessTokenData: any;
    let userData = data.user;
    let refreshToken = data.refresh_token || '';

    // refresh_token이 유효한지 확인
    if (refreshToken && typeof refreshToken === 'string' && refreshToken.trim() === '') {
      refreshToken = '';
    }

    // 새로운 구조: 최상위 레벨에 access_token 관련 필드들이 있음
    accessTokenData = {
      salt: data.salt || '',
      user_doc_id: data.user_doc_id || '',
      access_token: data.access_token || '',
      has_sui_address: data.has_sui_address || false,
    };

    // user 데이터가 없는 경우 기본값 설정
    if (!userData) {
      userData = {
        doc_id: '',
        email: '',
        nickname: '',
        role: 'user',
        status: 'active',
      };
    }

    // user.doc_id가 없는 경우 다른 필드에서 찾기
    if (!userData.doc_id) {
      if (userData.id) {
        userData.doc_id = userData.id;
      } else if (userData.user_id) {
        userData.doc_id = userData.user_id;
      } else if (userData._id) {
        userData.doc_id = userData._id;
      } else if (accessTokenData.user_doc_id) {
        userData.doc_id = accessTokenData.user_doc_id;
      }
    }

    // 여전히 doc_id가 없는 경우 access_token에서 가져오기
    if (!userData.doc_id && accessTokenData.user_doc_id) {
      userData.doc_id = accessTokenData.user_doc_id;
    }

    // nickname이 없는 경우 다른 필드에서 찾기
    if (!userData.nickname) {
      if (userData.name) {
        userData.nickname = userData.name;
      } else if (userData.username) {
        userData.nickname = userData.username;
      } else {
        userData.nickname = userData.email || 'Unknown User';
      }
    }

    if (process.env.NODE_ENV === 'development') {
      console.log('[ResponseMapper] Processed data:', {
        hasAccessToken: !!accessTokenData,
        hasRefreshToken: !!refreshToken,
        hasUser: !!userData,
        accessTokenType: typeof accessTokenData,
        userType: typeof userData,
        userDocId: userData.doc_id,
      });
    }

    if (!accessTokenData?.access_token) {
      if (process.env.NODE_ENV === 'development') {
        console.error('[ResponseMapper] Missing access_token.access_token:', {
          hasAccessToken: !!accessTokenData,
          accessTokenKeys: accessTokenData ? Object.keys(accessTokenData) : null,
          accessTokenType: typeof accessTokenData,
          accessTokenData: accessTokenData,
        });
      }
      throw new AuthError('Invalid access token in response', 400, 'INVALID_ACCESS_TOKEN');
    }

    if (!userData.doc_id) {
      if (process.env.NODE_ENV === 'development') {
        console.error('[ResponseMapper] Missing user.doc_id after processing:', {
          hasUser: !!userData,
          userKeys: userData ? Object.keys(userData) : null,
          userData: userData,
        });
      }
      throw new AuthError('Invalid user data in response', 400, 'INVALID_USER_DATA');
    }

    const loginResponse: LoginResponse = {
      access_token: {
        access_token: accessTokenData.access_token,
        salt: accessTokenData.salt || '',
        user_doc_id: accessTokenData.user_doc_id || userData.doc_id,
        has_sui_address: accessTokenData.has_sui_address || false,
      },
      refresh_token: refreshToken,
      user: {
        doc_id: userData.doc_id,
        email: userData.email || '',
        nickname: userData.nickname || '',
        role: this.mapUserRole(userData.role),
        status: this.mapUserStatus(userData.status),
      },
    };

    if (process.env.NODE_ENV === 'development') {
      console.log('[ResponseMapper] Successfully mapped response:', {
        hasAccessToken: !!loginResponse.access_token,
        hasRefreshToken: !!loginResponse.refresh_token,
        hasUser: !!loginResponse.user,
        userDocId: loginResponse.user.doc_id,
        userEmail: loginResponse.user.email,
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
