'use client';

import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import { identityService, IdentityDoc } from '@/lib/api/requests/identity';

interface ArtistHeaderProps {
  artistId: string;
  artistName?: string;
}

export function ArtistHeader({ artistId, artistName }: ArtistHeaderProps) {
  const {
    data: artistResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['artistIdentity', artistId],
    queryFn: async () => {
      try {
        const response = await identityService.getIdentityInfo(artistId);
        return response;
      } catch (error) {
        console.error('아티스트 정보 가져오기 오류:', error);
        throw error;
      }
    },
    enabled: !!artistId,
  });

  // 실제 아티스트 데이터 객체 추출 (타입 안전하게)
  const artistInfo = artistResponse?.data?.docs as IdentityDoc | undefined;

  if (isLoading) {
    return (
      <div className="flex items-center space-x-4 mb-6">
        <div className="w-12 h-12 rounded-full bg-gray-700 animate-pulse"></div>
        <div className="h-5 bg-gray-700 rounded w-40 animate-pulse"></div>
      </div>
    );
  }

  if (error || (!artistInfo && !artistName)) {
    console.error('아티스트 정보를 가져오는데 실패했습니다:', error);
    return null;
  }

  // 아티스트 이름을 한국어 또는 영어로 가져오기
  const displayName =
    artistInfo?.name?.ko ||
    artistInfo?.name?.en ||
    artistName ||
    '알 수 없는 아티스트';

  return (
    <div className="flex items-center mb-6">
      <div className="flex items-center space-x-4">
        {artistInfo?.profile_image_url ? (
          <div className="w-12 h-12 rounded-full overflow-hidden">
            <Image
              src={artistInfo.profile_image_url}
              alt={displayName}
              width={48}
              height={48}
              className="object-cover"
            />
          </div>
        ) : (
          <div className="w-12 h-12 rounded-full bg-[#1A1A1A] flex items-center justify-center">
            <span className="text-lg font-bold text-[#EAFD66]">
              {displayName.charAt(0)}
            </span>
          </div>
        )}

        <div>
          <h3 className="text-xl font-medium text-white">{displayName}</h3>
          <p className="text-sm text-gray-400">{artistInfo?.category || ''}</p>
        </div>
      </div>
    </div>
  );
}
