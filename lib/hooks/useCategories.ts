'use client';

import { useState, useMemo } from 'react';
import { HoverItem } from '@/types/model';

export type Category = 'FASHION' | 'INTERIOR';

interface UseCategoriesProps {
  itemList: HoverItem[];
  initialCategory?: Category;
}

export function useCategories({ itemList, initialCategory = 'FASHION' }: UseCategoriesProps) {
  const [activeCategory, setActiveCategory] = useState<Category>(initialCategory);

  const availableCategories = useMemo(() => {
    const categories = new Set<Category>();
    
    itemList.forEach(item => {
      const itemClass = item.info?.item?.item?.metadata?.item_class?.toUpperCase();
      if (itemClass === 'FASHION' || itemClass === 'INTERIOR') {
        categories.add(itemClass as Category);
      }
    });

    return Array.from(categories);
  }, [itemList]);

  const filteredItems = useMemo(() => {
    return itemList.filter(
      item => item.info?.item?.item?.metadata?.item_class?.toUpperCase() === activeCategory
    );
  }, [itemList, activeCategory]);

  const getCategoryCount = (category: Category) => {
    return itemList.filter(
      item => item.info?.item?.item?.metadata?.item_class?.toUpperCase() === category
    ).length;
  };

  return {
    activeCategory,
    setActiveCategory,
    availableCategories,
    filteredItems,
    getCategoryCount,
  };
} 