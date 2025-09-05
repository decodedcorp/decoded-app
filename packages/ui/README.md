# @decoded/ui

Design system components for Decoded applications, built with React, TypeScript, Tailwind CSS, and Radix UI.

## Features

- 🎨 **Design Tokens**: Comprehensive design token system with Tailwind preset
- ♿ **Accessible**: WCAG 2.1 AA compliant with full keyboard navigation
- 🌙 **Dark Mode**: Built-in dark/light theme support with CSS variables
- 📱 **Responsive**: Mobile-first responsive design patterns
- 🎯 **TypeScript**: Full TypeScript support with strict type checking
- 📦 **Tree-shakeable**: Import only the components you need
- 🧩 **Composable**: Built on Radix UI primitives for maximum flexibility

## Installation

```bash
npm install @decoded/ui
```

### Peer Dependencies

```bash
npm install react react-dom tailwindcss
```

## Setup

### 1. Configure Tailwind CSS

Add the preset to your `tailwind.config.js`:

```js
module.exports = {
  presets: [
    require('@decoded/ui/tailwind-preset')
  ],
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './node_modules/@decoded/ui/dist/**/*.{js,mjs}'
  ],
  // ... your other config
}
```

### 2. Add CSS Variables (Optional - for dark mode)

Add to your global CSS file:

```css
@import 'tailwindcss/base';
@import 'tailwindcss/components'; 
@import 'tailwindcss/utilities';

/* Dark mode support */
:root {
  --ui-bg: #ffffff;
  --ui-fg: #171717; 
  --ui-muted: #f2f2f2;
  --ui-muted-fg: #616161;
  --ui-border: #e0e0e0;
}

[data-theme="dark"] {
  --ui-bg: #000000;
  --ui-fg: #ffffff;
  --ui-muted: #171717; 
  --ui-muted-fg: #9e9e9e;
  --ui-border: #3b3b3b;
}
```

## Usage

### Basic Example

```tsx
import { Button, Icon } from '@decoded/ui';

function App() {
  return (
    <Button 
      variant="primary" 
      icon="plus" 
      onClick={() => console.log('clicked')}
    >
      Add Item
    </Button>
  );
}
```

### Dialog Example

```tsx
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  Button
} from '@decoded/ui';

function DialogExample() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Open Dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Action</DialogTitle>
          <DialogDescription>
            Are you sure you want to proceed with this action?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline">Cancel</Button>
          <Button variant="primary">Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
```

### Using Design Tokens

```tsx
import { tokens } from '@decoded/ui/tokens';

// Use in your own components
const customStyles = {
  color: tokens.colors.primary,
  borderRadius: tokens.borderRadius.lg,
  spacing: tokens.spacing[4]
};
```

## Components

### Foundations
- **Icon** - Line icons from Lucide React with tree-shaking support
- **VisuallyHidden** - Screen reader accessible hidden content

### Inputs
- **Button** - Primary call-to-action button with variants and loading states

### Overlay  
- **Dialog** - Modal dialogs with focus management and accessibility

## Accessibility

All components follow WCAG 2.1 AA guidelines:

- ✅ Keyboard navigation support
- ✅ Screen reader compatibility  
- ✅ Focus management
- ✅ Color contrast compliance (4.5:1 minimum)
- ✅ ARIA attributes and roles

### Keyboard Support

| Component | Keys | Action |
|-----------|------|--------|
| Button | `Enter`, `Space` | Activate button |
| Dialog | `Escape` | Close dialog |
| Dialog | `Tab` | Navigate within dialog (focus trap) |

## Development

```bash
# Install dependencies
npm install

# Build package
npm run build

# Run tests  
npm run test

# Type check
npm run typecheck
```

## Design System

This package implements the Decoded design system with:

- **Colors**: Grayscale palette + brand primary (#EAFD66)
- **Typography**: System font stack with consistent scale
- **Spacing**: 0.25rem base unit with semantic naming
- **Shadows**: 4-tier shadow system for elevation
- **Border Radius**: Consistent radius scale from 2px to 16px

## License

MIT License