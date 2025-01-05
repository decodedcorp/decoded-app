'use client';

import { useState } from 'react';
import { HoverItem, ItemDocument, ProvideData } from '@/types/model.d';
import { networkManager } from '@/lib/network/network';
import HeaderSection from './header-section';
import ItemInfoSection from './item-info-section';
import LinkFormSection from './components/modal/link-form-section';
import LinkListSection from './link-list-section';

interface ItemDetailProps {
  item: HoverItem;
  onClose: () => void;
}

export default function ItemDetail({ item, onClose }: ItemDetailProps) {
  const [provideData, setProvideData] = useState<ProvideData | null>(null);
  const [showLinkForm, setShowLinkForm] = useState(false);

  // Transform HoverItem to ItemDocument
  const itemDocument: ItemDocument = {
    Id: item.info.item.item._id,
    requester: '',
    requestedAt: new Date().toISOString(),
    like: 0,
    imgUrl: item.info.item.item.img_url || undefined,
    metadata: {
      name: item.info.item.item.metadata.name || undefined,
      category: item.info.item.item.metadata.category || undefined,
      description: item.info.item.item.metadata.description || undefined,
    },
  };

  const handleSubmit = async () => {
    if (!provideData) {
      alert('정보를 입력해주세요.');
      return;
    }
    const providerId = sessionStorage.getItem('USER_DOC_ID');
    if (!providerId) {
      alert('로그인이 필요합니다.');
      return;
    }
    provideData.provider = providerId;
    await networkManager
      .request(
        `image/${item.imageDocId}/provide/item/${itemDocument.Id}`,
        'POST',
        provideData
      )
      .then(() => {
        alert('제공 요청이 완료되었습니다.');
        setShowLinkForm(false);
      })
      .catch((err) => {
        alert('제공 요청에 실패하였습니다.');
      });
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="h-auto flex flex-col">
        <HeaderSection onClose={onClose} />
        <ItemInfoSection
          item={itemDocument}
          onProvideClick={() => setShowLinkForm(true)}
        />
        <LinkListSection item={itemDocument} />
        <LinkFormSection
          showLinkForm={showLinkForm}
          onClose={() => setShowLinkForm(false)}
          onSubmit={() => {
            if (provideData) {
              handleSubmit();
              setProvideData(null);
            }
          }}
          onProvideDataChange={setProvideData}
        />
      </div>
    </div>
  );
}
