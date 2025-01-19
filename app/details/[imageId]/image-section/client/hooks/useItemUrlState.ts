'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useEffect, useCallback, useState, useRef } from 'react';
import { HoverItem } from '@/types/model.d';

export function useItemUrlState(itemList: HoverItem[]) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [selectedItem, setSelectedItem] = useState<HoverItem | null>(null);
  const [isDetailVisible, setIsDetailVisible] = useState(false);
  const isNavigating = useRef(false);

  useEffect(() => {
    const itemId = searchParams.get('itemId');
    
    if (itemId && !isNavigating.current) {
      const item = itemList.find(item => item.info.item.item._id === itemId);
      if (item) {
        setSelectedItem(item);
        setIsDetailVisible(true);
      }
    } else if (!itemId) {
      setSelectedItem(null);
      setIsDetailVisible(false);
    }
    isNavigating.current = false;
  }, [itemList, searchParams]);

  const handleItemClick = useCallback((item: HoverItem) => {
    if (isNavigating.current) return;
    isNavigating.current = true;
    
    const newUrl = `${pathname}?itemId=${item.info.item.item._id}`;
    router.push(newUrl, { scroll: false });
    setSelectedItem(item);
    setIsDetailVisible(true);
  }, [pathname, router]);

  const handleBack = useCallback(() => {
    if (isNavigating.current) return;
    isNavigating.current = true;
    
    router.push(pathname, { scroll: false });
    setIsDetailVisible(false);
    setSelectedItem(null);
  }, [pathname, router]);

  return {
    selectedItem,
    setSelectedItem,
    isDetailVisible,
    handleItemClick,
    handleBack,
  };
} 