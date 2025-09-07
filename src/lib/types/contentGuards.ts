/**
 * Content type guard functions
 */
import { ContentType } from '@/lib/types/ContentType';

import { UnifiedContent } from './contentTypes';

export const isImageContent = (
  content: UnifiedContent,
): content is UnifiedContent & { imageContent: NonNullable<UnifiedContent['imageContent']> } => {
  return content.type === ContentType.IMAGE && !!content.imageContent;
};

export const isVideoContent = (
  content: UnifiedContent,
): content is UnifiedContent & { videoContent: NonNullable<UnifiedContent['videoContent']> } => {
  return content.type === ContentType.VIDEO && !!content.videoContent;
};

export const isLinkContent = (
  content: UnifiedContent,
): content is UnifiedContent & { linkContent: NonNullable<UnifiedContent['linkContent']> } => {
  return content.type === ContentType.LINK && !!content.linkContent;
};