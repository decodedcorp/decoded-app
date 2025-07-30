/**
 * UX-friendly date formatting utilities
 */

/**
 * 상대적 시간을 계산하여 UX 친화적인 문자열로 반환
 * @param date - 변환할 날짜 (Date 객체 또는 ISO 문자열)
 * @returns UX 친화적인 시간 문자열
 */
export const formatRelativeTime = (date: Date | string): string => {
  const now = new Date();
  const targetDate = typeof date === 'string' ? new Date(date) : date;
  
  // 유효하지 않은 날짜인 경우
  if (isNaN(targetDate.getTime())) {
    return 'Invalid date';
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
    return 'Just now';
  }
  
  // 1시간 미만
  if (diffInMinutes < 60) {
    return `${diffInMinutes} min ago`;
  }
  
  // 24시간 미만
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  }
  
  // 7일 미만
  if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  }
  
  // 4주 미만
  if (diffInWeeks < 4) {
    return `${diffInWeeks} week${diffInWeeks > 1 ? 's' : ''} ago`;
  }
  
  // 12개월 미만
  if (diffInMonths < 12) {
    return `${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`;
  }
  
  // 1년 이상
  return `${diffInYears} year${diffInYears > 1 ? 's' : ''} ago`;
};

/**
 * 절대적 날짜를 UX 친화적인 형식으로 반환
 * @param date - 변환할 날짜 (Date 객체 또는 ISO 문자열)
 * @param options - 포맷 옵션
 * @returns UX 친화적인 날짜 문자열
 */
export const formatAbsoluteDate = (
  date: Date | string,
  options: {
    includeTime?: boolean;
    shortFormat?: boolean;
  } = {}
): string => {
  const targetDate = typeof date === 'string' ? new Date(date) : date;
  
  // 유효하지 않은 날짜인 경우
  if (isNaN(targetDate.getTime())) {
    return 'Invalid date';
  }

  const { includeTime = false, shortFormat = false } = options;
  
  const year = targetDate.getFullYear();
  const month = targetDate.getMonth();
  const day = targetDate.getDate();
  const hours = targetDate.getHours();
  const minutes = targetDate.getMinutes();

  // 월 이름 배열
  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  // 항상 년도 표시
  if (shortFormat) {
    // 짧은 형식: "Apr 15, 2025"
    return `${monthNames[month]} ${day}, ${year}`;
  }

  // 긴 형식: "Apr 15, 2025"
  let dateString = `${monthNames[month]} ${day}, ${year}`;
  
  if (includeTime) {
    const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    dateString += ` ${timeString}`;
  }

  return dateString;
};

/**
 * 컨텍스트에 따라 적절한 날짜 형식을 선택하여 반환
 * @param date - 변환할 날짜 (Date 객체 또는 ISO 문자열)
 * @param context - 사용 컨텍스트 ('list' | 'detail' | 'card')
 * @returns 컨텍스트에 맞는 날짜 문자열
 */
export const formatDateByContext = (
  date: Date | string,
  context: 'list' | 'detail' | 'card' = 'list'
): string => {
  const targetDate = typeof date === 'string' ? new Date(date) : date;
  
  // 유효하지 않은 날짜인 경우
  if (isNaN(targetDate.getTime())) {
    return '날짜 정보 없음';
  }

  const now = new Date();
  const diffInDays = Math.floor((now.getTime() - targetDate.getTime()) / (1000 * 60 * 60 * 24));

  switch (context) {
    case 'list':
      // 목록에서는 상대적 시간 사용 (7일 이내)
      if (diffInDays < 7) {
        return formatRelativeTime(targetDate);
      }
      // 7일 이상이면 절대적 날짜 사용
      return formatAbsoluteDate(targetDate, { shortFormat: true });
      
    case 'detail':
      // 상세 페이지에서는 절대적 날짜와 시간 모두 표시
      return formatAbsoluteDate(targetDate, { includeTime: true });
      
    case 'card':
      // 카드에서는 짧은 상대적 시간 사용
      if (diffInDays < 1) {
        return formatRelativeTime(targetDate);
      }
      return formatAbsoluteDate(targetDate, { shortFormat: true });
      
    default:
      return formatRelativeTime(targetDate);
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