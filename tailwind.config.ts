import type { Config } from 'tailwindcss';
import { colors } from './lib/constants/colors';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './styles/**/*.{js,ts,jsx,tsx,mdx}',
    './public/**/*.{js,ts,jsx,tsx,mdx}',
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
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      // Custom Animations
      animation: {
        'fade-in': 'fadeIn 300ms ease-out',
        'slide-up': 'slideUp 500ms ease-out',
        'slide-down': 'slideDown 500ms ease-out',
      },
      // Spacing & Layout
      spacing: {
        'header-desktop': '72px',
        'header-mobile': '60px',
        sidebar: '280px',
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
      },
      // Shadows
      boxShadow: {
        card: '0 2px 4px rgba(0,0,0,0.1)',
        elevated: '0 4px 6px -1px rgba(0,0,0,0.1)',
        modal: '0 10px 15px -3px rgba(0,0,0,0.1)',
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
      },
      // Background Images
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      // Font Family
      fontFamily: {
        sans: ['var(--font-balenciaga)'],
      },
      // Screen Breakpoints
      screens: {
        mobile: '320px',
        tablet: '768px',
        desktop: '1024px',
        wide: '1440px',
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    require('@tailwindcss/aspect-ratio'),
    require('daisyui'),
  ],
};

export default config;
