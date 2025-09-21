import { useMemo } from 'react';

/**
 * Description 텍스트를 포맷팅하는 훅
 * 백엔드에서 받아온 description의 줄바꿈(\n)을 HTML로 변환하여 렌더링할 수 있도록 처리
 */
export function useFormattedDescription(description: string | undefined | null) {
  return useMemo(() => {
    if (!description) return '';

    // \n을 <br>로 변환하고, 연속된 공백을 정리
    return description
      .replace(/\\n/g, '\n') // 이스케이프된 \n을 실제 줄바꿈으로 변환
      .replace(/\n/g, '<br>') // 줄바꿈을 <br> 태그로 변환
      .replace(/\s+/g, ' ') // 연속된 공백을 하나로 정리
      .trim();
  }, [description]);
}

/**
 * Description을 JSX로 렌더링할 수 있는 컴포넌트용 훅
 * dangerouslySetInnerHTML을 사용하여 HTML 태그를 렌더링
 */
export function useDescriptionJSX(description: string | undefined | null) {
  const formattedDescription = useFormattedDescription(description);

  return useMemo(() => {
    if (!formattedDescription) return null;

    return {
      __html: formattedDescription,
    };
  }, [formattedDescription]);
}

/**
 * Description을 텍스트로만 표시하고 싶을 때 사용하는 훅
 * HTML 태그 없이 순수 텍스트로 변환
 */
export function usePlainTextDescription(description: string | undefined | null) {
  return useMemo(() => {
    if (!description) return '';

    // \n을 공백으로 변환하고, 연속된 공백을 정리
    return description
      .replace(/\\n/g, '\n') // 이스케이프된 \n을 실제 줄바꿈으로 변환
      .replace(/\n/g, ' ') // 줄바꿈을 공백으로 변환
      .replace(/\s+/g, ' ') // 연속된 공백을 하나로 정리
      .trim();
  }, [description]);
}
