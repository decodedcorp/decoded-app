import React from 'react';
import { useDescriptionJSX, usePlainTextDescription } from '@/hooks/useFormattedDescription';

interface FormattedDescriptionProps {
  description: string | undefined | null;
  variant?: 'html' | 'text';
  className?: string;
  maxLines?: number;
}

/**
 * Description을 포맷팅하여 표시하는 컴포넌트
 *
 * @param description - 백엔드에서 받아온 description 텍스트
 * @param variant - 'html': HTML 태그로 렌더링, 'text': 순수 텍스트로 렌더링
 * @param className - 추가 CSS 클래스
 * @param maxLines - 최대 표시 줄 수 (text variant에서만 적용)
 */
export function FormattedDescription({
  description,
  variant = 'html',
  className = '',
  maxLines,
}: FormattedDescriptionProps) {
  const htmlDescription = useDescriptionJSX(description);
  const textDescription = usePlainTextDescription(description);

  if (variant === 'html' && htmlDescription) {
    return <div className={className} dangerouslySetInnerHTML={htmlDescription} />;
  }

  if (variant === 'text') {
    const style = maxLines
      ? {
          display: '-webkit-box',
          WebkitLineClamp: maxLines,
          WebkitBoxOrient: 'vertical' as const,
          overflow: 'hidden',
        }
      : undefined;

    return (
      <div className={className} style={style}>
        {textDescription}
      </div>
    );
  }

  return null;
}

/**
 * Description을 HTML로 렌더링하는 간단한 컴포넌트
 */
export function HTMLDescription({
  description,
  className = '',
}: {
  description: string | undefined | null;
  className?: string;
}) {
  return <FormattedDescription description={description} variant="html" className={className} />;
}

/**
 * Description을 텍스트로 렌더링하는 간단한 컴포넌트
 */
export function TextDescription({
  description,
  className = '',
  maxLines,
}: {
  description: string | undefined | null;
  className?: string;
  maxLines?: number;
}) {
  return (
    <FormattedDescription
      description={description}
      variant="text"
      className={className}
      maxLines={maxLines}
    />
  );
}
