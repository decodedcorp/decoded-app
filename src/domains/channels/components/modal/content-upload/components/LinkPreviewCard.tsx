import React from 'react';
import { LinkPreview } from '@/lib/services/mockLinkPreview';

interface LinkPreviewCardProps {
  preview: LinkPreview;
  isLoading: boolean;
  error: string | null;
}

export function LinkPreviewCard({ preview, isLoading, error }: LinkPreviewCardProps) {
  if (isLoading) {
    return (
      <div className="w-full max-w-md bg-zinc-800 rounded-xl border border-zinc-700 p-4">
        <div className="animate-pulse">
          <div className="h-4 bg-zinc-700 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-zinc-700 rounded w-1/2 mb-3"></div>
          <div className="h-20 bg-zinc-700 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-md bg-red-500/10 border border-red-500/20 rounded-xl p-4">
        <p className="text-sm text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md bg-zinc-800 rounded-xl border border-zinc-700 overflow-hidden">
      {preview.image && (
        <img
          src={preview.image}
          alt={preview.title}
          className="w-full h-32 object-cover"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
      )}
      <div className="p-4">
        <div className="flex items-start gap-3">
          {preview.favicon && (
            <img
              src={preview.favicon}
              alt={`${preview.domain} favicon`}
              className="w-4 h-4 rounded mt-1 flex-shrink-0"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          )}
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-white line-clamp-2 mb-1">{preview.title}</h3>
            <p className="text-xs text-zinc-400 line-clamp-2 mb-2">{preview.description}</p>
            <p className="text-xs text-zinc-500 truncate">{preview.domain}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
