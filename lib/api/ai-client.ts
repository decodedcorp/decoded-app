import { OpenAPI } from './types/core/OpenAPI';
import type { OpenAPIConfig } from './types/core/OpenAPI';
import { request } from './types/core/request';
import type { ApiRequestOptions } from './types/core/ApiRequestOptions';
import { handleApiError, withRetry, axiosInstance } from './core';

// AI API 기본 URL 설정
const AI_BASE_URL =
  process.env.NEXT_PUBLIC_AI_ENDPOINT || 'https://ai.decoded.style';

// AI OpenAPI 구성
const aiOpenAPI: OpenAPIConfig = {
  ...OpenAPI,
  BASE: AI_BASE_URL,
  WITH_CREDENTIALS: false,
  CREDENTIALS: 'same-origin' as 'same-origin' | 'include' | 'omit',
};

export const aiApiClient = {
  get: <T>(path: string, options: Partial<ApiRequestOptions> = {}) => {
    console.log('path:', path);
    console.log('API base URL:', aiOpenAPI.BASE);

    return withRetry(() => {
      console.log('Executing request for:', path);
      return request<T>(aiOpenAPI, {
        method: 'GET',
        url: path.startsWith('/') ? path : `/${path}`,
        ...options,
      }).catch((error) => {
        console.error('Request error caught in aiApiClient.get:', error);
        throw error;
      });
    });
  },

  post: <T>(
    path: string,
    body?: any,
    options: Partial<ApiRequestOptions> = {}
  ) =>
    withRetry(() =>
      request<T>(aiOpenAPI, {
        method: 'POST',
        url: path.startsWith('/') ? path : `/${path}`,
        body,
        ...options,
      })
    ),

  // 간단한 원시 요청 메서드
  rawRequest: async <T>(config: {
    method: string;
    url: string;
    data?: any;
    headers?: Record<string, string>;
  }): Promise<T> => {
    try {
      const fullUrl = `${AI_BASE_URL}${
        config.url.startsWith('/') ? config.url : `/${config.url}`
      }`;
      const response = await axiosInstance({
        ...config,
        url: fullUrl,
        headers: {
          'Content-Type': 'application/json',
          ...config.headers,
        },
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};
