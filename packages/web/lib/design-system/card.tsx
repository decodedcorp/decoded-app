import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { forwardRef } from 'react';

/**
 * Card Variants
 *
 * Flexible card container with style variants, sizes, and slot composition.
 * Foundation for all card-based components (ProductCard, FeedCard, etc.).
 *
 * @see docs/design-system/decoded.pen
 */
export const cardVariants = cva(
  'rounded-lg transition-shadow', // Base styles for all cards
  {
    variants: {
      variant: {
        default: 'bg-card border border-border shadow-sm',
        elevated: 'bg-card border border-border shadow-md',
        outline: 'bg-card border-2 border-border',
        ghost: 'bg-transparent',
      },
      size: {
        sm: 'p-3',
        md: 'p-4',
        lg: 'p-6',
      },
      interactive: {
        true: 'cursor-pointer hover:shadow-lg',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
      interactive: false,
    },
  }
);

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

/**
 * Card Component
 *
 * Base card container with variant-based styling using cva.
 * Compose with CardHeader, CardContent, CardFooter for structured layouts.
 *
 * @example
 * <Card variant="elevated" size="lg">
 *   <CardHeader>Header content</CardHeader>
 *   <CardContent>Main content</CardContent>
 *   <CardFooter>Footer actions</CardFooter>
 * </Card>
 *
 * @example
 * <Card interactive variant="outline">
 *   <CardContent>Clickable card</CardContent>
 * </Card>
 */
export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, size, interactive, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(cardVariants({ variant, size, interactive }), className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

/**
 * CardHeader Component
 *
 * Header section for card title, subtitle, or metadata.
 * Automatically applies spacing between header and content.
 *
 * @example
 * <CardHeader>
 *   <Heading variant="h4">Card Title</Heading>
 *   <Text variant="small" textColor="muted">Subtitle</Text>
 * </CardHeader>
 */
export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('flex flex-col space-y-1.5 pb-4', className)} {...props}>
        {children}
      </div>
    );
  }
);

CardHeader.displayName = 'CardHeader';

export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {}

/**
 * CardContent Component
 *
 * Main content area with flexible children support.
 *
 * @example
 * <CardContent>
 *   <p>Card main content goes here</p>
 * </CardContent>
 */
export const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('flex-1', className)} {...props}>
        {children}
      </div>
    );
  }
);

CardContent.displayName = 'CardContent';

export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

/**
 * CardFooter Component
 *
 * Footer section for actions, buttons, or metadata.
 * Automatically applies spacing between content and footer.
 *
 * @example
 * <CardFooter>
 *   <Button variant="primary">Action</Button>
 *   <Button variant="ghost">Cancel</Button>
 * </CardFooter>
 */
export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('flex items-center pt-4', className)} {...props}>
        {children}
      </div>
    );
  }
);

CardFooter.displayName = 'CardFooter';
