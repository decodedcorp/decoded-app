import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { forwardRef } from "react";

/**
 * Hotspot Variants
 *
 * Interactive marker component for identifying items on images.
 * Used in item spotting/detection features.
 *
 * Design specs from decoded.pen:
 * - Hotspot/Default: 24x24px, primary fill (#CFFF4C), circle, pulsing animation
 * - Hotspot/Numbered: 32x32px, primary fill, shows number (Inter 14px fontWeight 600)
 * - Hotspot/Inactive: 24x24px, primary at 50% opacity, no animation
 *
 * @see docs/design-system/decoded.pen
 */
export const hotspotVariants = cva(
  [
    "absolute rounded-full cursor-pointer",
    "transition-transform duration-150 ease-out",
    "hover:scale-110 active:scale-95",
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
  ],
  {
    variants: {
      variant: {
        default: [
          "h-6 w-6 bg-primary",
          "animate-pulse-soft",
        ],
        numbered: [
          "h-8 w-8 bg-primary",
          "flex items-center justify-center",
          "text-sm font-semibold text-primary-foreground",
        ],
        inactive: ["h-6 w-6 bg-primary/50"],
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface HotspotPosition {
  /** X position as percentage (0-100) */
  x: number;
  /** Y position as percentage (0-100) */
  y: number;
}

export interface HotspotProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children">,
    VariantProps<typeof hotspotVariants> {
  /** Position within parent container (percentages) */
  position: HotspotPosition;
  /** Number to display (only for "numbered" variant, 1-99) */
  number?: number;
  /** Item label for accessibility */
  label?: string;
}

/**
 * Hotspot Component
 *
 * Clickable marker for identifying items on images.
 * Position is specified as percentage coordinates for responsive layouts.
 *
 * IMPORTANT: Parent container must have `position: relative` for correct positioning.
 *
 * @example
 * // Default pulsing hotspot
 * <div className="relative">
 *   <Image src="..." alt="..." />
 *   <Hotspot
 *     position={{ x: 35, y: 60 }}
 *     onClick={() => handleItemClick(itemId)}
 *     label="Blue denim jacket"
 *   />
 * </div>
 *
 * @example
 * // Numbered hotspot
 * <Hotspot
 *   variant="numbered"
 *   number={1}
 *   position={{ x: 20, y: 40 }}
 *   onClick={handleClick}
 *   label="Item 1: Sneakers"
 * />
 *
 * @example
 * // Inactive (already selected) hotspot
 * <Hotspot
 *   variant="inactive"
 *   position={{ x: 50, y: 50 }}
 *   label="Selected item"
 * />
 */
export const Hotspot = forwardRef<HTMLButtonElement, HotspotProps>(
  (
    { className, variant = "default", position, number, label, style, ...props },
    ref
  ) => {
    // Clamp position values to valid range
    const clampedX = Math.max(0, Math.min(100, position.x));
    const clampedY = Math.max(0, Math.min(100, position.y));

    // Clamp number to displayable range
    const displayNumber =
      number !== undefined ? Math.max(1, Math.min(99, number)) : undefined;

    return (
      <button
        ref={ref}
        type="button"
        className={cn(hotspotVariants({ variant }), className)}
        style={{
          left: `${clampedX}%`,
          top: `${clampedY}%`,
          // Center the hotspot on the position point
          transform: "translate(-50%, -50%)",
          ...style,
        }}
        aria-label={label || `Hotspot${displayNumber ? ` ${displayNumber}` : ""}`}
        {...props}
      >
        {variant === "numbered" && displayNumber !== undefined && displayNumber}
      </button>
    );
  }
);

Hotspot.displayName = "Hotspot";

/**
 * CSS Keyframes for pulse-soft animation
 *
 * Add this to your tailwind.config.js theme.extend:
 *
 * ```js
 * animation: {
 *   'pulse-soft': 'pulse-soft 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
 * },
 * keyframes: {
 *   'pulse-soft': {
 *     '0%, 100%': { transform: 'translate(-50%, -50%) scale(1)', opacity: '1' },
 *     '50%': { transform: 'translate(-50%, -50%) scale(1.15)', opacity: '0.8' },
 *   },
 * },
 * ```
 *
 * Alternatively, add to globals.css:
 *
 * ```css
 * @keyframes pulse-soft {
 *   0%, 100% {
 *     transform: translate(-50%, -50%) scale(1);
 *     opacity: 1;
 *   }
 *   50% {
 *     transform: translate(-50%, -50%) scale(1.15);
 *     opacity: 0.8;
 *   }
 * }
 * ```
 */
