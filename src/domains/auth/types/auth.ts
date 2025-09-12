// API response types
export interface LoginResponse {
  access_token: {
    salt: string;
    user_doc_id: string;
    access_token: string;
    has_sui_address: boolean;
  };
  refresh_token: string;
  user: {
    doc_id: string;
    email: string;
    nickname: string;
    role: UserRole;
    status: UserStatus;
  };
}

// 백엔드 응답 타입 (실제 API 응답 구조)
export interface BackendLoginResponse {
  salt: string;
  user_doc_id: string;
  access_token: string;
  has_sui_address: boolean;
}

export interface RefreshTokenResponse {
  access_token: string;
  refresh_token?: string;
}

// User types - 실제 백엔드 API 구조에 맞춤
export interface User {
  doc_id: string;
  email: string;
  nickname: string;
  role: UserRole;
  status: UserStatus;
  sui_address?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type UserRole = 'admin' | 'user' | 'moderator';
export type UserStatus = 'active' | 'inactive' | 'suspended';

// Token-related types
export interface DecodedToken {
  sub: string;
  email: string;
  role: string;
  status: string;
  exp: number;
  iat: number;
}

// API request types
export interface LoginRequest {
  jwt_token: string;
  sui_address: string;
  email?: string;
  marketing?: boolean;
}

// API response wrapper
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

// Authentication state
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Session storage types
export interface SessionData {
  access_token: string;
  refresh_token: string;
  doc_id: string;
  email: string;
  nickname: string;
}

// 에러 타입 정의
export class AuthError extends Error {
  constructor(message: string, public status: number, public code?: string) {
    super(message);
    this.name = 'AuthError';
  }
}

export class NetworkError extends Error {
  constructor(message: string = 'Network error occurred') {
    super(message);
    this.name = 'NetworkError';
  }
}

export class TokenError extends Error {
  constructor(message: string = 'Token error occurred') {
    super(message);
    this.name = 'TokenError';
  }
}
