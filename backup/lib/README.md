# 📂 Decoded App API & Network Structure

## 📌 프로젝트 디렉토리 구조

lib/
 ┣ api/
 ┃ ┣ client.ts        👈 Axios 인스턴스 (공통 API 설정)
 ┃ ┣ requests/        👈 API 요청 함수 모음
 ┃ ┃ ┣ auth.ts       👈 인증 관련 API 요청 (로그인, OpenID Connect 등)
 ┃ ┃ ┣ images.ts     👈 이미지 관련 API 요청
 ┃ ┃ ┣ items.ts      👈 아이템 관련 API 요청
 ┃ ┃ ┣ trending.ts   👈 트렌드 데이터 요청
 ┃ ┗ types/          👈 OpenAPI 기반 자동 생성 타입
 ┃   ┣ core/        👈 API 공통 설정 (OpenAPI, 에러 핸들링 등)
 ┃   ┣ models/      👈 OpenAPI 데이터 모델
 ┃   ┗ services/    👈 OpenAPI 서비스 API
 ┣ hooks/            👈 React Query 기반 API 관리
 ┃ ┣ useAuth.ts     👈 로그인 및 인증 관련 React Query 훅
 ┃ ┣ useImages.ts   👈 이미지 관련 API 요청 훅
 ┃ ┣ useItems.ts    👈 아이템 데이터 관리 훅
 ┃ ┣ useTrending.ts 👈 트렌딩 데이터 캐싱 훅
 ┗ utils/            👈 유틸리티 함수 모음
    ┣ object.ts     👈 객체 변환 유틸
    ┣ string.ts     👈 문자열 변환 유틸
    ┗ format.ts     👈 날짜 및 데이터 포맷 유틸