'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils/style';
import { DetailsList } from '../server/details-list';
import { ProcessedImageData } from '@/lib/api/_types/image';
import { useRouter, useSearchParams } from 'next/navigation';

interface MobileDetailsListProps {
  imageData: ProcessedImageData;
  selectedItemId?: string;
}

export function MobileDetailsList({ imageData, selectedItemId }: MobileDetailsListProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeMarker, setActiveMarker] = useState<string | undefined>(undefined);
  const router = useRouter();
  const searchParams = useSearchParams();

  // 선택된 아이템이 변경되면 패널 열기
  useEffect(() => {
    if (selectedItemId) {
      setIsOpen(true);
      setActiveMarker(selectedItemId);
    }
  }, [selectedItemId]);

  // 패널이 닫힐 때 URL 초기화
  const handleClose = () => {
    setIsOpen(false);
    // URL에서 selectedItem 파라미터 제거
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.delete('selectedItem');
    router.replace(`?${newSearchParams.toString()}`);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 오버레이 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/60 z-40"
          />
          
          {/* 슬라이드업 패널 */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className={cn(
              'fixed bottom-0 left-0 right-0 z-50',
              'bg-[#1A1A1A] rounded-t-2xl',
              'h-[90vh] overflow-y-auto', // 높이 조정
              'pb-safe' // iOS safe area 대응
            )}
          >
            {/* 드래그 핸들 */}
            <div className="w-full flex justify-center py-2">
              <div className="w-12 h-1 rounded-full bg-white/20" />
            </div>

            {/* 헤더 */}
            <div className="sticky top-0 flex items-center justify-between px-4 py-3 border-b border-white/10 bg-[#1A1A1A]">
              <h3 className="text-base font-medium text-white">아이템 정보</h3>
              <button
                onClick={handleClose}
                className="p-2 rounded-full hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5 text-white/60" />
              </button>
            </div>

            {/* 컨텐츠 */}
            <div className="p-4 h-full">
              <DetailsList
                imageData={imageData}
                selectedItemId={activeMarker}
              />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
} 