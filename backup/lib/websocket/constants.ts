export const WS_MESSAGE_TYPES = {
  // 인증 관련
  AUTH: {
    REQUEST: 'auth_request',
    SUCCESS: 'auth_success',
    FAILURE: 'auth_failure',
  },
  // 이미지 요청 관련
  REQUEST: {
    NEW: 'request',
    SUCCESS: 'request_success',
    FAILURE: 'request_failure',
  },
  // 이미지 확인 관련
  CONFIRM: {
    IMAGE: 'confirm_request_image',
    SUCCESS: 'confirm_success',
    FAILURE: 'confirm_failure',
  },
  // 시스템 메시지
  SYSTEM: {
    ERROR: 'error',
    PING: 'ping',
    PONG: 'pong',
  },
} as const;

export const WS_ERROR_CODES = {
  AUTH_REQUIRED: 4001,
  AUTH_FAILED: 4002,
  AUTH_TIMEOUT: 4003,
  INVALID_MESSAGE: 4004,
  SERVER_ERROR: 1011,
} as const;
