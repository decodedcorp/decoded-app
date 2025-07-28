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
