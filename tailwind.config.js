module.exports = {
  theme: {
    extend: {
      screens: {
        // 기존 lg는 1024px부터
        'lg': '1024px',
        // 새 중단점 추가 (1124px 이상)
        'lg-plus': '1124px',
      },
    },
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '2rem',
        md: '2rem',
        lg: '0.5rem',     // 1024px 이상에서 패딩을 크게 줄임 (기존보다 더 작은 값)
        'lg-plus': '2rem', // 1124px 이상에서 원래 패딩으로 복원
        xl: '2rem',
        '2xl': '5rem',
      },
    },
  },
  // 다른 설정들...
} 