'use client';

import { RequestButtonProps } from '../types';
import { networkManager } from '@/lib/network/network';
import { StatusModal, StatusType, StatusMessageKey } from '@/components/ui/modal/status-modal';
import { useState } from 'react';

export function RequestButton({
  newMarkers,
  handleAdd,
  image,
  onClose,
}: RequestButtonProps) {
  const [modalConfig, setModalConfig] = useState<{
    type: StatusType;
    messageKey?: StatusMessageKey;
    isOpen: boolean;
    onClose: () => void;
  }>({
    type: 'warning',
    isOpen: false,
    onClose: () => setModalConfig((prev) => ({ ...prev, isOpen: false })),
  });

  const handleRequest = () => {
    if (sessionStorage.getItem('USER_DOC_ID') === null) {
      setModalConfig({
        type: 'warning',
        messageKey: 'login',
        isOpen: true,
        onClose: () => setModalConfig((prev) => ({ ...prev, isOpen: false })),
      });
      return;
    }

    const requestAddItem = {
      requestBy: sessionStorage.getItem('USER_DOC_ID'),
      items: newMarkers.map((marker) => ({
        position: {
          top: marker.y.toString(),
          left: marker.x.toString(),
        },
        context: marker.context || '',
      })),
    };

    console.log('Request URL:', `request/image/${image.docId}/add/item`);
    console.log('Request Data:', requestAddItem);

    networkManager
      .request(
        `user/${sessionStorage.getItem('USER_DOC_ID')}/image/${
          image.docId
        }/request/add`,
        'POST',
        requestAddItem
      )
      .then((response) => {
        console.log('Response:', response);
        if (response?.status === 200 || response?.status_code === 200) {
          handleAdd([]);
          alert('요청이 완료되었습니다.');
          onClose?.();
        } else {
          throw new Error('Invalid response status');
        }
      })
      .catch((error) => {
        console.error('Error details:', {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
          url: error.config?.url,
        });
        setModalConfig({
          type: 'error',
          messageKey: 'request',
          isOpen: true,
          onClose: () => setModalConfig((prev) => ({ ...prev, isOpen: false })),
        });
      });
  };

  return (
    <div className="px-8 py-5">
      <div className="max-w-[600px] mx-auto">
        <button
          onClick={handleRequest}
          className={`
                w-full px-4 py-3 rounded-lg text-sm font-medium transition-colors duration-200
                bg-gray-400/10 text-gray-400 hover:bg-[#EAFD66]
                ${
                  newMarkers.length === 0
                    ? 'cursor-not-allowed opacity-50'
                    : 'hover:text-gray-900'
                }
              `}
          disabled={newMarkers.length === 0}
        >
          요청하기 {newMarkers.length > 0 && `(${newMarkers.length})`}
        </button>
      </div>
      <StatusModal
        isOpen={modalConfig.isOpen}
        onClose={modalConfig.onClose}
        type={modalConfig.type}
        messageKey={modalConfig.messageKey}
      />
    </div>
  );
}
