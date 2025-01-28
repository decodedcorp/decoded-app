// Google OAuth 관련 타입
export interface GoogleJWT {
  iss: string;          // Token issuer (항상 'https://accounts.google.com')
  sub: string;          // Google User ID
  email?: string;       // User email
  name?: string;        // User name
  picture?: string;     // Profile picture URL
  exp: number;          // Token expiration time
  iat: number;          // Token issued at time
  aud: string;          // Audience (your client ID)
}

// 서버 응답 타입
export interface LoginResponse {
  success: boolean;
  user: User;
  error?: string;
  accessToken?: string;
}

// 사용자 정보 타입
export interface User {
  id: string;
  email: string;
  name: string;
  profileImage?: string;
}

// 인증 상태 타입
export interface AuthState {
  isLogin: boolean;
  isInitialized: boolean;
  isLoading: boolean;
  user: User | null;
  error?: string;
}

// ZK Login 파라미터 타입
export interface ZKLoginParams {
  sk: string;           // Secret Key (Base64)
  randomness: string;   // ZK Login randomness
  exp: number;          // Expiration epoch
  publicKey: Uint8Array;// Public Key bytes
}

// OpenID Connect URL 응답 타입
export interface OpenIdConnectUrlResponse {
  sk: string;
  randomness: string;
  exp: number;
  url: string;
}

// 네트워크 설정 타입
export interface NetworkConfig {
  service: string;
  auth_client_id: string;
  redirect_uri: string;
} 