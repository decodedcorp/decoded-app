import { ImagePlaceholder } from '@/components/ui/icons/image-placeholder';

export function BoxPlaceholder() {
  return (
    <div className="absolute inset-0 flex items-center justify-center text-white/20">
      <ImagePlaceholder className="w-12 h-12" />
    </div>
  );
} 