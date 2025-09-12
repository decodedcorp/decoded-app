/**
 * 로그인 응답 타입 (백엔드 스펙 기준)
 * TODO: 백엔드에서 OpenAPI 스펙 업데이트 후 generated 타입으로 교체
 */
export interface LoginResponse {
  salt: string;
  user_doc_id: string;
  access_token: string;
  has_sui_address: boolean;
}