import { forwardRef, type ReactNode } from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { cva } from 'class-variance-authority';
import { cn } from '../../lib/utils';
import { Icon } from '../Icon';

// 기존 LoginModal 애니메이션과 스타일 재활용
const dialogContentVariants = cva(
  'fixed left-[50%] top-[50%] z-modal w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-white/10 bg-white p-6 shadow-xl transition-all duration-300 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg',
  {
    variants: {
      variant: {
        default: 'bg-white [&>*]:text-gray-900',
        alert: 'border-red-200 bg-red-50 [&>*]:text-red-900'
      }
    },
    defaultVariants: {
      variant: 'default'
    }
  }
);

const DialogPortal = DialogPrimitive.Portal;
export const DialogClose = DialogPrimitive.Close;

export interface DialogProps extends DialogPrimitive.DialogProps {
  children: ReactNode;
}

export const Dialog = ({ children, ...props }: DialogProps) => (
  <DialogPrimitive.Root {...props}>
    {children}
  </DialogPrimitive.Root>
);

export const DialogTrigger = DialogPrimitive.Trigger;

export interface DialogContentProps 
  extends DialogPrimitive.DialogContentProps {
  variant?: 'default' | 'alert';
  hideCloseButton?: boolean;
}

export const DialogContent = forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  DialogContentProps
>(({ className, variant, hideCloseButton = false, children, ...props }, ref) => (
  <DialogPortal>
    <DialogPrimitive.Overlay
      className="fixed inset-0 z-overlay bg-black/50 backdrop-blur-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
    />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(dialogContentVariants({ variant }), className)}
      {...props}
    >
      {children}
      {!hideCloseButton && (
        <DialogPrimitive.Close 
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:pointer-events-none"
          aria-label="Close dialog"
        >
          <Icon name="x" className="h-4 w-4" />
        </DialogPrimitive.Close>
      )}
    </DialogPrimitive.Content>
  </DialogPortal>
));

DialogContent.displayName = 'DialogContent';

export const DialogHeader = ({ 
  className, 
  ...props 
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn('flex flex-col space-y-1.5 text-center sm:text-left', className)}
    {...props}
  />
);

export const DialogTitle = forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn('text-lg font-semibold leading-none tracking-tight', className)}
    {...props}
  />
));

DialogTitle.displayName = 'DialogTitle';

export const DialogDescription = forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>  
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
));

DialogDescription.displayName = 'DialogDescription';

export const DialogFooter = ({ 
  className, 
  ...props 
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn('flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2', className)}
    {...props}
  />
);