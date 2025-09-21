# LoadingOverlay Component

A reusable loading overlay component for page transitions and full-screen loading states.

## Features

- **Customizable appearance**: Spinner size, colors, opacity, z-index
- **Brand consistency**: Optional brand color (#eafd66) support
- **Accessibility**: Proper ARIA attributes and semantic HTML
- **Flexible messaging**: Customizable loading messages
- **Easy integration**: Simple props interface

## Usage

### Basic Usage

```tsx
import { LoadingOverlay } from '@/shared/components/LoadingOverlay';

function MyComponent() {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div>
      {/* Your content */}

      <LoadingOverlay isLoading={isLoading} message="Loading content..." />
    </div>
  );
}
```

### Advanced Usage

```tsx
<LoadingOverlay
  isLoading={isLoading}
  message="Authenticating..."
  opacity={0.9}
  zIndex={999}
  spinnerSize="lg"
  useBrandColor={true}
  className="min-h-screen"
/>
```

## Props

| Prop            | Type                   | Default        | Description                                       |
| --------------- | ---------------------- | -------------- | ------------------------------------------------- |
| `isLoading`     | `boolean`              | -              | **Required.** Whether to show the loading overlay |
| `message`       | `string`               | `"Loading..."` | Text to display next to the spinner               |
| `opacity`       | `number`               | `0.5`          | Background overlay opacity (0-1)                  |
| `zIndex`        | `number`               | `50`           | CSS z-index value                                 |
| `className`     | `string`               | `""`           | Additional CSS classes                            |
| `spinnerSize`   | `'sm' \| 'md' \| 'lg'` | `'md'`         | Size of the loading spinner                       |
| `useBrandColor` | `boolean`              | `true`         | Whether to use brand color (#eafd66)              |

## Use Cases

### Page Transitions

```tsx
// Auth callback page
<Suspense
  fallback={
    <LoadingOverlay
      isLoading={true}
      message="Authenticating..."
      opacity={0.9}
      useBrandColor={true}
    />
  }
>
  <AuthCallbackContent />
</Suspense>
```

### Content Loading

```tsx
// Content modal overlay
if (isLoading || !content) {
  return (
    <LoadingOverlay
      isLoading={true}
      message="Loading content..."
      opacity={0.8}
      zIndex={999}
      useBrandColor={true}
    />
  );
}
```

### Feed Content Loading

```tsx
// Main feed content loading
<LoadingOverlay
  isLoading={isContentLoading && !!selectedContentId}
  message={t.feed.loadingContent()}
  spinnerSize="md"
  useBrandColor={true}
/>
```

## Design Guidelines

- **Brand Color**: Use `useBrandColor={true}` for primary loading states
- **Opacity**: Use higher opacity (0.8-0.9) for critical loading states
- **Z-Index**: Use higher z-index (999+) for modal overlays
- **Messages**: Keep messages concise and user-friendly
- **Accessibility**: Component includes proper ARIA attributes

## Migration from Inline Loading

### Before

```tsx
{
  isLoading && (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-zinc-900 rounded-lg p-6 flex items-center gap-3">
        <div className="w-6 h-6 border-2 border-[#eafd66] border-t-transparent rounded-full animate-spin"></div>
        <span className="text-white">{message}</span>
      </div>
    </div>
  );
}
```

### After

```tsx
<LoadingOverlay isLoading={isLoading} message={message} useBrandColor={true} />
```

## Accessibility

The component includes:

- Proper semantic HTML structure
- ARIA attributes for screen readers
- Keyboard navigation support
- Color contrast compliance
