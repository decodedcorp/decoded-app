import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { forwardRef } from 'react';
import { X } from 'lucide-react';

/**
 * Tag Variants
 *
 * Interactive tag component for category filtering and selection.
 * Supports active states, removable tags, and different sizes.
 *
 * @see specs/TAG-01 through TAG-06
 * @see specs/ACT-01 through ACT-03
 */
export const tagVariants = cva(
  'inline-flex items-center justify-center rounded-full text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer select-none',
  {
    variants: {
      variant: {
        default: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        active: 'bg-primary text-primary-foreground',
        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
      },
      size: {
        sm: 'h-7 px-2.5 text-xs',
        default: 'h-8 px-3 text-sm',
        lg: 'h-9 px-4 text-sm',
      },
      removable: {
        true: 'pr-1.5',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      removable: false,
    },
  }
);

export interface TagProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof tagVariants> {
  isActive?: boolean;
  onRemove?: () => void;
}

/**
 * Tag Component
 *
 * Interactive tag for category filtering and selection.
 * Supports active states and removable functionality.
 *
 * @example
 * // Simple tag
 * <Tag>All</Tag>
 *
 * // Active tag (selected state)
 * <Tag isActive>Clothing</Tag>
 *
 * // Removable tag
 * <Tag onRemove={() => handleRemove()}>Fashion</Tag>
 *
 * // Custom size and variant
 * <Tag size="sm" variant="outline">Latest</Tag>
 */
export const Tag = forwardRef<HTMLSpanElement, TagProps>(
  ({ className, variant, size, removable, isActive, onRemove, children, onClick, onKeyDown, ...props }, ref) => {
    // Use active variant when isActive is true
    const activeVariant = isActive ? 'active' : variant;

    // Mark as removable if onRemove is provided
    const isRemovable = !!onRemove;

    const handleKeyDown = (e: React.KeyboardEvent<HTMLSpanElement>) => {
      // Support keyboard interaction for accessibility
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onClick?.(e as any);
      }
      onKeyDown?.(e);
    };

    return (
      <span
        ref={ref}
        role="button"
        tabIndex={0}
        className={cn(tagVariants({ variant: activeVariant, size, removable: isRemovable }), className)}
        onClick={onClick}
        onKeyDown={handleKeyDown}
        {...props}
      >
        {children}
        {isRemovable && (
          <button
            type="button"
            className="ml-1.5 inline-flex h-3.5 w-3.5 items-center justify-center rounded-full hover:bg-white/20 transition-colors"
            onClick={(e) => {
              e.stopPropagation(); // Prevent tag click when removing
              onRemove?.();
            }}
            aria-label="Remove tag"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </span>
    );
  }
);

Tag.displayName = 'Tag';

/**
 * TagGroup Props
 *
 * Generic props for TagGroup component with type-safe value handling.
 */
export interface TagGroupProps<T extends string = string> {
  items: { value: T; label: string }[];
  value: T | T[];
  onChange: (value: T | T[]) => void;
  mode?: 'single' | 'multi';
  className?: string;
  tagSize?: 'sm' | 'default' | 'lg';
  tagVariant?: 'default' | 'outline';
}

/**
 * TagGroup Component
 *
 * Manages selection state for a group of tags.
 * Supports single-select (radio-like) and multi-select (checkbox-like) modes.
 *
 * @example
 * // Single select (category filter)
 * <TagGroup
 *   items={[
 *     { value: 'all', label: 'All' },
 *     { value: 'latest', label: 'Latest' },
 *     { value: 'clothing', label: 'Clothing' },
 *   ]}
 *   value={selectedCategory}
 *   onChange={setSelectedCategory}
 *   mode="single"
 * />
 *
 * // Multi select (tag selection)
 * <TagGroup
 *   items={tags}
 *   value={selectedTags}
 *   onChange={setSelectedTags}
 *   mode="multi"
 * />
 */
export function TagGroup<T extends string = string>({
  items,
  value,
  onChange,
  mode = 'single',
  className,
  tagSize = 'default',
  tagVariant = 'default',
}: TagGroupProps<T>) {
  const handleTagClick = (tagValue: T) => {
    if (mode === 'single') {
      // Single select: set value to clicked tag
      onChange(tagValue);
    } else {
      // Multi select: toggle tag in/out of array
      const currentValues = Array.isArray(value) ? value : [];
      const isSelected = currentValues.includes(tagValue);

      if (isSelected) {
        // Remove tag from selection
        onChange(currentValues.filter((v) => v !== tagValue));
      } else {
        // Add tag to selection
        onChange([...currentValues, tagValue]);
      }
    }
  };

  const isTagActive = (tagValue: T): boolean => {
    if (mode === 'single') {
      return value === tagValue;
    } else {
      return Array.isArray(value) && value.includes(tagValue);
    }
  };

  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)}>
      {items.map((item) => (
        <Tag
          key={item.value}
          variant={tagVariant}
          size={tagSize}
          isActive={isTagActive(item.value)}
          onClick={() => handleTagClick(item.value)}
        >
          {item.label}
        </Tag>
      ))}
    </div>
  );
}
