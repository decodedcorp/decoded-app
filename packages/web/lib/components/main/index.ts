// Layout components
export { MainFooter } from "./MainFooter";
export { HomeAnimatedContent } from "./HomeAnimatedContent";

// Section components
export { SearchSection } from "./SearchSection";
export { HeroSection } from "./HeroSection";
export type { HeroData } from "./HeroSection";
export { DecodedPickSection } from "./DecodedPickSection";
export { ArtistSpotlightSection } from "./ArtistSpotlightSection";
export { WhatsNewSection } from "./WhatsNewSection";
export {
  DiscoverItemsSection,
  DiscoverProductsSection,
} from "./DiscoverSection";
export { BestItemSection, WeeklyBestSection } from "./BestSection";
export { TrendingNowSection } from "./TrendingSection";
export { TodayDecodedSection } from "./TodayDecodedSection";

// Shared components
export { SectionHeader } from "./SectionHeader";
export { StyleCard } from "./StyleCard";
export type { StyleCardData } from "./StyleCard";
export { ItemCard } from "./ItemCard";
export type { ItemCardData } from "./ItemCard";

// Legacy exports (for backward compatibility)
export { HeroCarousel } from "./HeroCarousel";
export { CelebritySection } from "./CelebritySection";
export { CelebrityGrid, defaultCelebrityItems } from "./CelebrityGrid";
export type { CelebrityItem } from "./CelebrityGrid";
export { CTASection } from "./CTASection";
