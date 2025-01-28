import { networkManager } from '@/lib/network/network';
//   /image/{image_doc_id}/artist/{artist_doc_id}

export const useArtistRelated = async (imageId: string, artistId: string) => {
  const response = await networkManager.request(
    `/image/${imageId}/artist/${artistId}`,
    'GET'
  );
  return response.data;
};