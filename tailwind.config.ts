import type { Config } from 'tailwindcss';
import { colors } from './src/constants/colors';

const config: Config = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/shared/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/styles/**/*.{js,ts,jsx,tsx,mdx}',
    './src/domains/**/*.{js,ts,jsx,tsx,mdx}',
    './src/constants/**/*.{js,ts,jsx,tsx,mdx}',
    './src/lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // Animation & Transition Durations
      transitionDuration: {
        default: '300ms',
        fast: '150ms',
        slow: '500ms',
      },
      // Animation & Transition Timing Functions
      transitionTimingFunction: {
        default: 'cubic-bezier(0.4, 0, 0.2, 1)',
        in: 'cubic-bezier(0.4, 0, 1, 1)',
        out: 'cubic-bezier(0, 0, 0.2, 1)',
      },
      // Custom Keyframes
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'marquee-reverse': {
          '0%': { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': {
            transform: 'translateY(-100%)',
            opacity: '0',
          },
          '100%': {
            transform: 'translateY(0)',
            opacity: '1',
          },
        },
        'grid-flash': {
          '0%, 100%': { opacity: '0.1' },
          '50%': { opacity: '0.3' },
        },
        'pulse-subtle': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        rotate: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        fill: {
          '0%': { fill: 'transparent' },
          '50%': { fill: 'rgb(234 179 8)', stroke: 'rgb(234 179 8)' }, // yellow-500
          '100%': { fill: 'transparent' },
        },
        'scale-in': {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      // Custom Animations
      animation: {
        fadeIn: 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 500ms ease-out',
        'slide-down': 'slide-down 0.3s ease-out forwards',
        float: 'float 2s ease-in-out infinite',
        rotate: 'rotate 10s linear infinite',
        'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'marquee-infinite': 'marquee 25s linear infinite',
        'marquee-reverse-infinite': 'marquee-reverse 25s linear infinite',
        fill: 'fill 2s ease-in-out infinite',
        'expand-in': 'expand-in 0.6s ease-out forwards',
        'fade-in': 'fade-in 0.4s ease-out forwards',
        'scale-in': 'scale-in 0.3s ease-out forwards',
      },
      // Spacing & Layout
      spacing: {
        'header-desktop': '72px',
        'header-mobile': '60px',
        sidebar: '280px',
        'card-header': '28px',
      },
      // Container Sizes
      maxWidth: {
        '50': '50%',
        '60': '60%',
        '70': '70%',
        '80': '80%',
        '90': '90%',
        content: '1280px',
        narrow: '768px',
      },
      // Font Sizes
      fontSize: {
        xs: ['0.75rem', { lineHeight: '1rem' }],
        sm: ['0.875rem', { lineHeight: '1.25rem' }],
        base: ['1rem', { lineHeight: '1.5rem' }],
        lg: ['1.125rem', { lineHeight: '1.75rem' }],
        xl: ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
      },
      // Border Radius
      borderRadius: {
        button: '6px',
        card: '8px',
        input: '6px',
        'card-xl': '12px',
        'card-2xl': '16px',
      },
      // Shadows
      boxShadow: {
        card: '0 2px 4px rgba(0,0,0,0.1)',
        elevated: '0 4px 6px -1px rgba(0,0,0,0.1)',
        modal: '0 10px 15px -3px rgba(0,0,0,0.1)',
        'card-hover': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      },
      // Colors
      colors: {
        black: colors.black,
        white: colors.white,
        gray: {
          900: colors.gray[900],
          800: colors.gray[800],
          700: colors.gray[700],
          600: colors.gray[600],
          500: colors.gray[500],
          400: colors.gray[400],
          300: colors.gray[300],
          200: colors.gray[200],
          100: colors.gray[100],
        },
        mainBackground: 'var(--main-background-color)',
        textColor: 'var(--text-color)',
        footerText: 'var(--footer-text-color)',
        primary: '#EAFD66',
        // Badge colors
        badge: {
          new: '#16a34a', // green-600
          hot: '#db2777', // pink-600
        },
      },
      // Background Images
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      // Font Family
      fontFamily: {
        sans: [
          'var(--font-balenciaga)',
          '-apple-system',
          'BlinkMacSystemFont',
          'system-ui',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
      },
      // Screen Breakpoints
      screens: {
        mobile: '320px',
        tablet: '768px',
        desktop: '1024px',
        wide: '1440px',
      },
      // Z-Index Layer System
      zIndex: {
        // Base Layers (0-9)
        base: '0',
        content: '1',

        // Overlay Layers (10-19)
        overlay: '10',
        heroContent: '15',
        modalOverlay: '11',

        // Content Layers (20-29)
        modalContent: '20',

        // Navigation & Header Layers (30-39)
        header: '30',
        navigation: '31',

        // Maximum Layer
        max: '999',
      },
      // Grid Templates
      gridTemplateColumns: {
        custom: 'repeat(10, minmax(0, 1fr))', // 10열 그리드
        'masonry-mobile': 'repeat(1, minmax(0, 1fr))',
        'masonry-tablet': 'repeat(2, minmax(0, 1fr))',
        'masonry-desktop': 'repeat(3, minmax(0, 1fr))',
        'masonry-wide': 'repeat(4, minmax(0, 1fr))',
        'masonry-xl': 'repeat(5, minmax(0, 1fr))',
      },
      perspective: {
        '1000': '1000px',
      },
      rotate: {
        'y-3': 'rotateY(3deg)',
        'y-5': 'rotateY(5deg)',
        'x-3': 'rotateX(3deg)',
        'x-5': 'rotateX(5deg)',
      },
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '2rem',
          lg: '1rem',
          xl: '3rem',
        },
        screens: {
          sm: '640px',
          md: '768px',
          lg: '1124px',
          xl: '1380px',
          '2xl': '1636px',
        },
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    require('@tailwindcss/aspect-ratio'),
    require('tailwindcss-filters'),
    require('daisyui'),
    function ({ addUtilities, addComponents }: { addUtilities: any; addComponents: any }) {
      // Utilities
      const newUtilities = {
        '.text-shadow-neon': {
          'text-shadow': '0 0 5px #EAFD66, 0 0 10px #EAFD66',
        },
        '.break-inside-avoid': {
          'break-inside': 'avoid',
        },
        '.scrollbar-hide': {
          /* IE and Edge */
          '-ms-overflow-style': 'none',
          /* Firefox */
          'scrollbar-width': 'none',
          /* Safari and Chrome */
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        },
      };
      addUtilities(newUtilities);
    },
  ],
};

export default config;
