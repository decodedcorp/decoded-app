import React from 'react';

import { ProxiedImage } from '@/components/ProxiedImage';

interface LinkPreviewCardProps {
  title?: string;
  description?: string;
  imageUrl?: string;
  downloadedImageUrl?: string;
  siteName?: string;
  url: string;
  className?: string;
}

export function LinkPreviewCard({
  title,
  description,
  imageUrl,
  downloadedImageUrl,
  siteName,
  url,
  className = '',
}: LinkPreviewCardProps) {
  const hostname = React.useMemo(() => {
    try {
      return new URL(url).hostname;
    } catch {
      return url;
    }
  }, [url]);

  const handleClick = () => {
    window.open(url, '_blank');
  };

  return (
    <div className={`group cursor-pointer h-full min-h-full ${className}`} onClick={handleClick}>
      <div className="bg-zinc-800/30 rounded-2xl border border-zinc-700/30 overflow-hidden shadow-lg group-hover:shadow-xl group-hover:border-[#eafd66]/30 transition-all duration-300 h-full flex flex-col">
        {/* Image Section */}
        {imageUrl && (
          <div className="relative flex-1 overflow-hidden">
            <ProxiedImage
              src={imageUrl}
              downloadedSrc={downloadedImageUrl}
              alt={title || 'Link preview'}
              width={800}
              height={500}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            {/* Site Badge Overlay */}
            {siteName && (
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1.5 bg-black/60 backdrop-blur-sm text-white text-sm font-medium rounded-lg">
                  {siteName}
                </span>
              </div>
            )}

            {/* External Link Icon */}
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="p-2 bg-[#eafd66]/90 rounded-lg">
                <svg
                  className="w-4 h-4 text-black"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </div>
            </div>
          </div>
        )}

        {/* Content Section */}
        <div className="p-6 flex-shrink-0">
          {/* Site Badge for no-image case */}
          {!imageUrl && siteName && (
            <div className="mb-3">
              <span className="px-3 py-1.5 bg-[#eafd66]/20 text-[#eafd66] text-sm font-medium rounded-lg">
                {siteName}
              </span>
            </div>
          )}

          {/* Title */}
          {title && (
            <h3 className="text-xl font-bold text-white mb-3 leading-tight group-hover:text-[#eafd66] transition-colors duration-300 line-clamp-2 overflow-hidden">
              {title}
            </h3>
          )}

          {/* Description */}
          {description && (
            <p className="text-gray-400 leading-relaxed line-clamp-3 overflow-hidden group-hover:text-gray-300 transition-colors duration-300 mb-4">
              {description}
            </p>
          )}

          {/* URL Display */}
          <div className="pt-4 border-t border-zinc-700/30">
            <div className="flex items-center justify-between">
              <p className="text-zinc-500 text-sm font-mono truncate group-hover:text-[#eafd66] transition-colors duration-300 flex-1">
                {hostname}
              </p>
              <div className="ml-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <svg
                  className="w-4 h-4 text-[#eafd66]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
