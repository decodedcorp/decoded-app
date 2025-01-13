'use client';

import { useState, useEffect } from 'react';
import { imagesAPI } from '@/lib/api/client/images';
import type { RandomImageResource, RandomItemResource } from '@/lib/api/client/images';

// 전역 캐시
let cachedResources: (RandomImageResource | RandomItemResource)[] | null = null;
let isLoading = false;
let loadPromise: Promise<void> | null = null;

export function useRandomResources() {
  const [resources, setResources] = useState<(RandomImageResource | RandomItemResource)[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadResources() {
      // 이미 캐시된 데이터가 있으면 사용
      if (cachedResources) {
        setResources(cachedResources);
        setLoading(false);
        return;
      }

      // 다른 인스턴스에서 로딩 중이면 기다림
      if (loadPromise) {
        await loadPromise;
        setResources(cachedResources!);
        setLoading(false);
        return;
      }

      // 새로운 로딩 시작
      if (!isLoading) {
        isLoading = true;
        loadPromise = (async () => {
          try {
            const response = await imagesAPI.getRandomResources();
            if (response.data?.resources) {
              cachedResources = response.data.resources.slice(0, 10);
              setResources(cachedResources);
            }
          } catch (err) {
            setError(err as Error);
            throw err;
          } finally {
            isLoading = false;
            loadPromise = null;
            setLoading(false);
          }
        })();

        await loadPromise;
      }
    }

    loadResources();
  }, []);

  return { resources, loading, error };
} 