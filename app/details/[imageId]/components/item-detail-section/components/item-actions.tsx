'use client';

import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { useState } from 'react';
import LinkFormSection from '../../modal/link-form-section';
import { ProvideData } from '@/types/model.d';
import { networkManager } from '@/lib/network/network';
import { useLocaleContext } from '@/lib/contexts/locale-context';
import { useStatusStore } from '@/components/ui/modal/status-modal/utils/store';
import { useLike } from '@/app/details/utils/hooks/use-like';

interface ItemActionsProps {
  itemId: string;
  imageId: string;
  likeCount: number;
}

export function ItemActions({ itemId, imageId, likeCount }: ItemActionsProps) {
  const { t } = useLocaleContext();
  const [showLinkForm, setShowLinkForm] = useState(false);
  const [provideData, setProvideData] = useState<ProvideData>({ links: [] });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const setStatus = useStatusStore((state) => state.setStatus);
  const userId =
    typeof window !== 'undefined'
      ? sessionStorage.getItem('USER_DOC_ID')
      : null;

  const {
    isLiked,
    likeCount: currentLikeCount,
    toggleLike,
  } = useLike({
    itemId,
    type: 'item',
    initialLikeCount: likeCount,
  });

  const handleLinkButtonClick = () => {
    if (!userId) {
      setStatus({
        type: 'warning',
        messageKey: 'login',
      });
      return;
    }
    setShowLinkForm(true);
  };

  const handleSubmit = async () => {
    if (!userId) {
      setStatus({
        type: 'warning',
        messageKey: 'login',
      });
      return;
    }

    if (isSubmitting) return;

    if (
      !provideData.links.length ||
      provideData.links.some((link) => !link.trim())
    ) {
      setStatus({
        type: 'warning',
        messageKey: 'empty_links',
        message: '링크를 입력해주세요.',
      });
      return;
    }

    if (!userId || !provideData.links[0]) {
      console.error('Invalid data:', { userId, link: provideData.links[0] });
      setStatus({
        type: 'error',
        message: '유효하지 않은 데이터입니다.',
      });
      return;
    }

    // URL 유효성 검사
    try {
      new URL(provideData.links[0].trim());
    } catch (e) {
      setStatus({
        type: 'error',
        message: '유효하지 않은 URL입니다.',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      setStatus({ type: 'loading', messageKey: 'submitting' });

      const requestData = {
        provider: userId,
        link: provideData.links[0].trim()
      };

      console.log('Request Data:', JSON.stringify(requestData, null, 2));
      console.log('User ID:', userId);
      console.log('Image ID:', imageId);
      console.log('Item ID:', itemId);

      const result = await networkManager.request(
        `user/${userId}/image/${imageId}/provide/item/${itemId}`,
        'POST',
        requestData
      );

      // undefined는 409 상황 (중복 요청)
      if (result === undefined) {
        setStatus({
          type: 'warning',
          messageKey: 'duplicate',
          message: '이미 요청한 링크입니다.',
        });
        return;
      }

      setStatus({
        type: 'success',
        messageKey: 'link_added',
        message: '링크가 성공적으로 추가되었습니다.',
      });
      setShowLinkForm(false);
      setProvideData({ links: [] });
    } catch (error: any) {
      console.error('Link submission error:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      setStatus({
        type: 'error',
        messageKey: 'link_error',
        message: '링크 추가 중 오류가 발생했습니다.',
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
          onClick={handleLinkButtonClick}
          disabled={isSubmitting}
        >
          {t.common.actions.addLink}
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={toggleLike}
          className={
            isLiked
              ? 'text-red-500 hover:text-red-600'
              : 'text-gray-500 hover:text-gray-600'
          }
        >
          <Heart className={isLiked ? 'fill-current' : ''} />
        </Button>
      </div>

      <LinkFormSection
        showLinkForm={showLinkForm}
        onClose={() => {
          setShowLinkForm(false);
          setProvideData({ links: [] });
        }}
        onSubmit={handleSubmit}
        onProvideDataChange={setProvideData}
      />
    </>
  );
}
