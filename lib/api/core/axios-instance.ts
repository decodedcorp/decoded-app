import axios from 'axios';
import { API_CONFIG } from '../config';
import { convertKeysToSnakeCase } from '@/lib/utils/object/object';

// OpenAPI 설정과 일치하는 axios 인스턴스 생성
export const axiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.RETRY.MAX_DELAY,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: API_CONFIG.WITH_CREDENTIALS,
  validateStatus: (status) => status >= 200 && status < 300,
});

// 요청 인터셉터
axiosInstance.interceptors.request.use((config) => {
  // 토큰 처리
  const token = window.sessionStorage.getItem('ACCESS_TOKEN');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // snake_case 변환 처리
  if (
    config.data && 
    !(config.data instanceof FormData) && 
    config.headers['Content-Type'] === 'application/json'
  ) {
    config.data = convertKeysToSnakeCase(config.data);
  }

  return config;
});

// 응답 인터셉터 (에러 변환)
axiosInstance.interceptors.response.use(
  response => response,
  error => {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status || 500;
      const message = error.response?.data?.message || error.message;
      
      throw {
        status,
        message,
        url: error.config?.url,
      };
    }
    throw error;
  }
);
