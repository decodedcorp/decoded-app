'use client';
import { useState, useEffect } from 'react';
import { Period, ApiResponse } from '../../types';
import { networkManager } from '@/lib/network/network';

const ALL_PERIODS: Period[] = ['daily', 'weekly', 'monthly', 'yearly'];

export function useAvailablePeriods() {
  const [periodData, setPeriodData] = useState<Record<Period, number>>({
    daily: 0,
    weekly: 0,
    monthly: 0,
    yearly: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchAllPeriodsData() {
      try {
        const results = await Promise.all(
          ALL_PERIODS.map(async (p) => {
            try {
              const response = await networkManager.request<ApiResponse>(
                `metrics/trending/items?limit=9&period=${p}`,
                'GET'
              );
              return response.data?.length || 0;
            } catch (error) {
              console.error(`Error fetching data for period ${p}:`, error);
              return 0;
            }
          })
        );

        if (!isMounted) return;

        const newPeriodData = ALL_PERIODS.reduce((acc, period, index) => {
          acc[period] = results[index];
          return acc;
        }, {} as Record<Period, number>);

        setPeriodData(newPeriodData);
      } catch (err) {
        if (!isMounted) return;
        console.error('Failed to fetch period data:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch period data'));
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchAllPeriodsData();

    return () => {
      isMounted = false;
    };
  }, []);

  const availablePeriods = ALL_PERIODS.filter((p) => periodData[p] >= 3);

  return {
    periodData,
    availablePeriods,
    isLoading,
    error,
  };
} 