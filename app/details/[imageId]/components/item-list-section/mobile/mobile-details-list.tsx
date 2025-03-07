'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
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
  const router = useRouter();
  const searchParams = useSearchParams();

  // selectedItemId가 변경될 때 isOpen 상태 업데이트
  useEffect(() => {
    setIsOpen(!!selectedItemId);
  }, [selectedItemId]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    const params = new URLSearchParams(searchParams.toString());
    params.delete('selectedItem');
    const pathname = window.location.pathname;
    router.push(pathname + (params.toString() ? `?${params.toString()}` : ''));
  }, [searchParams, router]);

  const handleDragEnd = useCallback((_: any, info: PanInfo) => {
    if (info.velocity.y > 200 || info.offset.y > 100) {
      handleClose();
    }
  }, [handleClose]);

  // 애니메이션 설정 메모이제이션
  const animationConfig = useMemo(() => ({
    initial: { y: '100%' },
    animate: { y: 0 },
    exit: { y: '100%' },
    transition: { 
      type: 'spring',
      damping: 40,
      stiffness: 300,
      mass: 0.8
    }
  }), []);

  // 패널이 열려있을 때만 DetailsList 렌더링
  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/60 z-40"
          />
          
          <motion.div
            {...animationConfig}
            drag="y"
            dragConstraints={{ top: 0 }}
            dragElastic={0.1}
            dragMomentum={false}
            onDragEnd={handleDragEnd}
            className={cn(
              'fixed bottom-0 left-0 right-0 z-50',
              'bg-[#1A1A1A] rounded-t-2xl',
              'h-[85vh] max-h-[85vh]',
              'flex flex-col',
              'pb-safe'
            )}
          >
            {/* 드래그 핸들 */}
            <div 
              className="w-full flex justify-center py-6 flex-shrink-0 cursor-pointer" 
              onClick={handleClose}
            >
              <div className="w-12 h-1 rounded-full bg-white/20" />
            </div>
            {/* 컨텐츠 */}
            <div className="flex-1 overflow-y-auto overscroll-contain px-4">
              <DetailsList
                imageData={imageData}
                selectedItemId={selectedItemId}
              />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
} 