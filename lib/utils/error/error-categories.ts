// 사용자에게 보여줄 에러인지 확인
export const isUserFacingError = (status: number): boolean => {
  return [401, 409].includes(status);
};

// 에러 페이지로 보낼지 확인
export const shouldShowErrorPage = (status: number): boolean => {
  return [400, 404, 500].includes(status);
};

// 에러 상태에 따른 리다이렉트 경로 반환
export const getErrorRedirectPath = (status: number): string => {
  switch (status) {
    case 404:
      return '/404';
    case 500:
      return '/500';
    default:
      return '/error';
  }
}; 