import React from 'react';

import { ProxiedImage } from '@/components/ProxiedImage';

interface MobileLinkPreviewCardProps {
  title?: string;
  description?: string;
  imageUrl?: string;
  downloadedImageUrl?: string;
  siteName?: string;
  url: string;
  className?: string;
}

// 모바일 전용 내장 카드 형태의 LinkPreview - 이미지 참고 디자인
export function MobileLinkPreviewCard({
  title,
  description,
  imageUrl,
  downloadedImageUrl,
  siteName,
  url,
  className = '',
}: MobileLinkPreviewCardProps) {
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
    <div className={`space-y-3 ${className}`}>
      {/* Image Card */}
      {imageUrl && (
        <div className="group cursor-pointer" onClick={handleClick}>
          <div className="bg-zinc-900/60 rounded-xl border border-zinc-700/40 overflow-hidden shadow-lg group-hover:shadow-xl group-hover:border-[#eafd66]/20 transition-all duration-300">
            <ProxiedImage
              src={imageUrl}
              downloadedSrc={downloadedImageUrl}
              alt={title || 'Link preview'}
              width={400}
              height={200}
              className="w-full h-40 object-cover"
            />
          </div>
        </div>
      )}

      {/* Text Card */}
      <div className="group cursor-pointer" onClick={handleClick}>
        <div className="bg-zinc-900/60 rounded-xl border border-zinc-700/40 p-4 shadow-lg group-hover:shadow-xl group-hover:border-[#eafd66]/20 transition-all duration-300">
          {/* Title */}
          {title && (
            <h4 className="text-sm font-medium text-white mb-2 line-clamp-2 group-hover:line-clamp-none transition-all duration-300 leading-tight">
              {title}
            </h4>
          )}

          {/* Description */}
          {description && (
            <p className="text-xs text-gray-300 line-clamp-3 group-hover:line-clamp-none transition-all duration-300 leading-relaxed mb-3">
              {description}
            </p>
          )}

          {/* URL */}
          <div className="pt-2 border-t border-zinc-700/30">
            <p className="text-xs text-zinc-400 font-mono truncate">{hostname}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
