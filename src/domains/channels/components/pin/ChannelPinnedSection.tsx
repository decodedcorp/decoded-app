'use client';

import React, { useEffect, useMemo } from 'react';

import { RiPushpin2Line } from 'react-icons/ri';
import { MdDragIndicator } from 'react-icons/md';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useChannelPinsStore } from '@/store/channelPinsStore';
import { canReorderPins } from '@/lib/utils/channelPermissions';
import { useUser } from '@/domains/auth/hooks/useAuth';
import { ChannelResponse } from '@/api/generated/models/ChannelResponse';
import { UnifiedPinnedItem } from '@/api/generated/models/UnifiedPinnedItem';
import { PinTargetType } from '@/api/generated/models/PinTargetType';
import { cn } from '@/lib/utils/cn';
import { useContentModalStore } from '@/store/contentModalStore';
import { ContentItem } from '@/lib/types/content';

import { useChannelPins, useReorderPins } from '../../hooks/useChannelPins';

// Helper function to extract title based on content type and metadata
const getContentTitle = (item: UnifiedPinnedItem): string => {
  // Check content metadata first for link preview title
  if (item.content_metadata) {
    // Link content - check various preview fields
    if ((item.content_metadata as any)?.link_preview_metadata?.title) {
      return (item.content_metadata as any).link_preview_metadata.title;
    }
    if ((item.content_metadata as any)?.linkPreview?.title) {
      return (item.content_metadata as any).linkPreview.title;
    }
    // Direct title in content metadata
    if (
      (item.content_metadata as any)?.title &&
      (item.content_metadata as any).title !== 'Untitled'
    ) {
      return (item.content_metadata as any).title;
    }
  }

  // Folder metadata
  if (item.type === 'folder' && item.folder_metadata?.description) {
    return item.folder_metadata.description;
  }

  // Use item.name if it's not "Untitled"
  if (item.name && item.name !== 'Untitled') {
    return item.name;
  }

  // AI generated metadata
  if ((item.content_metadata as any)?.ai_gen_metadata?.title) {
    return (item.content_metadata as any).ai_gen_metadata.title;
  }

  // Fallback
  return item.name || 'Untitled';
};

interface PinnedItemCardProps {
  item: UnifiedPinnedItem;
  isDraggable: boolean;
  onClick: () => void;
}

const PinnedItemCard: React.FC<PinnedItemCardProps> = ({ item, isDraggable, onClick }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.id,
    disabled: !isDraggable,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // API에서 제공하는 풍부한 메타데이터 사용
  const title = getContentTitle(item);
  const description =
    item.pin_note ||
    (item.type === 'content'
      ? item.content_metadata?.description
      : item.folder_metadata?.description) ||
    '';

  // 썸네일 URL (컨텐츠인 경우)
  const thumbnailUrl = item.type === 'content' ? item.content_metadata?.thumbnail_url : null;

  // 폴더 색상 (폴더인 경우)
  const folderColor =
    item.type === 'folder' ? item.folder_color || item.folder_metadata?.color : null;

  // 통계 정보
  const stats =
    item.type === 'content'
      ? {
          views: item.content_metadata?.views_count,
          likes: item.content_metadata?.likes,
          comments: item.content_metadata?.comments_count,
        }
      : {
          contentCount: item.content_count || item.folder_metadata?.content_count,
        };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'relative group bg-zinc-900/50 rounded-lg border border-zinc-800',
        'hover:bg-zinc-800/70 hover:border-zinc-700 transition-all duration-200',
        'cursor-pointer overflow-hidden',
        isDragging && 'opacity-50 z-50',
      )}
      onClick={onClick}
    >
      <div className="flex gap-3 p-3">
        {/* Drag handle */}
        {isDraggable && (
          <div
            {...attributes}
            {...listeners}
            className="flex items-center justify-center w-6 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-50 transition-opacity"
          >
            <MdDragIndicator className="w-4 h-4" />
          </div>
        )}

        {/* Thumbnail */}
        <div className="flex-shrink-0 w-20 h-20 rounded-md overflow-hidden bg-zinc-800">
          {thumbnailUrl ? (
            <img src={thumbnailUrl} alt={title} className="w-full h-full object-cover" />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center text-zinc-600"
              style={folderColor ? { backgroundColor: folderColor + '20', color: folderColor } : {}}
            >
              {item.type === 'content' ? (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              ) : (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                  />
                </svg>
              )}
            </div>
          )}
        </div>

        {/* Content info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-2">
            <h4 className="font-medium text-sm text-zinc-100 line-clamp-2 flex-1">{title}</h4>
            <div className="flex-shrink-0">
              <RiPushpin2Line className="w-4 h-4 text-blue-400 rotate-45" />
            </div>
          </div>

          {description && <p className="mt-1 text-xs text-zinc-400 line-clamp-2">{description}</p>}

          <div className="mt-2 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-zinc-500">
              <span className="capitalize">{item.type}</span>
              {item.content_type && (
                <>
                  <span>•</span>
                  <span>{item.content_type}</span>
                </>
              )}
            </div>

            {/* Stats */}
            {item.type === 'content' && (stats.views || stats.likes || stats.comments) ? (
              <div className="flex items-center gap-3 text-xs text-zinc-500">
                {stats.views && (
                  <div className="flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                    <span>{stats.views}</span>
                  </div>
                )}
                {stats.likes && (
                  <div className="flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                    <span>{stats.likes}</span>
                  </div>
                )}
                {stats.comments && (
                  <div className="flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                    <span>{stats.comments}</span>
                  </div>
                )}
              </div>
            ) : item.type === 'folder' && stats.contentCount ? (
              <div className="flex items-center gap-1 text-xs text-zinc-500">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
                <span>{stats.contentCount} items</span>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

interface ChannelPinnedSectionProps {
  channelId: string;
  channel?: ChannelResponse | null;
  onContentClick?: (contentId: string) => void;
  className?: string;
  maxItems?: number;
}

export const ChannelPinnedSection: React.FC<ChannelPinnedSectionProps> = ({
  channelId,
  channel,
  onContentClick,
  className,
  maxItems = 5,
}) => {
  const { user } = useUser();
  const { data: pinsData, isLoading } = useChannelPins(channelId);
  const { setPinnedItems } = useChannelPinsStore();
  const reorderMutation = useReorderPins();
  const openContentModal = useContentModalStore((state) => state.openModal);

  // 권한 체크 - user 타입 변환
  const userProfile = user
    ? {
        id: user.doc_id || user.email || '',
        email: user.email,
        username: user.nickname,
        full_name: user.nickname,
        avatar_url: '',
        registration_date: user.createdAt || new Date().toISOString(),
      }
    : null;

  const canReorder = canReorderPins(user, channel);

  // Store에 pinned items 저장
  useEffect(() => {
    if (pinsData?.items) {
      setPinnedItems(channelId, pinsData.items);
    }
  }, [pinsData, channelId, setPinnedItems]);

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  // Pinned items 정렬
  const sortedPins = useMemo(() => {
    if (!pinsData?.items) return [];
    return [...pinsData.items].sort((a, b) => a.pin_order - b.pin_order).slice(0, maxItems);
  }, [pinsData?.items, maxItems]);

  // 드래그 종료 핸들러
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id || !canReorder) return;

    const oldIndex = sortedPins.findIndex((item) => item.id === active.id);
    const newIndex = sortedPins.findIndex((item) => item.id === over.id);

    if (oldIndex === -1 || newIndex === -1) return;

    // 새로운 순서 계산
    const newOrder = arrayMove(sortedPins, oldIndex, newIndex);

    // pin_order 업데이트
    const pinOrders = newOrder.map((item, index) => ({
      target_id: item.id,
      target_type: item.type === 'content' ? PinTargetType.CONTENT : PinTargetType.FOLDER,
      pin_order: index,
    }));

    // API 호출
    try {
      await reorderMutation.mutateAsync({ channelId, pinOrders });
    } catch (error) {
      console.error('Failed to reorder pins:', error);
    }
  };

  // UnifiedPinnedItem을 ContentItem으로 변환
  const convertPinnedItemToContentItem = (item: UnifiedPinnedItem): ContentItem => {
    return {
      id: item.id,
      type: (item.content_type as any) || 'text',
      title: item.name,
      description: item.pin_note || item.content_metadata?.description || '',
      thumbnailUrl: item.content_metadata?.thumbnail_url || undefined,
      likes: item.content_metadata?.likes,
      views: item.content_metadata?.views_count,
      date: item.created_at,
      status: 'published' as any, // 기본값
    };
  };

  // 컨텐츠 클릭 핸들러
  const handleContentClick = (item: UnifiedPinnedItem) => {
    if (item.type === 'content') {
      if (onContentClick) {
        onContentClick(item.id);
      } else {
        // 기본 동작: 컨텐츠 모달 열기
        const contentItem = convertPinnedItemToContentItem(item);
        openContentModal(contentItem);
      }
    }
    // TODO: 폴더 클릭 처리
  };

  if (isLoading) {
    return (
      <div className={cn('space-y-3', className)}>
        <div className="flex items-center gap-2 mb-3">
          <RiPushpin2Line className="w-5 h-5 text-blue-400 rotate-45" />
          <h3 className="text-lg font-semibold text-zinc-100">Pinned</h3>
        </div>
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-zinc-900/50 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!sortedPins.length) {
    return null;
  }

  return (
    <div className={cn('space-y-3', className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <RiPushpin2Line className="w-5 h-5 text-blue-400 rotate-45" />
          <h3 className="text-lg font-semibold text-zinc-100">Pinned</h3>
          <span className="text-sm text-zinc-500">({sortedPins.length})</span>
        </div>
        {canReorder && sortedPins.length > 1 && (
          <span className="text-xs text-zinc-500">Drag to reorder</span>
        )}
      </div>

      {/* Pinned items list */}
      {canReorder && sortedPins.length > 1 ? (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext
            items={sortedPins.map((item) => item.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-2">
              {sortedPins.map((item) => (
                <PinnedItemCard
                  key={item.id}
                  item={item}
                  isDraggable={canReorder}
                  onClick={() => handleContentClick(item)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      ) : (
        <div className="space-y-2">
          {sortedPins.map((item) => (
            <PinnedItemCard
              key={item.id}
              item={item}
              isDraggable={false}
              onClick={() => handleContentClick(item)}
            />
          ))}
        </div>
      )}

      {/* Show more indicator */}
      {pinsData?.items && pinsData.items.length > maxItems && (
        <div className="text-xs text-zinc-500 text-center">
          +{pinsData.items.length - maxItems} more pinned items
        </div>
      )}
    </div>
  );
};
