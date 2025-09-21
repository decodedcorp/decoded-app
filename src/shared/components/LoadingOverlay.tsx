'use client';

import React from 'react';

interface LoadingOverlayProps {
  /** 로딩 상태 */
  isLoading: boolean;
  /** 표시할 메시지 */
  message?: string;
  /** 오버레이 배경 투명도 (0-1) */
  opacity?: number;
  /** z-index 값 */
  zIndex?: number;
  /** 커스텀 클래스명 */
  className?: string;
  /** 스피너 크기 */
  spinnerSize?: 'sm' | 'md' | 'lg';
  /** 브랜드 컬러 사용 여부 */
  useBrandColor?: boolean;
}

export function LoadingOverlay({
  isLoading,
  message = 'Loading...',
  opacity = 0.5,
  zIndex = 50,
  className = '',
  spinnerSize = 'md',
  useBrandColor = true,
}: LoadingOverlayProps) {
  if (!isLoading) return null;

  const spinnerSizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  const spinnerColor = useBrandColor ? 'border-[#eafd66]' : 'border-white';
  const textColor = useBrandColor ? 'text-white' : 'text-white';

  return (
    <div
      className={`fixed inset-0 bg-black/${opacity} flex items-center justify-center ${className}`}
      style={{ zIndex }}
    >
      <div className="bg-zinc-900 rounded-lg p-6 flex items-center gap-3">
        <div
          className={`${spinnerSizes[spinnerSize]} border-2 ${spinnerColor} border-t-transparent rounded-full animate-spin`}
        />
        <span className={textColor}>{message}</span>
      </div>
    </div>
  );
}

export default LoadingOverlay;
