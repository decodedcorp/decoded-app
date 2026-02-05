/**
 * Design System
 *
 * Barrel export for all design system modules
 */

// Tokens
export * from "./tokens";

// Typography Components
export { Heading, headingVariants, Text, textVariants } from "./typography";
export type { HeadingProps, TextProps } from "./typography";

// Input Components
export { Input, inputVariants, SearchInput } from "./input";
export type { InputProps, SearchInputProps } from "./input";

// Card Components
export {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardSkeleton,
  cardVariants,
} from "./card";
export type {
  CardProps,
  CardHeaderProps,
  CardContentProps,
  CardFooterProps,
  CardSkeletonProps,
} from "./card";

// Product Cards
export { ProductCard, ProductCardSkeleton } from "./product-card";
export type {
  ProductCardProps,
  ProductCardSkeletonProps,
} from "./product-card";

// Grid Cards
export { GridCard, GridCardSkeleton } from "./grid-card";
export type { GridCardProps, GridCardSkeletonProps } from "./grid-card";

// Feed Card (design-system base)
export {
  FeedCard as FeedCardBase,
  FeedCardSkeleton as FeedCardBaseSkeleton,
} from "./feed-card";
export type { FeedCardProps as FeedCardBaseProps } from "./feed-card";

// Profile Header Card
export {
  ProfileHeaderCard,
  ProfileHeaderCardSkeleton,
} from "./profile-header-card";
export type { ProfileHeaderCardProps } from "./profile-header-card";

// Header Components
export { DesktopHeader, desktopHeaderVariants } from "./desktop-header";
export type { DesktopHeaderProps } from "./desktop-header";

export { MobileHeader, mobileHeaderVariants } from "./mobile-header";
export type { MobileHeaderProps } from "./mobile-header";

// Footer Components
export { DesktopFooter } from "./desktop-footer";
export type { DesktopFooterProps } from "./desktop-footer";

// Tag Component
export { Tag, tagVariants } from "./tag";
export type { TagProps } from "./tag";

// ActionButton Component
export { ActionButton, actionButtonVariants } from "./action-button";
export type { ActionButtonProps } from "./action-button";

// StepIndicator Component
export { StepIndicator, stepIndicatorVariants } from "./step-indicator";
export type { StepIndicatorProps } from "./step-indicator";

// Hotspot Component
export { Hotspot, hotspotVariants } from "./hotspot";
export type { HotspotProps, HotspotPosition } from "./hotspot";

// NavItem Component
export { NavItem, navItemVariants } from "./nav-item";
export type { NavItemProps } from "./nav-item";

// NavBar Component
export { NavBar, navBarVariants } from "./nav-bar";
export type { NavBarProps } from "./nav-bar";

// SectionHeader Component
export { SectionHeader } from "./section-header";
export type { SectionHeaderProps } from "./section-header";

// Tabs Components
export { Tabs, TabItem, tabItemVariants } from "./tabs";
export type { TabsProps, TabItemProps } from "./tabs";
