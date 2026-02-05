"use client";

import { type UploadedImage } from "@/lib/stores/requestStore";
import { UPLOAD_CONFIG } from "@/lib/utils/validation";
import { ImagePreview } from "./ImagePreview";
import { DropZone } from "./DropZone";

interface ImagePreviewGridProps {
  images: UploadedImage[];
  onRemove: (id: string) => void;
  onRetry?: (id: string) => void;
  onAddMore: (files: File[]) => void;
}

export function ImagePreviewGrid({
  images,
  onRemove,
  onRetry,
  onAddMore,
}: ImagePreviewGridProps) {
  const isMaxImages = images.length >= UPLOAD_CONFIG.maxImages;
  const hasImages = images.length > 0;

  if (!hasImages) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-foreground/80">
          Selected Images ({images.length}/{UPLOAD_CONFIG.maxImages})
        </h2>
        {isMaxImages && (
          <span className="text-xs text-foreground/50">Maximum reached</span>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {images.map((image) => (
          <ImagePreview
            key={image.id}
            image={image}
            onRemove={() => onRemove(image.id)}
            onRetry={onRetry ? () => onRetry(image.id) : undefined}
          />
        ))}

        {!isMaxImages && (
          <DropZone
            onFilesSelected={onAddMore}
            compact
            className="aspect-square"
          />
        )}
      </div>
    </div>
  );
}
