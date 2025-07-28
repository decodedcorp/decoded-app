export interface LoginFormData {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  user: {
    id: string;
    email: string;
    name?: string;
    role: string;
    status: string;
  };
}

export interface GoogleOAuthResponse {
  access_token: string;
  refresh_token: string;
  user: {
    id: string;
    email: string;
    name: string;
    picture?: string;
    role: string;
    status: string;
  };
}

export interface AuthState {
  user: LoginResponse['user'] | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginFormErrors {
  email?: string;
  password?: string;
  general?: string;
}

export interface LoginFormState {
  data: LoginFormData;
  errors: LoginFormErrors;
  isSubmitting: boolean;
  isSubmitted: boolean;
}

// 토큰 관련 타입들
export interface TokenPayload {
  sub: string; // 사용자 ID
  email: string;
  role: string;
  status: string;
  exp: number; // 만료 시간
  iat: number; // 발급 시간
}

export interface RefreshTokenRequest {
  refresh_token: string;
}

export interface RefreshTokenResponse {
  access_token: string;
  refresh_token?: string; // 새로운 refresh token이 있을 수도 있음
}

// API 응답 타입들
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface LoginApiResponse extends ApiResponse<LoginResponse> {}
export interface GoogleOAuthApiResponse extends ApiResponse<GoogleOAuthResponse> {}
export interface RefreshTokenApiResponse extends ApiResponse<RefreshTokenResponse> {}

// 사용자 프로필 관련 타입들
export interface UserProfile {
  id: string;
  email: string;
  name?: string;
  picture?: string;
  role: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdateProfileRequest {
  name?: string;
  picture?: string;
}

export interface UpdateProfileResponse extends ApiResponse<UserProfile> {}
