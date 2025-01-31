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

  const params = useParams();
  const imageId = params.imageId as string;

  useEffect(() => {
    const storedUserId = sessionStorage.getItem("USER_DOC_ID");
    setUserId(storedUserId);

    if (storedUserId && itemId) {
      checkInitialLikeStatus("items", itemId, storedUserId).then(
        (likeStatus) => {
          setIsLiked(likeStatus);
        }
      );
    }
  }, [itemId, checkInitialLikeStatus]);

  const handleLikeClick = async () => {
    if (!userId) return;

    const newLikeStatus = await toggleLike("item", itemId, userId, isLiked);
    setIsLiked((newLikeStatus) => !newLikeStatus);
  };

  const handleSubmit = async () => {
    if (!userId || !provideData.links[0]) {
      return;
    }

    try {
      setIsSubmitting(true);
      const path = `user/${userId}/image/${imageId}/provide/item/${itemId}`;
      const response = await networkManager.request(path, "POST", {
        provider: userId,
        links: provideData.links,
      });

      console.log("Response:", response);
      setShowLinkForm(false);
    } catch (error) {
      console.error("Error details:", error);
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
