import { useState, useEffect, useRef } from 'react';

interface UseLoadingDelayOptions {
  delay?: number; // 지연 노출 시간 (ms)
  minVisible?: number; // 최소 노출 시간 (ms)
}

/**
 * 로딩 UI의 깜빡임을 방지하는 훅
 * - 120ms 이내 응답이면 아무것도 보여주지 않음
 * - 노출되면 최소 240ms 이상 유지
 */
export function useLoadingDelay(active: boolean, options: UseLoadingDelayOptions = {}) {
  const { delay = 120, minVisible = 240 } = options;
  const [shouldRender, setShouldRender] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const delayTimeoutRef = useRef<number | undefined>(undefined);
  const minVisibleTimeoutRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    // 기존 타이머들 정리
    if (delayTimeoutRef.current) clearTimeout(delayTimeoutRef.current);
    if (minVisibleTimeoutRef.current) clearTimeout(minVisibleTimeoutRef.current);

    if (active) {
      // 지연 노출: delay 시간 후에만 렌더링 시작
      delayTimeoutRef.current = window.setTimeout(() => {
        setShouldRender(true);
        setIsVisible(true);
      }, delay);
    } else {
      // 비활성화 시 즉시 숨김
      setShouldRender(false);
      setIsVisible(false);
    }

    return () => {
      if (delayTimeoutRef.current) clearTimeout(delayTimeoutRef.current);
      if (minVisibleTimeoutRef.current) clearTimeout(minVisibleTimeoutRef.current);
    };
  }, [active, delay]);

  // 최소 노출 시간 관리
  useEffect(() => {
    if (isVisible && !active) {
      // 최소 노출 시간 후에만 숨김
      minVisibleTimeoutRef.current = window.setTimeout(() => {
        setShouldRender(false);
        setIsVisible(false);
      }, minVisible);
    }
  }, [isVisible, active, minVisible]);

  return {
    shouldRender,
    isVisible,
  };
}
