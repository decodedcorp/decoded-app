'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { ChannelsService } from '@/api/generated/services/ChannelsService';
import type { BannerUpdate } from '@/api/generated/models/BannerUpdate';
import { useTranslations } from 'next-intl';

interface UseChannelBannerProps {
  channelId: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export const useChannelBanner = ({ 
  channelId, 
  onSuccess, 
  onError 
}: UseChannelBannerProps) => {
  const queryClient = useQueryClient();
  const t = useTranslations('common.toast.banner');

  // Update banner mutation
  const updateBannerMutation = useMutation({
    mutationFn: async (bannerBase64: string) => {
      const bannerUpdate: BannerUpdate = {
        banner_base64: bannerBase64,
      };
      
      return ChannelsService.updateBannerChannelsChannelIdBannerPatch(
        channelId,
        bannerUpdate
      );
    },
    onSuccess: () => {
      // Invalidate channel queries to refetch updated data
      queryClient.invalidateQueries({ 
        queryKey: ['channel', channelId] 
      });
      queryClient.invalidateQueries({ 
        queryKey: ['channels'] 
      });
      
      toast.success(t('updated'));
      onSuccess?.();
    },
    onError: (error: Error) => {
      console.error('Failed to update banner:', error);
      toast.error(t('updateFailed'));
      onError?.(error);
    },
  });

  return {
    updateBanner: updateBannerMutation.mutate,
    updateBannerAsync: updateBannerMutation.mutateAsync,
    isUpdating: updateBannerMutation.isPending,
    error: updateBannerMutation.error,
    isError: updateBannerMutation.isError,
    isSuccess: updateBannerMutation.isSuccess,
    reset: updateBannerMutation.reset,
  };
};