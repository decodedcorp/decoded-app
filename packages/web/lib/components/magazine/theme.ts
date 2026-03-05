/**
 * Magazine Theme System
 *
 * Injects CSS custom properties for per-issue theme colors.
 * Works with Tailwind mag-* utilities defined in tailwind.config.ts.
 */

import type { ThemePalette } from "./types";

/** Default magazine theme: Deep Black + Neon Chartreuse */
export const defaultMagazineTheme: ThemePalette = {
  primary: "#050505",
  accent: "#eafd67",
  bg: "#050505",
  text: "#f5f5f5",
};

/** CSS custom property names for magazine theme */
const MAG_PROPS = ["primary", "accent", "bg", "text"] as const;

/**
 * Inject magazine theme as CSS custom properties on a container element.
 * Sets --mag-primary, --mag-accent, --mag-bg, --mag-text.
 */
export function injectMagazineTheme(
  palette: ThemePalette,
  container: HTMLElement,
): void {
  for (const prop of MAG_PROPS) {
    container.style.setProperty(`--mag-${prop}`, palette[prop]);
  }
}

/**
 * Remove magazine theme CSS custom properties from a container element.
 */
export function removeMagazineTheme(container: HTMLElement): void {
  for (const prop of MAG_PROPS) {
    container.style.removeProperty(`--mag-${prop}`);
  }
}

export type { ThemePalette } from "./types";
