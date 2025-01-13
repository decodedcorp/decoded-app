export function getRelativeTime(at: string) {
  try {
    const date = new Date(at);
    if (isNaN(date.getTime())) {
      console.error('Invalid date:', at);
      return '알 수 없음';
    }

    const now = new Date();
    const diff = Math.max(0, now.getTime() - date.getTime());

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}일 전`;
    if (hours > 0) return `${hours}시간 전`;
    if (minutes > 0) return `${minutes}분 전`;
    if (seconds > 0) return `${seconds}초 전`;
    return '방금 전';
  } catch (error) {
    console.error('Error calculating relative time:', error);
    return '알 수 없음';
  }
} 