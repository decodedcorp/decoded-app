import { API_CONSTANTS } from './constants';

// 환경에 따라 서비스 엔드포인트 결정
const SERVICE_ENDPOINT = process.env.NODE_ENV === "development"
  ? process.env.NEXT_PUBLIC_LOCAL_SERVICE_ENDPOINT
  : process.env.NEXT_PUBLIC_SERVICE_ENDPOINT;

export const API_CONFIG = {
  BASE_URL: SERVICE_ENDPOINT || '',
  WITH_CREDENTIALS: true,
  CREDENTIALS: 'include' as const,
  ...API_CONSTANTS,
} as const;

if (!SERVICE_ENDPOINT) {
  throw new Error('Missing `SERVICE_ENDPOINT` configuration');
}

export * from './constants';
