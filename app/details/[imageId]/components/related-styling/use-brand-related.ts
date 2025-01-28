import { networkManager } from '@/lib/network/network';

export const useBrandRelated = async (brandId: string) => {
  const response = await networkManager.request(
    `/item/related/${brandId}`,
    'GET'
  );
  return response.data;
};
