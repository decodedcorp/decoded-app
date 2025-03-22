'use client';

import { HoverItem, DetailItemDocument, ItemDocument } from '@/types/model.d';
import HeaderSection from './header-section';
import ItemInfoSection from '@/app/details/[imageId]/item-detail/server/item-info-section';
import LinkFormSection from '@/app/details/[imageId]/components/server/modal/link-form-section';
import LinkListSection from './link-list-section';
import { useLinkFormModal } from '@/app/details/utils/hooks/use-link-form-modal';
import { useLinkFormSubmit } from '@/app/details/utils/hooks/use-link-form-submit';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

interface ClientItemDetailActionsProps {
  item: HoverItem;
  itemDocument: DetailItemDocument;
  onClose: () => void;
}

export function ClientItemDetailActions({
  item,
  itemDocument,
  onClose,
}: ClientItemDetailActionsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const {
    showLinkForm,
    provideData,
    openModal,
    closeModal,
    setProvideData,
    resetForm,
  } = useLinkFormModal();

  const { handleSubmit } = useLinkFormSubmit(item, itemDocument);

  // URL 변경 감지
  useEffect(() => {
    const handleNavigation = () => {
      const currentUrl = new URL(window.location.href);
      const itemId = currentUrl.searchParams.get('itemId');
      
      if (!itemId) {
        if (showLinkForm) {
          closeModal();
        }
        onClose();
      }
    };

    // popstate 이벤트 리스너 등록
    window.addEventListener('popstate', handleNavigation);
    
    // 현재 URL 체크
    const itemId = searchParams.get('itemId');
    if (!itemId) {
      if (showLinkForm) {
        closeModal();
      }
      onClose();
    }

    return () => {
      window.removeEventListener('popstate', handleNavigation);
    };
  }, [searchParams, showLinkForm, closeModal, onClose]);

  
  // URL 업데이트 함수
  const updateUrl = (newItemId: string | null) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    
    if (newItemId) {
      current.set('itemId', newItemId);
    } else {
      current.delete('itemId');
    }

    const search = current.toString();
    const query = search ? `?${search}` : '';
    router.push(`${pathname}${query}`, { scroll: false });
  };

  // 모달이 열릴 때
  const handleOpenModal = () => {
    openModal();
    updateUrl(itemDocument._id);
  };

  // 닫기 처리
  const handleClose = () => {
    closeModal();
    updateUrl(null);
    onClose();
  };

  const onSubmit = async () => {
    const success = await handleSubmit(provideData);
    if (success) {
      resetForm();
    }
  };

  return (
    <>
      <HeaderSection onClose={handleClose} />
      <ItemInfoSection 
        item={itemDocument as ItemDocument} 
        onProvideClick={handleOpenModal} 
      />
      <LinkListSection item={itemDocument} />
      <LinkFormSection
        showLinkForm={showLinkForm}
        onClose={closeModal}
        onSubmit={onSubmit}
        onProvideDataChange={setProvideData}
      />
    </>
  );
}
