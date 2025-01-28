import { networkManager } from '@/lib/network/network'; 

export async function getImageContextOptions() {
  const response = await networkManager.request(`image/image-context`, 'GET');
  return response.data as string[];
} 