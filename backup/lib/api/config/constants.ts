export const API_CONSTANTS = {
  RETRY: {
    MAX_ATTEMPTS: 3,
    BASE_DELAY: 1000,
    MAX_DELAY: 10000,
  },
  
  HTTP_STATUS: {
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
  },
  
  ERROR_MESSAGES: {
    401: '인증이 필요합니다',
    403: '접근 권한이 없습니다',
    404: '요청하신 리소스를 찾을 수 없습니다',
    DEFAULT: '오류가 발생했습니다',
    RETRY_FAILED: 'All retry attempts failed',
  },
} as const;
