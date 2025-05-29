'use client';

import { Heart } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { cn } from '@/lib/utils/style';
import { AddItemModal } from '@/components/ui/modal/add-item-modal';
import { useProtectedAction } from '@/lib/hooks/auth/use-protected-action';
import { useLocaleContext } from '@/lib/contexts/locale-context';
import { ShareButtons } from '@/components/ui/share-buttons';
import { LinkButton } from '@/app/details-update/modal/link-button';

interface ItemActionsProps {
  likeCount: number;
  isLiked: boolean;
  isLoading: boolean;
  onLike: (userId: string) => Promise<void>;
  layoutType: 'masonry' | 'list';
}

export function ItemActions({
  likeCount,
  isLiked,
  isLoading,
  onLike,
  layoutType,
}: ItemActionsProps) {
  const { t } = useLocaleContext();
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
  const { withAuth } = useProtectedAction();
  const params = useParams();
  const imageId = params.imageId as string;

  // 직접 Cloudflare R2 이미지 URL 생성 (OG 이미지용)
  const directImageUrl = `https://pub-65bb4012fb354951a2c6139a4b49b717.r2.dev/images/${imageId}.webp`;

  const handleLike = withAuth(async (userId) => {
    if (isLoading) return;
    await onLike(userId);
  });

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={handleLike}
              disabled={isLoading}
              className={cn(
                'text-neutral-400 hover:text-white/80 transition-colors',
                isLiked && 'text-red-500 hover:text-red-400',
                isLoading && 'opacity-50 cursor-not-allowed'
              )}
            >
              <Heart
                className="w-4 h-4"
                fill={isLiked ? 'currentColor' : 'none'}
              />
            </button>
            <span className="text-xs text-neutral-400">{likeCount}</span>
          </div>

          <ShareButtons
            title="이미지 공유하기"
            description="이 스타일을 친구들과 공유해보세요!"
            className="text-neutral-400 hover:text-white/80 transition-colors"
            buttonVariant="ghost"
            thumbnailUrl={directImageUrl}
          />
        </div>
        {layoutType === 'masonry' ? (
          <button
            onClick={() => setIsAddItemModalOpen(true)}
            className="px-4 py-2 rounded text-xs font-medium bg-neutral-800 text-white/80 hover:bg-neutral-700 transition-colors"
          >
            {t.common.actions.addItem}
          </button>
        ) : (
          <LinkButton imageId={imageId} />
        )}
      </div>

      {isAddItemModalOpen && (
        <AddItemModal
          isOpen={isAddItemModalOpen}
          onClose={() => setIsAddItemModalOpen(false)}
          imageId={imageId}
          requestUrl={`user/${sessionStorage.getItem(
            'USER_DOC_ID'
          )}/image/${imageId}/request/add`}
        />
      )}
    </>
  );
}
