// API response types
export interface GoogleOAuthResponse {
  access_token: string;
  refresh_token: string;
  user: User;
  token_type?: 'jwt' | 'oauth'; // 토큰 타입 정보 추가
}

export interface RefreshTokenResponse {
  access_token: string;
  refresh_token?: string; // New refresh token may or may not be provided
}

// User types - 새로운 백엔드 API 구조에 맞춤
export interface User {
  doc_id?: string; // 백엔드에서 사용하는 문서 ID
  id?: string; // 기존 ID 필드 (호환성)
  email: string;
  nickname?: string; // 사용자 닉네임
  name?: string; // 기존 name 필드 (호환성)
  sui_address?: string; // Sui 블록체인 주소
  role?: UserRole;
  status?: UserStatus;
  createdAt?: string;
  updatedAt?: string;
}

export type UserRole = 'admin' | 'user' | 'moderator';
export type UserStatus = 'active' | 'inactive' | 'suspended';

// Token-related types
export interface DecodedToken {
  sub: string; // User ID
  email: string;
  role: string;
  status: string;
  exp: number; // Expiration time
  iat: number; // Issued at time
}

// API response types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: string;
  };
}

// User profile related types
export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  status: UserStatus;
  avatar?: string;
  preferences?: UserPreferences;
}

export interface UserPreferences {
  theme?: 'light' | 'dark' | 'system';
  language?: string;
  notifications?: {
    email: boolean;
    push: boolean;
  };
}

// Authentication state
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
