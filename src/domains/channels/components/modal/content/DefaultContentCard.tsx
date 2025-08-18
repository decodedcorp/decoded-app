import React from 'react';
import { ContentItem } from '@/lib/types/content';
import { ProxiedImage } from '@/components/ProxiedImage';

interface DefaultContentCardProps {
  content: ContentItem;
  className?: string;
}

export function DefaultContentCard({ content, className = '' }: DefaultContentCardProps) {
  // 실제 데이터를 기반으로 올바른 콘텐츠 타입을 추론
  const getSmartContentType = (content: ContentItem): string => {
    // 링크 관련 데이터가 있으면 Link (linkUrl이나 linkPreview가 있는 경우)
    if (content.linkUrl || content.linkPreview) {
      return 'link';
    }
    
    // 비디오 URL이 있으면 Video  
    if (content.videoUrl) {
      return 'video';
    }
    
    // 이미지 URL만 있고 링크 정보가 없으면 Image
    if (content.imageUrl && !content.linkUrl && !content.linkPreview) {
      return 'image';
    }
    
    // 텍스트 설명만 있고 다른 미디어가 없으면 Text
    if (content.description && !content.imageUrl && !content.linkUrl && !content.videoUrl) {
      return 'text';
    }
    
    // 기본적으로 백엔드 타입 사용 (하지만 위의 로직으로 대부분 커버됨)
    return content.type || 'text';
  };

  const smartType = getSmartContentType(content);

  const getContentTypeInfo = () => {
    switch (smartType) {
      case 'image':
        return {
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          ),
          label: 'Image',
          color: 'text-blue-400'
        };
      case 'video':
        return {
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          ),
          label: 'Video',
          color: 'text-purple-400'
        };
      case 'link':
        return {
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.102m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          ),
          label: 'Link',
          color: 'text-green-400'
        };
      case 'text':
        return {
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          ),
          label: 'Text',
          color: 'text-yellow-400'
        };
      default:
        return {
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          ),
          label: 'Content',
          color: 'text-gray-400'
        };
    }
  };

  const typeInfo = getContentTypeInfo();
  const displayUrl = content.linkUrl || content.imageUrl || content.videoUrl;
  
  const hostname = React.useMemo(() => {
    if (!displayUrl) return '';
    try {
      return new URL(displayUrl).hostname;
    } catch {
      return displayUrl;
    }
  }, [displayUrl]);

  const handleClick = () => {
    if (displayUrl) {
      window.open(displayUrl, '_blank');
    }
  };

  const hasValidImage = content.imageUrl || content.linkPreview?.imageUrl;

  return (
    <div className={`group cursor-pointer ${className}`} onClick={handleClick}>
      <div className="bg-zinc-800/30 rounded-2xl border border-zinc-700/30 overflow-hidden shadow-lg group-hover:shadow-xl group-hover:border-[#eafd66]/30 transition-all duration-300">
        
        {/* Image Section - 이미지가 있는 경우만 표시 */}
        {hasValidImage && (
          <div className="relative aspect-[16/10] overflow-hidden">
            <ProxiedImage
              src={content.imageUrl || content.linkPreview?.imageUrl || ''}
              downloadedSrc={content.linkPreview?.downloadedImageUrl}
              alt={content.title || 'Content preview'}
              width={800}
              height={500}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            
            {/* Pending Badge Overlay on Image */}
            {content.status === 'pending' && (
              <div className="absolute top-4 left-4">
                <div className="bg-yellow-500/90 text-white px-3 py-1.5 rounded-full font-medium flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm">Pending</span>
                </div>
              </div>
            )}
            
            {/* External Link Icon */}
            {displayUrl && (
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="p-2 bg-[#eafd66]/90 rounded-lg">
                  <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Content Section */}
        <div className="p-6">
          {/* Content Type Badge */}
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className={`${typeInfo.color}`}>
                {typeInfo.icon}
              </span>
              <span className={`text-sm font-medium ${typeInfo.color}`}>
                {typeInfo.label}
              </span>
            </div>
            
            {/* Pending Badge for no-image case */}
            {!hasValidImage && content.status === 'pending' && (
              <div className="bg-yellow-500/90 text-white px-3 py-1.5 rounded-full font-medium flex items-center space-x-2">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span className="text-xs">Pending</span>
              </div>
            )}
          </div>
          
          {/* Title */}
          <h3 className="text-xl font-bold text-white mb-3 leading-tight group-hover:text-[#eafd66] transition-colors duration-300 line-clamp-2 overflow-hidden">
            {content.title || content.linkPreview?.title || 'Content'}
          </h3>
          
          {/* Description */}
          {(content.description || content.linkPreview?.description) && (
            <p className="text-gray-400 leading-relaxed line-clamp-3 overflow-hidden group-hover:text-gray-300 transition-colors duration-300 mb-4">
              {content.description || content.linkPreview?.description}
            </p>
          )}
          
          {/* Site Name */}
          {content.linkPreview?.siteName && (
            <div className="mb-4">
              <span className="px-3 py-1.5 bg-[#eafd66]/20 text-[#eafd66] text-sm font-medium rounded-lg">
                {content.linkPreview.siteName}
              </span>
            </div>
          )}
          
          {/* Category */}
          {content.category && (
            <div className="mb-4">
              <span className="px-3 py-1.5 bg-zinc-700/50 text-zinc-300 text-sm font-medium rounded-lg">
                {content.category}
              </span>
            </div>
          )}
          
          {/* URL Display */}
          {displayUrl && (
            <div className="pt-4 border-t border-zinc-700/30">
              <div className="flex items-center justify-between">
                <p className="text-zinc-500 text-sm font-mono truncate group-hover:text-[#eafd66] transition-colors duration-300 flex-1">
                  {hostname || displayUrl}
                </p>
                <div className="ml-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <svg className="w-4 h-4 text-[#eafd66]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}