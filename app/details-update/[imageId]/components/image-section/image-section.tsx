'use client';

import Image from 'next/image';
import { Heart } from 'lucide-react';
import { ItemButton } from '@/components/ui/item-marker';
import { useNavigateToDetail } from '@/lib/hooks/common/useNavigateToDetail';
import { ProcessedImageData } from '@/lib/api/_types/image';
import { cn } from '@/lib/utils/style';
import { ItemActionsWrapper } from '../item-list-section/client/item-actions-wrapper';
import { AddItemModal } from '@/components/ui/modal/add-item-modal';
import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { useItemDetail } from '../../context/item-detail-context';
import { LinkButton } from '@/backup/app/details-update/modal/link-button';

interface ImageSectionProps {
  imageData: ProcessedImageData;
  selectedItemId?: string;
  layoutType: string;
  className?: string;
}

export function ImageSection({
  imageData,
  selectedItemId,
  layoutType,
}: ImageSectionProps) {
  const navigateToDetail = useNavigateToDetail();
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
  const { selectedItemId: contextSelectedId } = useItemDetail();
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const parentContainerRef = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const threshold = 400; // 스크롤 시작 임계값
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;
      const scrollProgress = Math.min(scrollY / maxScroll, 1);

      if (parentContainerRef.current) {
        if (scrollY > threshold) {
          parentContainerRef.current.style.position = 'sticky';
          // 스크롤 진행도에 따라 top 값을 조정 (최소 100px, 최대 300px)
          const topValue = 100 + scrollProgress * 200;
          parentContainerRef.current.style.top = `${topValue}px`;
          parentContainerRef.current.style.zIndex = '10';
        } else {
          parentContainerRef.current.style.position = 'relative';
          parentContainerRef.current.style.top = '0';
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (contextSelectedId) {
      // 부모 컨테이너 애니메이션
      gsap.to(parentContainerRef.current, {
        maxWidth: '960px',
        marginLeft: 'auto',
        padding: '1rem',
        duration: 0.5,
        ease: 'power2.inOut',
      });

      // 이미지 컨테이너 애니메이션
      gsap.to(imageContainerRef.current, {
        width: '100%',
        duration: 0.5,
        ease: 'power2.inOut',
      });
    } else {
      // 부모 컨테이너 원래 상태로
      gsap.to(parentContainerRef.current, {
        maxWidth: '960px',
        marginLeft: 'auto',
        padding: '1rem',
        duration: 0.5,
        ease: 'power2.inOut',
      });

      // 이미지 컨테이너 원래 상태로
      gsap.to(imageContainerRef.current, {
        width: '100%',
        duration: 0.5,
        ease: 'power2.inOut',
      });
    }
  }, [contextSelectedId]);

  if (!imageData) return null;

  const allItems = imageData.items || [];

  return (
    <div
      ref={parentContainerRef}
      className="w-full sm:max-w-[960px] mx-auto px-0 sm:px-4 mb-0 sm:mb-8 lg:mb-16 transition-all duration-300"
    >
      <div
        ref={imageContainerRef}
        className="relative w-full transition-all duration-300"
      >
        <div ref={imageRef} className="relative w-full h-full">
          <div className="relative w-full h-full aspect-[4/5] overflow-hidden rounded-lg">
            <Image
              src={imageData.img_url}
              alt={Object.values(imageData.metadata)[0] || '이미지'}
              fill
              className="object-cover sm:object-cover w-full h-full"
              priority
              unoptimized
            />

            {allItems?.map((decodedItem, index) => {
              const top = parseFloat(decodedItem.position.top);
              const left = parseFloat(decodedItem.position.left);

              return (
                <div
                  key={decodedItem.item.item._id || index}
                  className="absolute -translate-x-1/2 -translate-y-1/2"
                  style={{
                    top: `${top}%`,
                    left: `${left}%`,
                  }}
                >
                  <ItemButton
                    item={{
                      pos: {
                        top: decodedItem.position.top,
                        left: decodedItem.position.left,
                      },
                      info: {
                        item: {
                          item: decodedItem.item.item,
                          brand_name: decodedItem.item.brand_name,
                          brand_logo_image_url:
                            decodedItem.item.brand_logo_image_url,
                        },
                      },
                      imageDocId: decodedItem.item.item._id,
                    }}
                    isActive={decodedItem.item.item._id === selectedItemId}
                  />
                </div>
              );
            })}
          </div>

          {/* 모바일 액션 버튼 섹션 */}
          <div className="lg:hidden mt-4 bg-[#1A1A1A] rounded-lg">
            <div className="px-4 py-3 flex items-center justify-between">
              <ItemActionsWrapper
                initialLikeCount={imageData.like}
                imageId={imageData.doc_id}
                layoutType={layoutType as 'masonry' | 'list'}
                render={({ likeCount, isLiked, isLoading, onLike }) => (
                  <>
                    <button
                      onClick={onLike}
                      disabled={isLoading}
                      className={cn(
                        'flex items-center gap-2 px-4 py-2 rounded-full',
                        'bg-white/5 hover:bg-white/10 transition-colors',
                        isLoading && 'opacity-50 cursor-not-allowed'
                      )}
                    >
                      <Heart
                        className={cn(
                          'w-5 h-5',
                          isLiked
                            ? 'fill-red-500 text-red-500'
                            : 'text-white/80/60'
                        )}
                      />
                      <span className="text-sm text-white/80/60">
                        {likeCount}
                      </span>
                    </button>

                    {layoutType === 'masonry' ? (
                      <LinkButton imageId={imageData.doc_id} />
                    ) : (
                      <button
                        onClick={() => setIsAddItemModalOpen(true)}
                        className={cn(
                          'px-6 py-2 rounded-full text-sm font-medium',
                          'bg-[#EAFD66] text-black hover:bg-[#EAFD66]/90 transition-colors'
                        )}
                      >
                        아이템 추가
                      </button>
                    )}
                  </>
                )}
              />
            </div>
          </div>

          {/* 모달 */}
          {isAddItemModalOpen && (
            <AddItemModal
              isOpen={isAddItemModalOpen}
              onClose={() => setIsAddItemModalOpen(false)}
              imageId={imageData.doc_id}
              requestUrl={`user/${sessionStorage.getItem(
                'USER_DOC_ID'
              )}/image/${imageData.doc_id}/request/add`}
            />
          )}
        </div>
      </div>
    </div>
  );
}
