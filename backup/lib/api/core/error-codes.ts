export const ERROR_CODES = {
  NETWORK_ERROR: 'NETWORK_ERROR',
  UNAUTHORIZED: 'UNAUTHORIZED',
  NOT_FOUND: 'NOT_FOUND',
  SERVER_ERROR: 'SERVER_ERROR',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
  DUPLICATE_REQUEST: 'DUPLICATE_REQUEST',
} as const;

export type ErrorCode = 
  | 'NETWORK_ERROR'
  | 'UNAUTHORIZED'
  | 'NOT_FOUND'
  | 'SERVER_ERROR'
  | 'UNKNOWN_ERROR'
  | 'DUPLICATE_REQUEST';

export interface ErrorResponse {
  code: ErrorCode;
  status: number;
  message: string;
  url?: string;
}

export const ERROR_MESSAGES: Record<ErrorCode, string> = {
  NETWORK_ERROR: '네트워크 연결에 실패했습니다. 인터넷 연결을 확인해주세요.',
  UNAUTHORIZED: '로그인이 필요한 서비스입니다.',
  NOT_FOUND: '요청하신 리소스를 찾을 수 없습니다.',
  SERVER_ERROR: '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
  UNKNOWN_ERROR: '알 수 없는 오류가 발생했습니다.',
  DUPLICATE_REQUEST: '이미 요청한 아이템입니다.',
}; 