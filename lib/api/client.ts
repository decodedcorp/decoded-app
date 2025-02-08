import { OpenAPI } from './types/core/OpenAPI';
import { request } from './types/core/request';
import type { ApiRequestOptions } from './types/core/ApiRequestOptions';
import { API_CONFIG } from './config';
import { handleApiError, withRetry, axiosInstance } from './core';

// OpenAPI 설정
OpenAPI.BASE = API_CONFIG.BASE_URL;
OpenAPI.WITH_CREDENTIALS = false;
OpenAPI.CREDENTIALS = 'same-origin';

// 환경 설정 검증
if (!process.env.NEXT_PUBLIC_SERVICE_ENDPOINT) {
  throw new Error('Missing `SERVICE_ENDPOINT` configuration');
}

const corsHeaders = {
  'Accept': 'application/json',
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// API 클라이언트
export const apiClient = {
  get: <T>(path: string, options: Partial<ApiRequestOptions> = {}) =>
    withRetry(() =>
      request<T>(
        OpenAPI,
        { 
          method: 'GET', 
          url: path.startsWith('/') ? path : `/${path}`,
          headers: { ...corsHeaders, ...options.headers },
          ...options 
        },
        axiosInstance
      ).catch(handleApiError)
    ),

  post: <T>(path: string, data?: any, options: Partial<ApiRequestOptions> = {}) =>
    withRetry(() =>
      request<T>(
        OpenAPI,
        { 
          method: 'POST', 
          url: path, 
          body: data, 
          headers: { ...corsHeaders, ...options.headers },
          ...options 
        },
        axiosInstance
      ).catch(handleApiError)
    ),

  put: <T>(path: string, data?: any, options: Partial<ApiRequestOptions> = {}) =>
    withRetry(() =>
      request<T>(
        OpenAPI,
        { 
          method: 'PUT', 
          url: path, 
          body: data, 
          headers: { ...corsHeaders, ...options.headers },
          ...options 
        },
        axiosInstance
      ).catch(handleApiError)
    ),

  delete: <T>(path: string, options: Partial<ApiRequestOptions> = {}) =>
    withRetry(() =>
      request<T>(
        OpenAPI,
        { 
          method: 'DELETE', 
          url: path, 
          headers: { ...corsHeaders, ...options.headers },
          ...options 
        },
        axiosInstance
      ).catch(handleApiError)
    ),

  patch: <T>(path: string, data?: any, options: Partial<ApiRequestOptions> = {}) =>
    withRetry(() =>
      request<T>(
        OpenAPI,
        { 
          method: 'PATCH', 
          url: path, 
          body: data, 
          headers: { ...corsHeaders, ...options.headers },
          ...options 
        },
        axiosInstance
      ).catch(handleApiError)
    ),
};
