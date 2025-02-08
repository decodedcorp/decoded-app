"use client";

import { Heart } from "lucide-react";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { cn } from "@/lib/utils/style";
import { AddItemModal } from "@/components/ui/modal/add-item-modal";
import { useProtectedAction } from "@/lib/hooks/auth/use-protected-action"; 
import { useLocaleContext } from "@/lib/contexts/locale-context";

interface ItemActionsProps {
  likeCount: number;
  isLiked: boolean;
  isLoading: boolean;
  onLike: (userId: string) => Promise<void>;
}

export function ItemActions({
  likeCount,
  isLiked,
  isLoading,
  onLike,
}: ItemActionsProps) {
  const { t } = useLocaleContext();
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
  const { withAuth } = useProtectedAction();
  const params = useParams();
  const imageId = params.imageId as string;

  const handleLike = withAuth(async (userId) => {
    if (isLoading) return;
    await onLike(userId);
  });

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={handleLike}
            disabled={isLoading}
            className={cn(
              "text-neutral-400 hover:text-white transition-colors",
              isLiked && "text-red-500 hover:text-red-400",
              isLoading && "opacity-50 cursor-not-allowed"
            )}
          >
            <Heart
              className="w-4 h-4"
              fill={isLiked ? "currentColor" : "none"}
            />
          </button>
          <span className="text-xs text-neutral-400">{likeCount}</span>
        </div>
        <button
          onClick={() => setIsAddItemModalOpen(true)}
          className="px-4 py-2 rounded text-xs font-medium bg-neutral-800 text-white hover:bg-neutral-700 transition-colors"
        >
          {t.common.actions.addItem}
        </button>
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
