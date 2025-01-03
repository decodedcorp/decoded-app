import { useState, useEffect } from 'react';
import { provideAPI } from '@/lib/api/provide';
import { ItemDocument, ProvideData } from '@/types/model';

export function useProvideData(imageId: string, itemId: string) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [item, setItem] = useState<ItemDocument | null>(null);

  useEffect(() => {
    async function fetchProvideData() {
      try {
        setLoading(true);
        const data = await provideAPI.getItemDetail(imageId, itemId);
        setItem(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch provide data'));
      } finally {
        setLoading(false);
      }
    }

    if (imageId && itemId) {
      fetchProvideData();
    }
  }, [imageId, itemId]);

  return { item, loading, error };
} 