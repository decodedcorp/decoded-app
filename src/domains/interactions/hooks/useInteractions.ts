import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InteractionsService } from '../../../api/generated';
import { queryKeys } from '../../../lib/api/queryKeys';

export const useLikeContent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (contentId: string) =>
      InteractionsService.createLikeLikesPost({ content_id: contentId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.contents.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.feeds.lists() });
    },
  });
};

export const useUnlikeContent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (contentId: string) =>
      InteractionsService.removeLikeLikesContentIdDelete(contentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.contents.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.feeds.lists() });
    },
  });
};
