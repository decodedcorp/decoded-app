import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils/style"

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-4 py-2 text-base font-medium transition-all duration-200 cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-gray-800 text-primary hover:bg-gray-900",
        secondary:
          "border-none bg-zinc-100 hover:bg-primary/10 text-zinc-900 hover:text-primary dark:bg-zinc-800 dark:hover:bg-primary/20 dark:text-zinc-100 dark:hover:text-primary-foreground",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: 
          "text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }