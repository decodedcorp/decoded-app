"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils/style";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 focus:outline-none",
  {
    variants: {
      variant: {
        default: "bg-[#D8E861] text-black hover:bg-[#E5F270]",
        destructive:
          "bg-[#FF6F61] text-white/80 hover:bg-[#E57373] focus-visible:ring-[#FF6F61]",
        outline:
          "border border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-black focus-visible:ring-gray-300",
        secondary:
          "bg-[#828282] text-white/80 hover:bg-[#616161] focus-visible:ring-[#828282]",
        ghost: "text-black hover:bg-black hover:text-white/80",
        link: "text-[#EAFD66] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
