/**
 * Design System
 *
 * Barrel export for all design system modules
 */

// Tokens
export * from './tokens';

// Typography Components
export { Heading, headingVariants, Text, textVariants } from './typography';
export type { HeadingProps, TextProps } from './typography';

// Input Components
export { Input, inputVariants, SearchInput } from './input';
export type { InputProps, SearchInputProps } from './input';

// Card Components
export {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardSkeleton,
  cardVariants,
} from './card';
export type {
  CardProps,
  CardHeaderProps,
  CardContentProps,
  CardFooterProps,
  CardSkeletonProps,
} from './card';

// Product Cards
export { ProductCard, ProductCardSkeleton } from './product-card';
export type { ProductCardProps, ProductCardSkeletonProps } from './product-card';

// Grid Cards
export { GridCard, GridCardSkeleton } from './grid-card';
export type { GridCardProps, GridCardSkeletonProps } from './grid-card';

// Feed Card (design-system base)
export { FeedCard as FeedCardBase, FeedCardSkeleton as FeedCardBaseSkeleton } from './feed-card';
export type { FeedCardProps as FeedCardBaseProps } from './feed-card';

// Profile Header Card
export { ProfileHeaderCard, ProfileHeaderCardSkeleton } from './profile-header-card';
export type { ProfileHeaderCardProps } from './profile-header-card';
