import React from 'react';

import { useTokenMonitor } from '../hooks/useTokenMonitor';

/**
 * 토큰 만료 모니터링 컴포넌트
 * 앱의 최상위 레벨에서 사용하여 토큰 만료 시 자동 로그아웃 처리
 */
export const TokenMonitor: React.FC = () => {
  useTokenMonitor();
  return null; // 이 컴포넌트는 UI를 렌더링하지 않음
}; 