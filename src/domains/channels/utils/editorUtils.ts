// 이름에서 이니셜 추출
export function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();
}

// ISO 국가코드를 국기 이모지로 변환
export function countryCodeToFlag(code?: string) {
  if (!code) return null;
  return code
    .toUpperCase()
    .replace(/./g, (char) => String.fromCodePoint(127397 + char.charCodeAt(0)));
}
