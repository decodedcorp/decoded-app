'use client';

import { useState, useMemo } from 'react';
import { HoverItem } from '@/types/model.d';

export type Category = string;

interface UseCategoriesProps {
  itemList: HoverItem[];
  initialCategory?: Category;
}

export function useCategories({ itemList, initialCategory }: UseCategoriesProps) {
  const defaultCategory = useMemo(() => {
    const firstItem = itemList.find(item => item.info?.item?.item?.metadata?.item_class);
    return firstItem?.info?.item?.item?.metadata?.item_class || '';
  }, [itemList]);

  const [activeCategory, setActiveCategory] = useState<Category>(initialCategory || defaultCategory);

  const availableCategories = useMemo(() => {
    const categories = new Set<Category>();
    
    itemList.forEach(item => {
      const itemClass = item.info?.item?.item?.metadata?.item_class;
      if (itemClass) {
        categories.add(itemClass);
      }
    });

    return Array.from(categories);
  }, [itemList]);

  const filteredItems = useMemo(() => {
    return itemList.filter(
      item => item.info?.item?.item?.metadata?.item_class === activeCategory
    );
  }, [itemList, activeCategory]);

  const getCategoryCount = (category: Category) => {
    return itemList.filter(
      item => item.info?.item?.item?.metadata?.item_class === category
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