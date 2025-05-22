"use client";

import { useState } from "react";
import { ItemActionsWrapper } from "../client/item-actions-wrapper";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils/style";
import { AddItemModal } from "@/components/ui/modal/add-item-modal";
import { ShareButtons } from "@/components/ui/share-buttons";

interface MobileActionsProps {
  initialLikeCount: number;
  imageId: string;
  isFixed?: boolean;
  layoutType: string;
}

export function MobileActions({
  initialLikeCount,
  imageId,
  isFixed = false,
  layoutType,
}: MobileActionsProps) {
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);

  // 직접 Cloudflare R2 이미지 URL 생성 (OG 이미지용)
  const directImageUrl = `https://pub-65bb4012fb354951a2c6139a4b49b717.r2.dev/images/${imageId}.webp`;

  return (
    <>
      <div
        className={cn(
          "bg-[#1A1A1A] rounded-lg",
          isFixed &&
            "fixed bottom-0 left-0 right-0 z-20 border-t border-white/10"
        )}
      >
        <div className="px-4 py-3 flex items-center justify-between">
          <ItemActionsWrapper
            initialLikeCount={initialLikeCount}
            imageId={imageId}
            layoutType={layoutType}
            render={({ likeCount, isLiked, isLoading, onLike }) => (
              <>
                <button
                  onClick={onLike}
                  disabled={isLoading}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-full",
                    "bg-white/5 hover:bg-white/10 transition-colors",
                    isLoading && "opacity-50 cursor-not-allowed"
                  )}
                >
                  <Heart
                    className={cn(
                      "w-5 h-5",
                      isLiked ? "fill-red-500 text-red-500" : "text-white/80/60"
                    )}
                  />
                  <span className="text-sm text-white/80/60">{likeCount}</span>
                </button>

                <ShareButtons
                  title="이미지 공유하기"
                  description="이 스타일을 친구들과 공유해보세요!"
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
                  buttonVariant="ghost"
                  thumbnailUrl={directImageUrl}
                />

                <button
                  onClick={() => setIsAddItemModalOpen(true)}
                  className={cn(
                    "px-6 py-2 rounded-full text-sm font-medium",
                    "bg-[#EAFD66] text-black hover:bg-[#EAFD66]/90 transition-colors"
                  )}
                >
                  아이템 추가
                </button>
              </>
            )}
          />
        </div>
        {isFixed && <div className="h-safe-bottom" />}{" "}
        {/* iOS safe area 대응 */}
      </div>

      {isAddItemModalOpen && (
        <AddItemModal
          isOpen={isAddItemModalOpen}
          onClose={() => setIsAddItemModalOpen(false)}
          imageId={imageId}
          requestUrl={`user/${sessionStorage.getItem(
            "USER_DOC_ID"
          )}/image/${imageId}/request/add`}
        />
      )}
    </>
  );
}
