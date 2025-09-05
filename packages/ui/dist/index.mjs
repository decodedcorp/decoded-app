"use client"

// src/components/Icon/Icon.tsx
import { forwardRef } from "react";

// src/lib/utils.ts
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// src/components/Icon/iconMap.ts
import {
  Plus,
  Minus,
  X,
  Check,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  Search,
  Filter,
  Settings,
  Menu,
  MoreHorizontal,
  MoreVertical,
  Eye,
  EyeOff,
  Edit,
  Trash2,
  Download,
  Upload,
  Copy,
  Share,
  AlertCircle,
  CheckCircle,
  Info,
  XCircle,
  Loader2,
  User,
  Users,
  Heart,
  MessageSquare,
  Bookmark,
  Bell,
  Image,
  Video,
  Music,
  File,
  FileText,
  Home,
  Grid3X3,
  List,
  Calendar,
  Mail,
  Phone
} from "lucide-react";
var iconMap = {
  // Basic actions
  "plus": Plus,
  "minus": Minus,
  "x": X,
  "check": Check,
  "chevron-down": ChevronDown,
  "chevron-up": ChevronUp,
  "chevron-left": ChevronLeft,
  "chevron-right": ChevronRight,
  "arrow-left": ArrowLeft,
  "arrow-right": ArrowRight,
  "arrow-up": ArrowUp,
  "arrow-down": ArrowDown,
  // UI elements
  "search": Search,
  "filter": Filter,
  "settings": Settings,
  "menu": Menu,
  "more-horizontal": MoreHorizontal,
  "more-vertical": MoreVertical,
  "eye": Eye,
  "eye-off": EyeOff,
  "edit": Edit,
  "trash": Trash2,
  "download": Download,
  "upload": Upload,
  "copy": Copy,
  "share": Share,
  // Status
  "alert-circle": AlertCircle,
  "check-circle": CheckCircle,
  "info": Info,
  "x-circle": XCircle,
  "loader-2": Loader2,
  // User & social
  "user": User,
  "users": Users,
  "heart": Heart,
  "message-square": MessageSquare,
  "bookmark": Bookmark,
  "bell": Bell,
  // Media
  "image": Image,
  "video": Video,
  "music": Music,
  "file": File,
  "file-text": FileText,
  // Navigation
  "home": Home,
  "grid": Grid3X3,
  "list": List,
  "calendar": Calendar,
  "mail": Mail,
  "phone": Phone
};

// src/components/Icon/Icon.tsx
import { jsx } from "react/jsx-runtime";
var Icon = forwardRef(
  ({ name, size = 16, className, ...props }, ref) => {
    const IconComponent = iconMap[name];
    if (!IconComponent) {
      console.warn(`Icon "${name}" not found in iconMap`);
      return null;
    }
    return /* @__PURE__ */ jsx(
      IconComponent,
      {
        ref,
        width: size,
        height: size,
        className: cn("inline-block", className),
        "aria-hidden": "true",
        ...props
      }
    );
  }
);
Icon.displayName = "Icon";

// src/components/VisuallyHidden/VisuallyHidden.tsx
import { forwardRef as forwardRef2 } from "react";
import { jsx as jsx2 } from "react/jsx-runtime";
var VisuallyHidden = forwardRef2(
  ({ children, asChild = false, className, ...props }, ref) => {
    if (asChild) {
      return children;
    }
    return /* @__PURE__ */ jsx2(
      "span",
      {
        ref,
        className: cn(
          "absolute w-px h-px p-0 -m-px overflow-hidden whitespace-nowrap border-0",
          className
        ),
        ...props,
        children
      }
    );
  }
);
VisuallyHidden.displayName = "VisuallyHidden";

// src/components/Button/Button.tsx
import { forwardRef as forwardRef3 } from "react";
import { cva } from "class-variance-authority";
import { jsx as jsx3, jsxs } from "react/jsx-runtime";
var buttonVariants = cva(
  // 기본 스타일 (프로젝트 테마 컬러 적용)
  "inline-flex items-center justify-center gap-2 rounded-md font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        // 프로젝트 테마 컬러 적용 - primary는 테마 컬러 사용
        primary: "bg-gray-900 text-[#EAFD66] hover:bg-[#EAFD66] hover:text-black shadow-sm hover:shadow-md",
        secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300 shadow-sm hover:shadow-md",
        outline: "border border-gray-300 bg-transparent text-gray-900 hover:bg-gray-100 hover:border-gray-400",
        ghost: "bg-transparent text-gray-900 hover:bg-gray-100",
        destructive: "bg-red-600 text-white hover:bg-red-700 shadow-sm hover:shadow-md",
        // 테마 컬러를 사용한 새로운 variant들
        accent: "bg-[#EAFD66] text-black hover:bg-[#EAFD66]/90 shadow-sm hover:shadow-md",
        "accent-outline": "border border-[#EAFD66] bg-transparent text-[#EAFD66] hover:bg-[#EAFD66] hover:text-black",
        // 로그인 버튼 전용 variant - 더 명확한 테마 컬러 적용
        login: "bg-gray-900 text-[#EAFD66] hover:bg-[#EAFD66] hover:text-black border border-[#EAFD66]/20 hover:border-[#EAFD66]/40 shadow-sm hover:shadow-md"
      },
      size: {
        sm: "h-8 px-3 text-sm",
        md: "h-10 px-4 text-base",
        lg: "h-12 px-6 text-lg",
        xl: "h-14 px-8 text-xl"
      }
    },
    defaultVariants: {
      variant: "primary",
      size: "md"
    }
  }
);
var Button = forwardRef3(
  ({
    className,
    variant,
    size,
    loading,
    icon,
    iconPosition = "left",
    disabled,
    children,
    ...props
  }, ref) => {
    const isDisabled = disabled || loading;
    return /* @__PURE__ */ jsxs(
      "button",
      {
        className: cn(buttonVariants({ variant, size, className })),
        disabled: isDisabled,
        "aria-busy": loading,
        ref,
        ...props,
        children: [
          loading && /* @__PURE__ */ jsx3(Icon, { name: "loader-2", className: "h-4 w-4 animate-spin", "aria-hidden": "true" }),
          !loading && icon && iconPosition === "left" && /* @__PURE__ */ jsx3(Icon, { name: icon, className: "h-4 w-4", "aria-hidden": "true" }),
          children,
          !loading && icon && iconPosition === "right" && /* @__PURE__ */ jsx3(Icon, { name: icon, className: "h-4 w-4", "aria-hidden": "true" })
        ]
      }
    );
  }
);
Button.displayName = "Button";

// src/components/Dialog/Dialog.tsx
import { forwardRef as forwardRef4 } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cva as cva2 } from "class-variance-authority";
import { jsx as jsx4, jsxs as jsxs2 } from "react/jsx-runtime";
var dialogContentVariants = cva2(
  "fixed left-[50%] top-[50%] z-modal w-full max-w-sm sm:max-w-lg md:max-w-xl lg:max-w-2xl xl:max-w-3xl translate-x-[-50%] translate-y-[-50%] gap-4 border border-white/10 bg-white p-4 sm:p-6 shadow-xl transition-all duration-300 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
  {
    variants: {
      variant: {
        default: "bg-white [&>*]:text-gray-900",
        alert: "border-red-200 bg-red-50 [&>*]:text-red-900"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);
var DialogPortal = DialogPrimitive.Portal;
var DialogClose = DialogPrimitive.Close;
var Dialog = ({ children, ...props }) => /* @__PURE__ */ jsx4(DialogPrimitive.Root, { ...props, children });
var DialogTrigger = DialogPrimitive.Trigger;
var DialogContent = forwardRef4(({ className, variant, hideCloseButton = false, children, ...props }, ref) => /* @__PURE__ */ jsxs2(DialogPortal, { children: [
  /* @__PURE__ */ jsx4(DialogPrimitive.Overlay, { className: "fixed inset-0 z-overlay bg-black/50 backdrop-blur-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" }),
  /* @__PURE__ */ jsxs2(
    DialogPrimitive.Content,
    {
      ref,
      className: cn(dialogContentVariants({ variant }), className),
      ...props,
      children: [
        children,
        !hideCloseButton && /* @__PURE__ */ jsx4(
          DialogPrimitive.Close,
          {
            className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:pointer-events-none",
            "aria-label": "Close dialog",
            children: /* @__PURE__ */ jsx4(Icon, { name: "x", className: "h-4 w-4" })
          }
        )
      ]
    }
  )
] }));
DialogContent.displayName = "DialogContent";
var DialogHeader = ({ className, ...props }) => /* @__PURE__ */ jsx4("div", { className: cn("flex flex-col space-y-1.5 text-center sm:text-left", className), ...props });
var DialogTitle = forwardRef4(({ className, ...props }, ref) => /* @__PURE__ */ jsx4(
  DialogPrimitive.Title,
  {
    ref,
    className: cn("text-lg font-semibold leading-none tracking-tight", className),
    ...props
  }
));
DialogTitle.displayName = "DialogTitle";
var DialogDescription = forwardRef4(({ className, ...props }, ref) => /* @__PURE__ */ jsx4(
  DialogPrimitive.Description,
  {
    ref,
    className: cn("text-sm text-muted-foreground", className),
    ...props
  }
));
DialogDescription.displayName = "DialogDescription";
var DialogFooter = ({ className, ...props }) => /* @__PURE__ */ jsx4(
  "div",
  {
    className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
    ...props
  }
);

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
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Icon,
  VisuallyHidden,
  cn,
  iconMap,
  tokens
};
//# sourceMappingURL=index.mjs.map