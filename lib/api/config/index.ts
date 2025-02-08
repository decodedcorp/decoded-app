import { API_CONSTANTS } from './constants';

export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_SERVICE_ENDPOINT || '',
  WITH_CREDENTIALS: true,
  CREDENTIALS: 'include' as const,
  ...API_CONSTANTS,
} as const;

if (!process.env.NEXT_PUBLIC_SERVICE_ENDPOINT) {
  throw new Error('Missing `SERVICE_ENDPOINT` configuration');
}

export * from './constants';
