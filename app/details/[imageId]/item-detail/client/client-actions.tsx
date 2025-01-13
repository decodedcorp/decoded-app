'use client';

import { HoverItem, ItemDocument } from '@/types/model.d';
import HeaderSection from './header-section';
import ItemInfoSection from '@/app/details/[imageId]/item-detail/server/item-info-section';
import LinkFormSection from '@/app/details/[imageId]/components/server/modal/link-form-section';
import LinkListSection from './link-list-section';
import { useLinkFormModal } from '@/app/details/utils/hooks/use-link-form-modal';
import { useLinkFormSubmit } from '@/app/details/utils/hooks/use-link-form-submit';

interface ClientItemDetailActionsProps {
  item: HoverItem;
  itemDocument: ItemDocument;
  onClose: () => void;
}

export function ClientItemDetailActions({
  item,
  itemDocument,
  onClose,
}: ClientItemDetailActionsProps) {
  const {
    showLinkForm,
    provideData,
    openModal,
    closeModal,
    setProvideData,
    resetForm,
  } = useLinkFormModal();

  const { handleSubmit } = useLinkFormSubmit(item, itemDocument);

  const onSubmit = async () => {
    const success = await handleSubmit(provideData);
    if (success) {
      resetForm();
    }
  };

  return (
    <>
      <HeaderSection onClose={onClose} />
      <ItemInfoSection item={itemDocument} onProvideClick={openModal} />
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
