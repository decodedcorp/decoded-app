import type React from "react";
import { MagazineHero } from "./MagazineHero";
import { MagazineText } from "./MagazineText";
import { MagazineItemCard } from "./MagazineItemCard";
import { MagazineDivider } from "./MagazineDivider";
import { MagazineQuote } from "./MagazineQuote";
import { MagazineGallery } from "./MagazineGallery";

/**
 * Maps layout component type strings to React components.
 * Used by MagazineRenderer to dynamically render layout_json components.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const componentRegistry: Record<string, React.ComponentType<any>> = {
  "hero-image": MagazineHero,
  "text-block": MagazineText,
  "item-card": MagazineItemCard,
  divider: MagazineDivider,
  quote: MagazineQuote,
  "grid-gallery": MagazineGallery,
};

/**
 * Get a component by its layout type string.
 * Returns null and logs a warning for unrecognized types.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getComponent(type: string): React.ComponentType<any> | null {
  const component = componentRegistry[type];
  if (!component) {
    console.warn(`[MagazineRenderer] Unknown component type: "${type}". Skipping.`);
    return null;
  }
  return component;
}
