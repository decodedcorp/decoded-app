"use client"

// src/tokens/index.ts
var tokens = {
  colors: {
    // 기존 재활용
    primary: "#EAFD66",
    black: "#000000",
    white: "#ffffff",
    gray: {
      900: "#171717",
      800: "#3b3b3b",
      700: "#4f4f4f",
      600: "#616161",
      500: "#828282",
      400: "#9e9e9e",
      300: "#d4d4d4",
      200: "#e0e0e0",
      100: "#f2f2f2"
    },
    // 시맨틱 컬러 추가
    semantic: {
      success: "#16a34a",
      error: "#dc2626",
      warning: "#d97706",
      info: "#0ea5e9"
    },
    // 상태별 컬러
    state: {
      hover: "rgba(234, 253, 102, 0.1)",
      active: "rgba(234, 253, 102, 0.2)",
      disabled: "rgba(130, 130, 130, 0.5)"
    }
  },
  spacing: {
    // 기존 재활용
    0: "0",
    1: "0.25rem",
    // 4px
    2: "0.5rem",
    // 8px 
    3: "0.75rem",
    // 12px
    4: "1rem",
    // 16px
    5: "1.25rem",
    // 20px
    6: "1.5rem",
    // 24px
    8: "2rem",
    // 32px
    10: "2.5rem",
    // 40px
    12: "3rem",
    // 48px
    // 컴포넌트별 시맨틱 간격 추가
    "button-sm": "0.5rem 0.75rem",
    "button-md": "0.75rem 1.5rem",
    "button-lg": "1rem 2rem",
    "input-padding": "0.75rem 1rem"
  },
  borderRadius: {
    none: "0",
    sm: "0.125rem",
    // 2px
    md: "0.375rem",
    // 6px - 기존 button
    lg: "0.5rem",
    // 8px - 기존 card
    xl: "0.75rem",
    // 12px - 기존 card-xl
    "2xl": "1rem",
    // 16px - 기존 card-2xl
    full: "9999px"
  },
  fontSize: {
    xs: ["0.75rem", { lineHeight: "1rem" }],
    sm: ["0.875rem", { lineHeight: "1.25rem" }],
    base: ["1rem", { lineHeight: "1.5rem" }],
    lg: ["1.125rem", { lineHeight: "1.75rem" }],
    xl: ["1.25rem", { lineHeight: "1.75rem" }],
    "2xl": ["1.5rem", { lineHeight: "2rem" }]
  },
  boxShadow: {
    none: "none",
    sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    md: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
    // 기존 elevated
    lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
    // 기존 modal
    xl: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
    // 기존 card-hover
  },
  zIndex: {
    base: 0,
    raised: 1,
    dropdown: 10,
    sticky: 20,
    overlay: 30,
    // 기존 header
    modal: 40,
    // 기존 modalContent + 20
    popover: 50,
    tooltip: 60
  },
  transition: {
    duration: {
      fast: "150ms",
      // 기존 재활용
      normal: "300ms",
      // 기존 default 재활용
      slow: "500ms"
      // 기존 재활용
    },
    timing: {
      ease: "cubic-bezier(0.4, 0, 0.2, 1)",
      // 기존 default
      "ease-in": "cubic-bezier(0.4, 0, 1, 1)",
      "ease-out": "cubic-bezier(0, 0, 0.2, 1)"
    }
  }
};
export {
  tokens
};
//# sourceMappingURL=index.mjs.map