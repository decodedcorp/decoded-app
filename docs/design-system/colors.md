# Color System & Design Guidelines

**Last Updated:** December 24, 2025

This document outlines the color system used in the project, including the semantic theme colors and the categorical color palette used for tags and filters.

## 1. Semantic Theme Colors (OKLCH)

Our application uses a modern **OKLCH** color system defined in `app/globals.css` and mapped in `tailwind.config.ts`. These colors automatically adapt to Light and Dark modes. We use `color-mix` to support opacity modifiers with CSS variables.

| Token | Usage | Description |
|-------|-------|-------------|
| **Background** | Page backgrounds | Clean white (Light) or dark gray (Dark). |
| **Foreground** | Default text | High contrast text color. |
| **Primary** | Main actions (Buttons) | Strong brand color. Inverted in dark mode for visibility. |
| **Secondary** | Secondary actions, inactive states | Subtle gray/slate. Used for "All" filters or neutral tags. |
| **Accent** | Highlights, hover states | Used for interactive elements' hover states. |
| **Muted** | Subtitles, disabled text | Low priority information. |
| **Border** | Dividers, inputs | Subtle borders. |
| **Destructive** | Error states, delete actions | Red/Orange warning color. |
| **Sidebar** | Sidebar specific | Specific tokens for sidebar background, foreground, accent, etc. |
| **Chart** | Data visualization | Series of colors (`chart-1` to `chart-5`) for graphs. |

### Sidebar Specific Tokens
The sidebar has its own dedicated tokens to allow for independent theming:
- `sidebar`: Background
- `sidebar-foreground`: Text
- `sidebar-primary`: Primary element in sidebar
- `sidebar-accent`: Hover/active state in sidebar
- `sidebar-border`: Sidebar border

## 2. Categorical Color Palette (Pastel/Soft)

We use a soft, pastel-based color palette for categories, tags, and filters to distinguish content types without overwhelming the UI. These are designed to be "too noticeable" but distinct.

### Principles
- **Light Mode:** Use `{color}-100` for backgrounds and `{color}-900` for text.
- **Dark Mode:** Use `{color}-900` with opacity (e.g., `/30`) for backgrounds and `{color}-100` for text to ensure readability and reduce eye strain.
- **Interaction:** Hover states should slightly darken the background (e.g., `hover:bg-{color}-200`).

### Palette Map

| Category | Tailwind Color Family | Light Mode Classes | Dark Mode Classes |
|----------|----------------------|--------------------|-------------------|
| **Neutral / All** | `secondary` | `bg-secondary text-secondary-foreground` | `dark:bg-secondary/50` |
| **Latest / New** | `amber` (Gold) | `bg-amber-100 text-amber-900` | `dark:bg-amber-900/30 dark:text-amber-100` |
| **Clothing** | `rose` (Pink) | `bg-rose-100 text-rose-900` | `dark:bg-rose-900/30 dark:text-rose-100` |
| **Accessories** | `purple` (Soft Purple) | `bg-purple-100 text-purple-900` | `dark:bg-purple-900/30 dark:text-purple-100` |
| **Shoes** | `sky` (Light Blue) | `bg-sky-100 text-sky-900` | `dark:bg-sky-900/30 dark:text-sky-100` |
| **Bags** | `stone` (Tan/Beige) | `bg-stone-100 text-stone-900` | `dark:bg-stone-900/30 dark:text-stone-100` |

### Code Example (React/Tailwind)

```tsx
// Example of applying category styles
<span className="bg-rose-100 text-rose-900 dark:bg-rose-900/30 dark:text-rose-100 px-2 py-1 rounded">
  Clothing
</span>
```

## 3. Design Guidelines

### When to use what?
- **Primary Actions:** Use the **Primary** color (e.g., "Save", "Submit", "Buy").
- **Navigation/Tabs:** Use **Secondary** or **Ghost** styles unless active.
- **Status/Categories:** Use the **Categorical Palette** above.
  - Avoid using these colors for text only; always use them as a pair (background + text) for better accessibility and visual weight.

### Accessibility
- Always ensure sufficient contrast ratio between text and background.
- In Dark Mode, avoid fully saturated backgrounds for large areas; use opacity modifiers (e.g., `/30`, `/50`) to blend with the dark background.
