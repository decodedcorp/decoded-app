import type { Config } from "tailwindcss";
import { colors } from "./lib/constants/colors";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./styles/**/*.{js,ts,jsx,tsx,mdx}",
    "./public/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // Animation & Transition Durations
      transitionDuration: {
        default: "300ms",
        fast: "150ms",
        slow: "500ms",
      },
      // Animation & Transition Timing Functions
      transitionTimingFunction: {
        default: "cubic-bezier(0.4, 0, 0.2, 1)",
        in: "cubic-bezier(0.4, 0, 1, 1)",
        out: "cubic-bezier(0, 0, 0.2, 1)",
      },
      // Custom Keyframes
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideDown: {
          "0%": { transform: "translateY(-20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "grid-flash": {
          "0%, 100%": { opacity: "0.1" },
          "50%": { opacity: "0.3" },
        },
        "pulse-subtle": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.8" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-4px)" },
        },
        rotate: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
      },
      // Custom Animations
      animation: {
        fadeIn: "fadeIn 0.5s ease-out",
        "slide-up": "slideUp 500ms ease-out",
        "slide-down": "slideDown 500ms ease-out",
        float: "float 1s cubic-bezier(0.37, 0, 0.63, 1) infinite",
        rotate: "rotate 10s linear infinite",
        "pulse-slow": "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      // Spacing & Layout
      spacing: {
        "header-desktop": "72px",
        "header-mobile": "60px",
        sidebar: "280px",
      },
      // Container Sizes
      maxWidth: {
        "50": "50%",
        "60": "60%",
        "70": "70%",
        "80": "80%",
        "90": "90%",
        content: "1280px",
        narrow: "768px",
      },
      // Font Sizes
      fontSize: {
        xs: ["0.75rem", { lineHeight: "1rem" }],
        sm: ["0.875rem", { lineHeight: "1.25rem" }],
        base: ["1rem", { lineHeight: "1.5rem" }],
        lg: ["1.125rem", { lineHeight: "1.75rem" }],
        xl: ["1.25rem", { lineHeight: "1.75rem" }],
        "2xl": ["1.5rem", { lineHeight: "2rem" }],
      },
      // Border Radius
      borderRadius: {
        button: "6px",
        card: "8px",
        input: "6px",
      },
      // Shadows
      boxShadow: {
        card: "0 2px 4px rgba(0,0,0,0.1)",
        elevated: "0 4px 6px -1px rgba(0,0,0,0.1)",
        modal: "0 10px 15px -3px rgba(0,0,0,0.1)",
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
        mainBackground: "var(--main-background-color)",
        textColor: "var(--text-color)",
        footerText: "var(--footer-text-color)",
        primary: "#EAFD66",
      },
      // Background Images
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      // Font Family
      fontFamily: {
        sans: ["var(--font-balenciaga)"],
      },
      // Screen Breakpoints
      screens: {
        mobile: "320px",
        tablet: "768px",
        desktop: "1024px",
        wide: "1440px",
      },
      // Z-Index Layer System
      zIndex: {
        // Base Layers (0-9)
        base: "0",
        content: "1",

        // Overlay Layers (10-19)
        overlay: "10",
        heroContent: "15",
        modalOverlay: "11",

        // Content Layers (20-29)
        modalContent: "20",

        // Navigation & Header Layers (30-39)
        header: "30",
        navigation: "31",

        // Maximum Layer
        max: "999",
      },
      // Grid Templates
      gridTemplateColumns: {
        custom: "repeat(10, minmax(0, 1fr))", // 10열 그리드
      },
      perspective: {
        "1000": "1000px",
      },
      rotate: {
        "y-3": "rotateY(3deg)",
        "y-5": "rotateY(5deg)",
        "x-3": "rotateX(3deg)",
        "x-5": "rotateX(5deg)",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require("@tailwindcss/aspect-ratio"),
    require("tailwindcss-filters"),
    require("daisyui"),
    function ({ addUtilities }: { addUtilities: any }) {
      const newUtilities = {
        ".text-shadow-neon": {
          "text-shadow": "0 0 5px #EAFD66, 0 0 10px #EAFD66",
        },
      };
      addUtilities(newUtilities);
    },
  ],
};

export default config;
