import { Period } from '../../components/period-selector';
import { networkManager } from '@/lib/network/network';
import { useEffect, useState } from 'react';

interface ApiResponse {
  status_code: number;
  description: string;
  data: any[];
}

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
    async function fetchAllPeriodsData() {
      const newPeriodData: Record<Period, number> = {
        daily: 0,
        weekly: 0,
        monthly: 0,
        yearly: 0,
      };

      try {
        await Promise.all(
          ALL_PERIODS.map(async (p) => {
            try {
              const response = await networkManager.request<ApiResponse>(
                `metrics/trending/items?limit=9&period=${p}`,
                'GET'
              );
              newPeriodData[p] = response.data?.length || 0;
            } catch (error) {
              console.error(`Error fetching ${p} data:`, error);
              newPeriodData[p] = 0;
            }
          })
        );

        setPeriodData(newPeriodData);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch period data'));
      } finally {
        setIsLoading(false);
      }
    }

    fetchAllPeriodsData();
  }, []);

  const availablePeriods = ALL_PERIODS.filter((p) => periodData[p] >= 3);

  return {
    periodData,
    availablePeriods,
    isLoading,
    error,
  };
} 