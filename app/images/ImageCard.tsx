"use client";

import { useState } from "react";
import type { ImageRow } from "@/lib/supabase/types";
import { formatRelativeTime } from "@/lib/utils";

type Props = {
  image: ImageRow;
};

/**
 * Image card component
 *
 * Displays image thumbnail with status badge and item recognition indicator.
 * Designed to be reusable for ThiingsGrid and fashion scan features.
 * Styled to match ThiingsGrid design tokens.
 */
export function ImageCard({ image }: Props) {
  const [imageError, setImageError] = useState(false);

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    extracted: "bg-green-100 text-green-800",
    skipped: "bg-gray-100 text-gray-800",
    extracted_metadata: "bg-blue-100 text-blue-800",
  };

  const statusLabels = {
    pending: "Pending",
    extracted: "Extracted",
    skipped: "Skipped",
    extracted_metadata: "Metadata",
  };

  return (
    <article className="border border-border rounded-xl overflow-hidden relative shadow-md hover:shadow-lg transition-shadow">
      {/* Image thumbnail */}
      <div className="aspect-square bg-muted relative">
        {image.image_url && !imageError ? (
          <img
            src={image.image_url}
            alt={`Image ${image.id}`}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground bg-muted">
            <div className="text-2xl mb-1">📷</div>
            <div className="text-xs">No image</div>
          </div>
        )}
      </div>

      {/* Status badge (bottom right) */}
      <div className="absolute bottom-2 right-2">
        <span
          className={`px-2 py-1 text-xs font-medium rounded ${
            statusColors[image.status] || statusColors.pending
          }`}
        >
          {statusLabels[image.status] || image.status}
        </span>
      </div>

      {/* Item recognition indicator */}
      {image.with_items && (
        <div className="absolute top-2 left-2">
          <span className="px-2 py-1 text-xs font-medium rounded bg-blue-100 text-blue-800">
            Items
          </span>
        </div>
      )}

      {/* Card footer with metadata */}
      <div className="p-2 bg-card border-t border-border">
        <div className="flex items-center justify-between">
          <div className="text-xs text-muted-foreground">
            {formatRelativeTime(image.created_at)}
          </div>
          {process.env.NODE_ENV === "development" && (
            <div className="text-xs text-muted-foreground font-mono">
              #{image.id.slice(0, 8)}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
