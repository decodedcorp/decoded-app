/**
 * UX-friendly date formatting utilities with i18n support
 *
 * @example
 * // React 컴포넌트에서 사용 (권장)
 * const MyComponent = () => {
 *   const { formatRelativeTime, formatAbsoluteDate } = useDateFormatters();
 *   return <div>{formatRelativeTime(someDate)}</div>;
 * };
 *
 * // 직접 함수 사용 (비권장)
 * const { t } = useTranslation('common');
 * const formatted = formatRelativeTime(someDate, t);
 */

import { useTranslation } from 'react-i18next';

/**
 * 상대적 시간을 계산하여 UX 친화적인 문자열로 반환 (i18n 지원)
 * @param date - 변환할 날짜 (Date 객체 또는 ISO 문자열)
 * @param t - 번역 함수 (useTranslation에서 가져온 t 함수)
 * @returns UX 친화적인 시간 문자열
 */
export const formatRelativeTime = (
  date: Date | string,
  t: (key: string, options?: any) => string,
): string => {
  const now = new Date();
  const targetDate = typeof date === 'string' ? new Date(date) : date;

  // 유효하지 않은 날짜인 경우
  if (isNaN(targetDate.getTime())) {
    return t('time.unknown');
  }

  const diffInMs = now.getTime() - targetDate.getTime();
  const diffInSeconds = Math.floor(diffInMs / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  const diffInWeeks = Math.floor(diffInDays / 7);
  const diffInMonths = Math.floor(diffInDays / 30);
  const diffInYears = Math.floor(diffInDays / 365);

  // 1분 미만
  if (diffInSeconds < 60) {
    return t('time.justNow');
  }

  // 1시간 미만
  if (diffInMinutes < 60) {
    return t('time.minutesAgo', { minutes: diffInMinutes });
  }

  // 24시간 미만
  if (diffInHours < 24) {
    return t('time.hoursAgo', { hours: diffInHours });
  }

  // 7일 미만
  if (diffInDays < 7) {
    return t('time.daysAgo', { days: diffInDays });
  }

  // 4주 미만
  if (diffInWeeks < 4) {
    return t('time.weeksAgo', { weeks: diffInWeeks });
  }

  // 12개월 미만
  if (diffInMonths < 12) {
    return t('time.monthsAgo', { months: diffInMonths });
  }

  // 1년 이상
  return t('time.yearsAgo', { years: diffInYears });
};

/**
 * 절대적 날짜를 UX 친화적인 형식으로 반환 (i18n 지원)
 * @param date - 변환할 날짜 (Date 객체 또는 ISO 문자열)
 * @param t - 번역 함수 (useTranslation에서 가져온 t 함수)
 * @param options - 포맷 옵션
 * @returns UX 친화적인 날짜 문자열
 */
export const formatAbsoluteDate = (
  date: Date | string,
  t: (key: string, options?: any) => string,
  options: {
    includeTime?: boolean;
    shortFormat?: boolean;
  } = {},
): string => {
  const targetDate = typeof date === 'string' ? new Date(date) : date;

  // 유효하지 않은 날짜인 경우
  if (isNaN(targetDate.getTime())) {
    return t('time.unknown');
  }

  const { includeTime = false, shortFormat = false } = options;

  const year = targetDate.getFullYear();
  const month = targetDate.getMonth();
  const day = targetDate.getDate();
  const hours = targetDate.getHours();
  const minutes = targetDate.getMinutes();

  // 월 이름 배열 (현재는 영어로 고정, 필요시 로케일별로 분기)
  const monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  // 항상 년도 표시
  if (shortFormat) {
    // 짧은 형식: "Apr 15, 2025"
    return `${monthNames[month]} ${day}, ${year}`;
  }

  // 긴 형식: "Apr 15, 2025"
  let dateString = `${monthNames[month]} ${day}, ${year}`;

  if (includeTime) {
    const timeString = `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}`;
    dateString += ` ${timeString}`;
  }

  return dateString;
};

/**
 * 컨텍스트에 따라 적절한 날짜 형식을 선택하여 반환 (i18n 지원)
 * @param date - 변환할 날짜 (Date 객체 또는 ISO 문자열)
 * @param t - 번역 함수 (useTranslation에서 가져온 t 함수)
 * @param context - 사용 컨텍스트 ('list' | 'detail' | 'card')
 * @returns 컨텍스트에 맞는 날짜 문자열
 */
export const formatDateByContext = (
  date: Date | string,
  t: (key: string, options?: any) => string,
  context: 'list' | 'detail' | 'card' = 'list',
): string => {
  const targetDate = typeof date === 'string' ? new Date(date) : date;

  // 유효하지 않은 날짜인 경우
  if (isNaN(targetDate.getTime())) {
    return t('time.unknown');
  }

  const now = new Date();
  const diffInDays = Math.floor((now.getTime() - targetDate.getTime()) / (1000 * 60 * 60 * 24));

  switch (context) {
    case 'list':
      // 목록에서는 상대적 시간 사용 (7일 이내)
      if (diffInDays < 7) {
        return formatRelativeTime(targetDate, t);
      }
      // 7일 이상이면 절대적 날짜 사용
      return formatAbsoluteDate(targetDate, t, { shortFormat: true });

    case 'detail':
      // 상세 페이지에서는 절대적 날짜와 시간 모두 표시
      return formatAbsoluteDate(targetDate, t, { includeTime: true });

    case 'card':
      // 카드에서는 짧은 상대적 시간 사용
      if (diffInDays < 1) {
        return formatRelativeTime(targetDate, t);
      }
      return formatAbsoluteDate(targetDate, t, { shortFormat: true });

    default:
      return formatRelativeTime(targetDate, t);
  }
};

/**
 * 날짜가 최근인지 확인 (7일 이내)
 * @param date - 확인할 날짜 (Date 객체 또는 ISO 문자열)
 * @returns 최근 여부
 */
export const isRecentDate = (date: Date | string): boolean => {
  const targetDate = typeof date === 'string' ? new Date(date) : date;

  if (isNaN(targetDate.getTime())) {
    return false;
  }

  const now = new Date();
  const diffInDays = Math.floor((now.getTime() - targetDate.getTime()) / (1000 * 60 * 60 * 24));

  return diffInDays < 7;
};

/**
 * 날짜가 오늘인지 확인
 * @param date - 확인할 날짜 (Date 객체 또는 ISO 문자열)
 * @returns 오늘 여부
 */
export const isToday = (date: Date | string): boolean => {
  const targetDate = typeof date === 'string' ? new Date(date) : date;

  if (isNaN(targetDate.getTime())) {
    return false;
  }

  const now = new Date();

  return (
    targetDate.getDate() === now.getDate() &&
    targetDate.getMonth() === now.getMonth() &&
    targetDate.getFullYear() === now.getFullYear()
  );
};

// React 훅을 위한 편의 함수들
/**
 * React 컴포넌트에서 사용할 수 있는 날짜 포맷팅 훅
 * @returns 날짜 포맷팅 함수들
 */
export const useDateFormatters = () => {
  const { t } = useTranslation('common');

  return {
    formatRelativeTime: (date: Date | string) => formatRelativeTime(date, t),
    formatAbsoluteDate: (
      date: Date | string,
      options?: { includeTime?: boolean; shortFormat?: boolean },
    ) => formatAbsoluteDate(date, t, options),
    formatDateByContext: (date: Date | string, context?: 'list' | 'detail' | 'card') =>
      formatDateByContext(date, t, context),
    isRecentDate,
    isToday,
  };
};
