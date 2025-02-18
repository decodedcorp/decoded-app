"use client";

import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { useState, useEffect } from "react";
import LinkFormSection from "../../modal/link-form-section";
import { ProvideData } from "@/types/model.d";
import { useParams } from "next/navigation";
import { networkManager } from "@/lib/network/network";
import { useIsLike } from "@/app/details/utils/hooks/isLike";
import { useLocaleContext } from "@/lib/contexts/locale-context";
import { useStatusStore } from '@/components/ui/modal/status-modal/utils/store';

interface ItemActionsProps {
  itemId: string;
  likeCount: number;
}

export function ItemActions({ itemId, likeCount }: ItemActionsProps) {
  const { t } = useLocaleContext();
  const [showLinkForm, setShowLinkForm] = useState(false);
  const [provideData, setProvideData] = useState<ProvideData>({ links: [] });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const { checkInitialLikeStatus, toggleLike } = useIsLike();
  const setStatus = useStatusStore((state) => state.setStatus);

  const params = useParams();
  const imageId = params.imageId as string;

  useEffect(() => {
    const storedUserId = sessionStorage.getItem("USER_DOC_ID");
    if (!storedUserId || !itemId) return;

    let isSubscribed = true;

    setUserId(storedUserId);
    
    const checkLikeStatus = async () => {
      try {
        const likeStatus = await checkInitialLikeStatus("items", itemId, storedUserId);
        if (isSubscribed) {
          setIsLiked(likeStatus);
        }
      } catch (error) {
        console.error("Error checking like status:", error);
      }
    };
    
    checkLikeStatus();

    return () => {
      isSubscribed = false;
    };
  }, []);

  const handleLikeClick = async () => {
    if (!userId) return;

    try {
      const newLikeStatus = await toggleLike("item", itemId, userId, isLiked);
      setIsLiked(newLikeStatus);
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const handleSubmit = async () => {
    if (!userId || !provideData.links[0]) return;

    try {
      setIsSubmitting(true);
      setStatus({ type: 'loading', messageKey: 'provide' });
      
      const path = `user/${userId}/image/${imageId}/provide/item/${itemId}`;
      const result = await networkManager.request(path, "POST", {
        provider: userId,
        link: provideData.links[0]
      });
      
      if (result === undefined) {
        setStatus({
          type: 'warning',
          messageKey: 'duplicate',
          message: '이미 제공한 링크입니다.',
        });
        return;
      }

      setShowLinkForm(false);
      setProvideData({ links: [] });
      setStatus({
        type: 'success',
        messageKey: 'provide',
      });
    } catch (error: any) {
      console.error("Error submitting link:", error);
      
      if (error.message === 'Network Error') {
        setStatus({
          type: 'warning',
          messageKey: 'duplicate',
          message: '이미 제공한 링크입니다.',
        });
        return;
      }

      setStatus({
        type: 'error',
        messageKey: 'provide',
        message: error.message || '링크 제공 중 오류가 발생했습니다.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          className="px-5 py-2 rounded-full border-neutral-600 text-xs"
          onClick={() => setShowLinkForm(true)}
          disabled={isSubmitting}
        >
          {t.common.actions.addLink}
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={handleLikeClick}
          className={
            isLiked
              ? "text-red-500 hover:text-red-600"
              : "text-gray-500 hover:text-gray-600"
          }
        >
          <Heart className={isLiked ? "fill-current" : ""} />
        </Button>
      </div>

      <LinkFormSection
        showLinkForm={showLinkForm}
        onClose={() => setShowLinkForm(false)}
        onSubmit={handleSubmit}
        onProvideDataChange={setProvideData}
      />
    </>
  );
}
