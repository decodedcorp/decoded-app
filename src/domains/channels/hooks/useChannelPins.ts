import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { PinsService } from '@/api/generated/services/PinsService';
import { PinTargetType } from '@/api/generated/models/PinTargetType';
import { PinResponse } from '@/api/generated/models/PinResponse';
import { PinCreateRequest } from '@/api/generated/models/PinCreateRequest';
import { UnifiedChannelPinsResponse } from '@/api/generated/models/UnifiedChannelPinsResponse';
import { UnifiedPinnedItem } from '@/api/generated/models/UnifiedPinnedItem';
import { queryKeys } from '@/lib/api/queryKeys';
import { refreshOpenAPIToken } from '@/api/hooks/useApi';
import { toast } from 'react-hot-toast';
import { useSimpleToastMutation } from '@/lib/hooks/useToastMutation';
import { useCommonTranslation } from '@/lib/i18n/hooks';

/**
 * 채널의 pinned 컨텐츠 목록을 조회하는 Hook
 */
export const useChannelPins = (channelId: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: [...queryKeys.pins.byChannel(channelId), 'unified'],
    queryFn: async () => {
      refreshOpenAPIToken();
      
      try {
        const result = await PinsService.getUnifiedChannelPinsPinsChannelsChannelIdUnifiedGet(
          channelId,
          1,
          20 // 최대 20개 pin 조회
        );
        
        console.log('[useChannelPins] Fetched pins:', result);
        return result;
      } catch (error) {
        console.error('[useChannelPins] Error fetching pins:', error);
        throw error;
      }
    },
    enabled: enabled && !!channelId,
    staleTime: 30 * 1000, // 30초
    gcTime: 5 * 60 * 1000, // 5분
    refetchOnWindowFocus: false,
    retry: 1,
  });
};

/**
 * 컨텐츠 pin을 추가하는 Hook (note 지원)
 */
export const usePinContent = () => {
  const queryClient = useQueryClient();

  return useSimpleToastMutation<
    PinResponse,
    Error,
    { contentId: string; channelId: string; pinOrder?: number; note?: string }
  >(
    async ({ contentId, channelId, pinOrder, note }) => {
      refreshOpenAPIToken();
      
      console.log('[usePinContent] Pinning content:', { contentId, channelId, pinOrder, note });
      
      const pinRequest: PinCreateRequest = {
        channel_id: channelId,
        target_type: PinTargetType.CONTENT,
        target_id: contentId,
        pin_order: pinOrder || null,
        note: note || null
      };
      
      return PinsService.createPinPinsPost(pinRequest);
    },
    {
      actionName: 'Pin content',
      toastId: 'pin-content',
      onSuccess: (response, { channelId }) => {
        console.log('[usePinContent] Content pinned successfully:', response);
        
        // Pin 관련 쿼리 무효화
        queryClient.invalidateQueries({ 
          queryKey: queryKeys.pins.byChannel(channelId) 
        });
        
        // 채널 컨텐츠 쿼리도 무효화 (pin 상태 반영)
        queryClient.invalidateQueries({ 
          queryKey: queryKeys.contents.byChannel(channelId) 
        });
      },
      onError: (error, { contentId }) => {
        console.error('[usePinContent] Failed to pin content:', contentId, error);
      },
    }
  );
};

/**
 * 컨텐츠 pin을 제거하는 Hook
 */
export const useUnpinContent = () => {
  const queryClient = useQueryClient();

  return useSimpleToastMutation<
    any,
    Error,
    { contentId: string; channelId: string }
  >(
    async ({ contentId, channelId }) => {
      refreshOpenAPIToken();
      
      console.log('[useUnpinContent] Unpinning content:', { contentId, channelId });
      
      return PinsService.unpinContentPinsContentContentIdPinDelete(
        contentId,
        channelId
      );
    },
    {
      actionName: 'Unpin content',
      toastId: 'unpin-content',
      onSuccess: (_, { channelId }) => {
        console.log('[useUnpinContent] Content unpinned successfully');
        
        // Pin 관련 쿼리 무효화
        queryClient.invalidateQueries({ 
          queryKey: queryKeys.pins.byChannel(channelId) 
        });
        
        // 채널 컨텐츠 쿼리도 무효화
        queryClient.invalidateQueries({ 
          queryKey: queryKeys.contents.byChannel(channelId) 
        });
      },
      onError: (error, { contentId }) => {
        console.error('[useUnpinContent] Failed to unpin content:', contentId, error);
      },
    }
  );
};

/**
 * Pin 순서를 변경하는 Hook
 */
export const useReorderPins = () => {
  const queryClient = useQueryClient();
  const t = useCommonTranslation();

  return useMutation({
    mutationFn: async ({ 
      channelId, 
      pinOrders 
    }: { 
      channelId: string; 
      pinOrders: Array<{ target_id: string; target_type: PinTargetType; pin_order: number }> 
    }) => {
      refreshOpenAPIToken();
      
      console.log('[useReorderPins] Reordering pins:', { channelId, pinOrders });
      
      return PinsService.reorderPinsPinsChannelsChannelIdReorderPatch(channelId, {
        pin_orders: pinOrders,
      });
    },
    onMutate: async ({ channelId, pinOrders }) => {
      // 낙관적 업데이트를 위해 쿼리 취소
      await queryClient.cancelQueries({ 
        queryKey: [...queryKeys.pins.byChannel(channelId), 'unified'] 
      });

      // 이전 데이터 스냅샷
      const previousPins = queryClient.getQueryData<UnifiedChannelPinsResponse>(
        [...queryKeys.pins.byChannel(channelId), 'unified']
      );

      // 낙관적 업데이트: 순서 변경 반영
      if (previousPins) {
        const updatedPins = { ...previousPins };
        
        // pinOrders에 따라 items 배열 재정렬
        if (updatedPins.items) {
          updatedPins.items = updatedPins.items.map((pin: UnifiedPinnedItem) => {
            const newOrder = pinOrders.find(
              order => order.target_id === pin.id && 
                      order.target_type === (pin.type === 'content' ? PinTargetType.CONTENT : PinTargetType.FOLDER)
            );
            
            if (newOrder) {
              return { ...pin, pin_order: newOrder.pin_order };
            }
            return pin;
          }).sort((a: UnifiedPinnedItem, b: UnifiedPinnedItem) => a.pin_order - b.pin_order);
        }

        queryClient.setQueryData(
          [...queryKeys.pins.byChannel(channelId), 'unified'],
          updatedPins
        );
      }

      return { previousPins };
    },
    onSuccess: (response, { channelId }) => {
      console.log('[useReorderPins] Pins reordered successfully:', response);
      toast.success(t.toast.pins.orderUpdated());
      
      // 서버 데이터로 다시 동기화
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.pins.byChannel(channelId) 
      });
    },
    onError: (error, { channelId }, context) => {
      console.error('[useReorderPins] Failed to reorder pins:', error);
      toast.error(t.toast.pins.orderUpdateFailed());
      
      // 실패 시 이전 데이터로 롤백
      if (context?.previousPins) {
        queryClient.setQueryData(
          [...queryKeys.pins.byChannel(channelId), 'unified'],
          context.previousPins
        );
      }
    },
  });
};

/**
 * 컨텐츠가 pin되어 있는지 확인하는 Hook
 */
export const useIsContentPinned = (channelId: string, contentId: string) => {
  const { data: pinsData } = useChannelPins(channelId);
  
  const isPinned = pinsData?.items?.some(
    (pin: UnifiedPinnedItem) => pin.id === contentId && pin.type === 'content'
  ) ?? false;
  
  return { isPinned };
};

/**
 * Pin 토글 Hook (pin/unpin) - note 지원
 */
export const useTogglePin = () => {
  const pinMutation = usePinContent();
  const unpinMutation = useUnpinContent();
  
  const togglePin = async (
    contentId: string, 
    channelId: string, 
    isPinned: boolean,
    options?: { pinOrder?: number; note?: string }
  ) => {
    if (isPinned) {
      return unpinMutation.mutateAsync({ contentId, channelId });
    } else {
      return pinMutation.mutateAsync({ 
        contentId, 
        channelId, 
        pinOrder: options?.pinOrder,
        note: options?.note 
      });
    }
  };
  
  return {
    togglePin,
    isLoading: pinMutation.isPending || unpinMutation.isPending,
    error: pinMutation.error || unpinMutation.error,
  };
};