import { OpenAPI } from './generated/core/OpenAPI';

// API 설정 초기화
export const initializeApiConfig = () => {
  // BASE URL 설정
  OpenAPI.BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://dev.decoded.style';

  // 인증 토큰 설정 (필요시)
  // OpenAPI.TOKEN = () => getAuthToken();

  // 헤더 설정 (필요시)
  // OpenAPI.HEADERS = {
  //   'Content-Type': 'application/json',
  // };
};

// API 설정을 초기화하는 함수 export
export { OpenAPI };
