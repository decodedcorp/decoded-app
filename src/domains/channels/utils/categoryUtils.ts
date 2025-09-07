import { ChannelResponse } from '@/api/generated/models/ChannelResponse';

export interface CategoryOption {
  id: string;
  label: string;
  count: number;
}

export interface SubcategoryOption {
  id: string;
  label: string;
  categoryId: string;
  count: number;
}

export function extractCategoriesFromChannels(channels: ChannelResponse[]): CategoryOption[] {
  const categoryMap = new Map<string, number>();

  channels.forEach(channel => {
    if (channel.category) {
      const category = channel.category.toLowerCase();
      categoryMap.set(category, (categoryMap.get(category) || 0) + 1);
    }
  });

  const categories: CategoryOption[] = [
    { id: 'all', label: 'All Categories', count: channels.length }
  ];

  Array.from(categoryMap.entries())
    .sort(([, countA], [, countB]) => countB - countA) // Sort by count desc
    .forEach(([category, count]) => {
      categories.push({
        id: category,
        label: category.split(' ').map(word => 
          word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' '),
        count
      });
    });

  return categories;
}

export function extractSubcategoriesFromChannels(
  channels: ChannelResponse[], 
  selectedCategory?: string
): SubcategoryOption[] {
  const subcategoryMap = new Map<string, { categoryId: string; count: number }>();

  channels.forEach(channel => {
    if (channel.subcategory && channel.category) {
      const category = channel.category.toLowerCase();
      const subcategory = channel.subcategory.toLowerCase();
      
      // If category filter is active, only include subcategories from that category
      if (selectedCategory && selectedCategory !== 'all' && category !== selectedCategory) {
        return;
      }

      const key = `${category}-${subcategory}`;
      if (!subcategoryMap.has(key)) {
        subcategoryMap.set(key, { categoryId: category, count: 0 });
      }
      subcategoryMap.get(key)!.count++;
    }
  });

  const subcategories: SubcategoryOption[] = [
    { 
      id: 'all', 
      label: 'All Subcategories', 
      categoryId: 'all',
      count: selectedCategory === 'all' 
        ? channels.length 
        : channels.filter(c => c.category?.toLowerCase() === selectedCategory).length
    }
  ];

  Array.from(subcategoryMap.entries())
    .sort(([, a], [, b]) => b.count - a.count) // Sort by count desc
    .forEach(([key, { categoryId, count }]) => {
      const subcategory = key.split('-')[1];
      subcategories.push({
        id: subcategory,
        label: subcategory.split(' ').map(word => 
          word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' '),
        categoryId,
        count
      });
    });

  return subcategories;
}

export function filterChannelsByCategory(
  channels: ChannelResponse[], 
  category?: string,
  subcategory?: string
): ChannelResponse[] {
  let filtered = [...channels];

  if (category && category !== 'all') {
    filtered = filtered.filter(channel => 
      channel.category?.toLowerCase() === category.toLowerCase()
    );
  }

  if (subcategory && subcategory !== 'all') {
    filtered = filtered.filter(channel => 
      channel.subcategory?.toLowerCase() === subcategory.toLowerCase()
    );
  }

  return filtered;
}