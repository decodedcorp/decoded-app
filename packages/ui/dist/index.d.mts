import * as react from 'react';
import { SVGAttributes, HTMLAttributes, ReactNode, ButtonHTMLAttributes } from 'react';
import { LucideIcon } from 'lucide-react';
export { LucideIcon } from 'lucide-react';
import * as class_variance_authority_dist_types from 'class-variance-authority/dist/types';
import { VariantProps } from 'class-variance-authority';
import * as react_jsx_runtime from 'react/jsx-runtime';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { ClassValue } from 'clsx';
export { Tokens, tokens } from './tokens/index.mjs';

declare const iconMap: {
    readonly plus: LucideIcon;
    readonly minus: LucideIcon;
    readonly x: LucideIcon;
    readonly check: LucideIcon;
    readonly 'chevron-down': LucideIcon;
    readonly 'chevron-up': LucideIcon;
    readonly 'chevron-left': LucideIcon;
    readonly 'chevron-right': LucideIcon;
    readonly 'arrow-left': LucideIcon;
    readonly 'arrow-right': LucideIcon;
    readonly 'arrow-up': LucideIcon;
    readonly 'arrow-down': LucideIcon;
    readonly search: LucideIcon;
    readonly filter: LucideIcon;
    readonly settings: LucideIcon;
    readonly menu: LucideIcon;
    readonly 'more-horizontal': LucideIcon;
    readonly 'more-vertical': LucideIcon;
    readonly eye: LucideIcon;
    readonly 'eye-off': LucideIcon;
    readonly edit: LucideIcon;
    readonly trash: LucideIcon;
    readonly download: LucideIcon;
    readonly upload: LucideIcon;
    readonly copy: LucideIcon;
    readonly share: LucideIcon;
    readonly 'alert-circle': LucideIcon;
    readonly 'check-circle': LucideIcon;
    readonly info: LucideIcon;
    readonly 'x-circle': LucideIcon;
    readonly 'loader-2': LucideIcon;
    readonly user: LucideIcon;
    readonly users: LucideIcon;
    readonly heart: LucideIcon;
    readonly 'message-square': LucideIcon;
    readonly bookmark: LucideIcon;
    readonly bell: LucideIcon;
    readonly image: LucideIcon;
    readonly video: LucideIcon;
    readonly music: LucideIcon;
    readonly file: LucideIcon;
    readonly 'file-text': LucideIcon;
    readonly home: LucideIcon;
    readonly grid: LucideIcon;
    readonly list: LucideIcon;
    readonly calendar: LucideIcon;
    readonly mail: LucideIcon;
    readonly phone: LucideIcon;
};
type IconName = keyof typeof iconMap;

interface IconProps extends Omit<SVGAttributes<SVGElement>, 'name'> {
    name: IconName;
    size?: number | string;
}
declare const Icon: react.ForwardRefExoticComponent<IconProps & react.RefAttributes<SVGSVGElement>>;

interface VisuallyHiddenProps extends HTMLAttributes<HTMLSpanElement> {
    children: ReactNode;
    asChild?: boolean;
}
declare const VisuallyHidden: react.ForwardRefExoticComponent<VisuallyHiddenProps & react.RefAttributes<HTMLSpanElement>>;

declare const buttonVariants: (props?: ({
    variant?: "primary" | "secondary" | "outline" | "ghost" | "destructive" | "accent" | "accent-outline" | "login" | "comments-floating" | null | undefined;
    size?: "sm" | "md" | "lg" | "xl" | null | undefined;
} & class_variance_authority_dist_types.ClassProp) | undefined) => string;
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
    loading?: boolean;
    icon?: IconName;
    iconPosition?: 'left' | 'right';
}
declare const Button: react.ForwardRefExoticComponent<ButtonProps & react.RefAttributes<HTMLButtonElement>>;

declare const DialogClose: react.ForwardRefExoticComponent<DialogPrimitive.DialogCloseProps & react.RefAttributes<HTMLButtonElement>>;
interface DialogProps extends DialogPrimitive.DialogProps {
    children: ReactNode;
}
declare const Dialog: ({ children, ...props }: DialogProps) => react_jsx_runtime.JSX.Element;
declare const DialogTrigger: react.ForwardRefExoticComponent<DialogPrimitive.DialogTriggerProps & react.RefAttributes<HTMLButtonElement>>;
interface DialogContentProps extends DialogPrimitive.DialogContentProps {
    variant?: 'default' | 'alert';
    hideCloseButton?: boolean;
    className?: string;
    children?: React.ReactNode;
}
declare const DialogContent: react.ForwardRefExoticComponent<DialogContentProps & react.RefAttributes<HTMLDivElement>>;
declare const DialogHeader: ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => react_jsx_runtime.JSX.Element;
declare const DialogTitle: react.ForwardRefExoticComponent<Omit<DialogPrimitive.DialogTitleProps & react.RefAttributes<HTMLHeadingElement>, "ref"> & react.RefAttributes<HTMLHeadingElement>>;
declare const DialogDescription: react.ForwardRefExoticComponent<Omit<DialogPrimitive.DialogDescriptionProps & react.RefAttributes<HTMLParagraphElement>, "ref"> & react.RefAttributes<HTMLParagraphElement>>;
declare const DialogFooter: ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => react_jsx_runtime.JSX.Element;

declare function cn(...inputs: ClassValue[]): string;

export { Button, type ButtonProps, Dialog, DialogClose, DialogContent, type DialogContentProps, DialogDescription, DialogFooter, DialogHeader, type DialogProps, DialogTitle, DialogTrigger, Icon, type IconName, VisuallyHidden, cn, iconMap };
