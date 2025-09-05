const { tokens } = require('./dist/tokens');

module.exports = {
  content: [],
  theme: {
    extend: {
      colors: {
        ...tokens.colors,
        // CSS 변수 추가 (다크모드 지원)
        background: 'var(--ui-bg, #ffffff)',
        foreground: 'var(--ui-fg, #171717)',
        muted: 'var(--ui-muted, #f2f2f2)',
        'muted-foreground': 'var(--ui-muted-fg, #616161)',
        border: 'var(--ui-border, #e0e0e0)',
      },
      spacing: tokens.spacing,
      borderRadius: tokens.borderRadius,
      fontSize: tokens.fontSize,
      boxShadow: tokens.boxShadow,
      zIndex: tokens.zIndex,
      transitionDuration: tokens.transition.duration,
      transitionTimingFunction: tokens.transition.timing,
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    function({ addBase, addComponents, addUtilities }) {
      // CSS 변수 정의 (다크모드)
      addBase({
        ':root': {
          '--ui-bg': '#ffffff',
          '--ui-fg': '#171717', 
          '--ui-muted': '#f2f2f2',
          '--ui-muted-fg': '#616161',
          '--ui-border': '#e0e0e0',
        },
        '[data-theme="dark"]': {
          '--ui-bg': '#000000',
          '--ui-fg': '#ffffff',
          '--ui-muted': '#171717', 
          '--ui-muted-fg': '#9e9e9e',
          '--ui-border': '#3b3b3b',
        }
      });
    }
  ]
};