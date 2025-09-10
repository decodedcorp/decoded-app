import { useQuery } from '@tanstack/react-query';
import { ChannelsService } from '@/api/generated/services/ChannelsService';
import { queryKeys } from '@/lib/api/queryKeys';

interface UseChannelDetailParams {
  channelId: string;
  enabled?: boolean;
}

export function useChannelDetail({ channelId, enabled = true }: UseChannelDetailParams) {
  return useQuery({
    queryKey: queryKeys.channels.detail(channelId),
    queryFn: () => ChannelsService.getChannelChannelsChannelIdGet(channelId),
    enabled: enabled && !!channelId,
    staleTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    retry: 3,
  });
}
