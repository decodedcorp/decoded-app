import { forwardRef, type SVGAttributes } from 'react';
import { cn } from '../../lib/utils';
import { iconMap, type IconName } from './iconMap';

export interface IconProps extends Omit<SVGAttributes<SVGElement>, 'name'> {
  name: IconName;
  size?: number | string;
}

export const Icon = forwardRef<SVGSVGElement, IconProps>(
  ({ name, size = 16, className, ...props }, ref) => {
    const IconComponent = iconMap[name];
    
    if (!IconComponent) {
      console.warn(`Icon "${name}" not found in iconMap`);
      return null;
    }

    return (
      <IconComponent
        ref={ref}
        width={size}
        height={size}
        className={cn('inline-block', className)}
        aria-hidden="true"
        {...props}
      />
    );
  }
);

Icon.displayName = 'Icon';